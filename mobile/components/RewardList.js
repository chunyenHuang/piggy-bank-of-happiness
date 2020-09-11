import React, { useEffect, useState } from 'react';
import { StyleSheet, AsyncStorage, RefreshControl, ScrollView } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { List } from 'react-native-paper';
import { Hub } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from 'src/utils/request';
import { sortBy } from 'src/utils/sorting';
import { listOrganizationRewards } from 'src/graphql/queries';
import Colors from 'constants/Colors';
import { onCreateOrganizationReward, onUpdateOrganizationReward } from 'src/graphql/subscriptions';
import ModifyReward from './ModifyReward';
import check from 'src/permission/check';

export default function RewardList({ mode = 'edit', onSelect, disabled = false }) {
  const [toModifyItem, setToModifyItem] = useState();
  const [rewards, setRewards] = useState([]);
  const [refresh, setRefresh] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  global.logger.debug(refresh);

  const handlerPress = (task) => {
    if (mode === 'select') {
      onSelect && onSelect(task);
      setRefresh(Date.now());
    }
  };

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  const load = async () => {
    mode === 'edit' && setIsLoading(true);
    mode === 'select' && Hub.dispatch('app', { event: 'loading' });

    const organizationId = await AsyncStorage.getItem('app:organizationId');
    const rewards = await asyncListAll(listOrganizationRewards, { organizationId });
    setRewards(rewards);

    mode === 'edit' && setIsLoading(false);
    mode === 'select' && Hub.dispatch('app', { event: 'loading-complete' });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_RWD__SUBSCRIPTION')) return;

      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationReward))
        .subscribe({
          next: (event) => {
            if (event) {
              load();
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationReward))
        .subscribe({
          next: (event) => {
            if (event) {
              load();
            }
          },
        });
    })();

    return () => {
      subscriptionCreate && subscriptionCreate.unsubscribe();
      subscriptionUpdate && subscriptionUpdate.unsubscribe();
    };
  }, []);

  const getBadge = (item) => {
    if (item.isActive) {
      return {
        value: item.requiredPoints / 100,
        textStyle: styles.badgeTextActive,
        badgeStyle: styles.badgeActive,
      };
    } else {
      return {
        value: '停用中',
        textStyle: styles.badgeTextInactive,
        badgeStyle: styles.badgeInactive,
      };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      {mode === 'edit' &&
        <ModifyReward
          hideButton={true}
          item={toModifyItem}
          onClose={() => setToModifyItem(undefined)}
        />}
      <List.Section>
        {rewards
          .sort(sortBy('name', true))
          .sort(sortBy('requiredPoints'))
          .sort(sortBy('isActive', true))
          .map((reward, index)=>(
            <ListItem
              key={index}
              // leftAvatar={{ source: { uri: randomAvatarUrl } }}
              containerStyle={{ backgroundColor: reward.isSelected? Colors.highlight : '#fff' }}
              title={reward.name}
              subtitle={reward.description}
              subtitleStyle={styles.subtitle}
              bottomDivider
              disabled={disabled}
              chevron={mode === 'edit'}
              leftIcon={mode==='select' ?
                <Icon
                  name={reward.isSelected ? 'md-checkbox-outline': 'md-square-outline'}
                  // size={15}
                  type='ionicon'
                  containerStyle={{ paddingRight: 10 }}
                /> : undefined}
              badge={getBadge(reward)}
              onPress={() => {
                if (mode === 'select') {
                  if (!reward.isSelected) {
                    setToModifyItem(reward);
                  } else {
                    reward.isSelected = !reward.isSelected;
                    handlerPress(reward);
                  }
                } else
                if (mode === 'edit') {
                  setToModifyItem(reward);
                }
              }}
            />
          ))}
      </List.Section>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 12,
    padding: 12,
    fontSize: 18,
    color: Colors.light,
  },
  subtitle: {
    fontSize: 10,
    color: Colors.light,
    marginTop: 5,
  },
  badgeTextActive: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 16,
  },
  badgeTextInactive: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  badgeActive: {
    height: 25,
    padding: 5,
  },
  badgeInactive: {
    height: 25,
    padding: 5,
    backgroundColor: '#767577',
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    // height: 360,
    borderRadius: 20,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  pointsRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: -50,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    paddingLeft: 32,
    paddingRight: 32,
  },
});
