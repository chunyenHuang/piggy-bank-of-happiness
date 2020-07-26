import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';
import { listOrganizationGroups, getOrgUsersByGroupByActive } from '../src/graphql/queries';
import { onCreateOrganizationUser, onUpdateOrganizationUser } from '../src/graphql/subscriptions';
import CustomSearchBar from './CustomSearchBar';
import check from '../src/permission/check';

export default function UserList() {
  const navigation = useNavigation();

  const [groups, setGroups] = useState([]);
  const [searchValue, setSearchValue] = useState('');
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

    const organizationId = await AsyncStorage.getItem('app:organizationId');

    const updatedGroups = (groups.length === 0) ? await asyncListAll(listOrganizationGroups, {
      organizationId,
      filter: {
        isActive: { eq: 1 },
      },
    }) : groups;

    console.log(updatedGroups);

    const promises = updatedGroups.map(async (group) => {
      const params = {
        groupId: group.id,
        filter: {
          role: { eq: 'User' },
        },
      };
      if (searchValue) {
        params.filter.name = { contains: searchValue };
      }
      group.users = await asyncListAll(getOrgUsersByGroupByActive, params);
      group.isExpanded = true;
    });

    await Promise.all(promises);

    setGroups([...updatedGroups]);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, [searchValue]);

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_USER__SUBSCRIPTION')) return;
      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationUser))
        .subscribe({
          next: (event) => {
            if (event) {
              const newUser = event.value.data.onCreateOrganizationUser;
              const matchedGroup = groups.find(({ id }) => id === newUser.groupId);
              if (matchedGroup) {
                matchedGroup.users.unshift(newUser);
                setGroups([...groups]);
              } else {
                load();
              }
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationUser))
        .subscribe({
          next: (event) => {
            if (event) {
              const updatedUser = event.value.data.onUpdateOrganizationUser;
              // remove the original one first if found
              groups.some((group) => {
                const matchedUserIndex = group.users.findIndex((x) => x.username === updatedUser.username);
                if (matchedUserIndex !== -1) {
                  group.users.splice(matchedUserIndex, 1);
                  return true;
                }
                return false;
              });
              const matchedGroup = groups.find(({ id }) => id === updatedUser.groupId);
              if (matchedGroup) {
                matchedGroup.users.push(updatedUser);
                setGroups([...groups]);
              } else {
                load();
              }
            }
          },
        });
    })();

    return () => {
      subscriptionCreate && subscriptionCreate.unsubscribe();
      subscriptionUpdate && subscriptionUpdate.unsubscribe();
    };
  }, [groups]);

  const getBadge = (user) => {
    if (!user.isActive) {
      return {
        value: '帳號停用中',
        textStyle: styles.badgeTextInactive,
        badgeStyle: styles.badgeInactive,
      };
    }
  };

  return (
    <View style={styles.container}>
      <CustomSearchBar
        onUpdate={setSearchValue}
        showLoading={isLoading}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={renderRefreshingControl()}
      >
        <List.Section>
          {groups.map((group, index)=>(
            <List.Accordion
              key={index}
              title={`${group.name} (${group.users.length})`}
              description={group.description}
              descriptionStyle={{ marginTop: 10, fontSize: 12 }}
              expanded={group.isExpanded}
              onPress={()=>{
                group.isExpanded = !group.isExpanded;
                setGroups([...groups]);
              }}
            >
              {group.users.sort(sortBy('idNumber')).sort(sortBy('isActive', true)).map((user)=>(
                <ListItem
                  key={user.username}
                  leftAvatar={{
                    title: `${user.name.substring(0, 1)}`,
                    borderRadius: 25,
                    width: 50,
                    height: 50,
                    color: 'red',
                    backgroundColor: Colors.light,
                    // source: { uri: `https://i.pravatar.cc/100?u=${user.username}` }
                  }}
                  title={user.name}
                  subtitle={user.idNumber}
                  subtitleStyle={styles.subtitle}
                  bottomDivider
                  chevron
                  badge={getBadge(user)}
                  onPress={() => navigation.navigate('Stacks', { screen: 'User', params: user })}
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      </ScrollView>
    </View>
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
  badgeTextInactive: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  badge: {
    height: 25,
    padding: 5,
  },
  badgeInactive: {
    height: 25,
    padding: 5,
    backgroundColor: '#767577',
  },
});
