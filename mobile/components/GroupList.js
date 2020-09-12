import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, AsyncStorage } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from 'src/utils/request';
import { listOrganizationGroups } from 'src/graphql/queries';
import Colors from 'constants/Colors';
import ModifyGroup from 'components/ModifyGroup';
import check from 'src/permission/check';
import { onCreateOrganizationGroup, onUpdateOrganizationGroup } from 'src/graphql/subscriptions';

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  const load = async () => {
    setIsLoading(true);

    const params = {
      organizationId: await AsyncStorage.getItem('app:organizationId'),
      limit: 100,
    };
    const data = await asyncListAll(listOrganizationGroups, params);
    setGroups(data);

    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_PG__SUBSCRIPTION')) return;

      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationGroup))
        .subscribe({
          next: (event) => {
            if (event) {
              const newItem = event.value.data.onCreateOrganizationGroup;
              const matched = groups.find(({ id }) => id === newItem.id);
              if (!matched) {
                groups.unshift(newItem);
              } else {
                Object.assign(matched, newItem);
              }
              setGroups([...groups]);
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationGroup))
        .subscribe({
          next: (event) => {
            if (event) {
              const updatedItem = event.value.data.onUpdateOrganizationGroup;
              // remove the original one first if found
              const matched = groups.find(({ id }) => id === updatedItem.id);
              if (!matched) {
                groups.unshift(updatedItem);
              } else {
                Object.assign(matched, updatedItem);
              }
              setGroups([...groups]);
            }
          },
        });
    })();

    return () => {
      subscriptionCreate && subscriptionCreate.unsubscribe();
      subscriptionUpdate && subscriptionUpdate.unsubscribe();
    };
  }, [groups]);

  const getBadge = (group) => {
    if (group.isActive) {
      return null;
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
      <ModifyGroup
        hideButton={true}
        group={group}
        onClose={() => setGroup(undefined)}
      />
      {groups.map((group, index)=>(
        <ListItem
          key={index}
          bottomDivider
          onPress={() => setGroup(group)}
        >
          <ListItem.Content>
            <ListItem.Title>{group.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{group.description}</ListItem.Subtitle>
          </ListItem.Content>
          <Badge {...getBadge(group)} />
          <ListItem.Chevron />
        </ListItem>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: Colors.light,
    paddingTop: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 16,
  },
  badge: {
    height: 25,
    padding: 5,
  },
  badgeTextInactive: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  badgeInactive: {
    height: 25,
    padding: 5,
    backgroundColor: '#767577',
  },
});
