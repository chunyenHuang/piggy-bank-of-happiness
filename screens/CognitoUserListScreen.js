import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Auth, API } from 'aws-amplify';
import moment from 'moment';

import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';

// TODO: handle pagination
let nextToken;
async function listUsers(limit = 60) {
  const apiName = 'AdminQueries';
  const path = '/listUsers';
  const myInit = {
    queryStringParameters: {
      limit,
      token: nextToken,
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${(await Auth.currentSession()).getAccessToken().getJwtToken()}`,
    },
  };
  const { NextToken, ...rest } = await API.get(apiName, path, myInit);
  const { Users } = rest;
  nextToken = NextToken;
  console.log(Users[0]);
  return Users;
}

export default function StaffListScreen() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    setIsLoading(true);

    const data = await listUsers();
    setUsers(data
      .map(({ Username, UserStatus, Enabled, UserCreateDate, UserLastModifiedDate, Attributes }) => {
        const user = {
          username: Username,
          status: UserStatus,
          isEnabled: Enabled,
          createdAt: UserCreateDate,
          updatedAt: UserLastModifiedDate,
        };
        Attributes.forEach(({ Name, Value }) => {
          user[Name] = Value;
        });
        user.isVerified = (user.status === 'CONFIRMED' && user['email_verified']) || (user.status === 'EXTERNAL_PROVIDER') ? 1 : 0;
        console.log(user);
        return user;
      })
      .sort(sortBy('name'))
      .sort(sortBy('isVerified', true)),
    );

    setIsLoading(false);
  };

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={renderRefreshingControl()}
      >
        {users.map((user, index)=>(
          <ListItem
            key={index}
            leftAvatar={{ source: { uri: `https://i.pravatar.cc/100?u=${user.username}` } }}
            title={user.name}
            subtitle={user.username}
            subtitleStyle={styles.subtitle}
            rightTitle={user['custom:organizationName']}
            rightSubtitle={moment(user.updatedAt).format('MM/DD/YYYY')}
            rightSubtitleStyle={styles.subtitle}
            bottomDivider
            // chevron
            badge={{
              status: user.isVerified?'success':'warning',
              value: user.currentPoints,
              textStyle: styles.badgeText,
              badgeStyle: styles.badge,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

StaffListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subtitle: {
    color: Colors.light,
    paddingTop: 5,
  },
});
