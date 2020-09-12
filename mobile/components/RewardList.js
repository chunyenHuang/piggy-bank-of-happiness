import React, { useEffect, useState } from 'react';
import { StyleSheet, AsyncStorage, RefreshControl, ScrollView, Text } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import NumericInput from 'react-native-numeric-input';

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
  const [isLoading, setIsLoading] = useState(false);

  const handlerPress = (reward, value) => {
    reward.amount = value;
    onSelect(reward);
  };

  const renderRefreshingControl = () => {
    if (mode === 'select') return;
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
    const params = { organizationId };

    if (mode === 'select') {
      params.filter = {
        isActive: { eq: 1 },
        total: { gt: 1 },
      };
    }

    const rewards = await asyncListAll(listOrganizationRewards, params);
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={renderRefreshingControl()}
    >
      {mode === 'edit' &&
        <ModifyReward
          hideButton={true}
          item={toModifyItem}
          onClose={() => setToModifyItem(undefined)}
        />}
      {rewards
        .sort(sortBy('name', true))
        .sort(sortBy('requiredPoints'))
        .sort(sortBy('isActive', true))
        .map((reward, index)=>(
          <ListItem
            key={index}
            bottomDivider
            disabled={disabled}
            containerStyle={{ backgroundColor: reward.amount > 0 ? Colors.highlight : '#fff' }}
            onPress={mode === 'edit' ? () => {
              setToModifyItem(reward);
            }: undefined}
          >
            {/* {mode==='select' &&
              <Icon
                name={reward.isSelected ? 'md-checkbox-outline': 'md-square-outline'}
                // size={15}
                type='ionicon'
                containerStyle={{ paddingRight: 10 }}
              />} */}
            <ListItem.Content>
              <ListItem.Title>{reward.name}</ListItem.Title>
              <ListItem.Subtitle style={styles.subtitle}>{reward.description}</ListItem.Subtitle>
            </ListItem.Content>

            {!reward.isActive &&
              <Badge
                value={'停用中'}
                textStyle={styles.badgeTextInactive}
                badgeStyle={styles.badgeInactive}
              />}
            <Badge
              value={reward.requiredPoints / 100}
              textStyle={styles.badgeTextActive}
              badgeStyle={styles.badgeActive}
            />
            {mode === 'select' &&
              <NumericInput
                totalWidth={120}
                totalHeight={45}
                minValue={0}
                maxValue={reward.total}
                disabled={isLoading}
                // borderColor={'#fff'}
                // textColor={'#2189DC'}
                // leftButtonBackgroundColor={Colors.raised}
                // rightButtonBackgroundColor={Colors.primary}
                onChange={(value) => handlerPress(reward, value)} />
            }
            {mode === 'edit' &&
              <Text style={styles.amountContainer}>x {reward.total}</Text>}
            {mode === 'edit' &&
              <ListItem.Chevron />}
          </ListItem>
        ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    marginTop: 12,
    padding: 12,
    fontSize: 18,
    color: Colors.light,
  },
  amountContainer: {
    width: 40,
    textAlign: 'right',
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
