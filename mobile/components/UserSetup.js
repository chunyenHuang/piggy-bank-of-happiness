import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Text } from 'react-native-elements';
import moment from 'moment';

import {
  Button,
} from 'react-native-paper';

import Form from './Form';

import request from 'src/utils/request';
import { listOrganizations } from 'src/graphql/queries';
import { createOrganizationUser } from 'src/graphql/mutations';
import Colors from 'constants/Colors';
import { errorAlert } from 'src/utils/alert';
import SignOutButton from './auth/SignOutButton';

export default function UserSetup({ onComplete }) {
  const [showApplication, setShowApplication] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const fields = [
    {
      key: 'organizationId',
      required: true,
      type: 'select',
      options: organizations.map((item) => {
        return { label: item.name, value: item.id };
      }),
      props: {
        label: '機構',
      },
    },
  ];

  useEffect(() => {
    (async () => {
      const user = await Auth.currentAuthenticatedUser();
      const organizationId = user.attributes['custom:organizationId'];

      // user is not assigned to organization yet
      if (!organizationId) {
        setShowApplication(true);
      } else {
        setIsCompleted(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (showApplication) {
      (async () => {
        const { data: { listOrganizations: { items: organizations } } } = await request(listOrganizations, { limit: 100 });
        setOrganizations(organizations);
      })();
    }
  }, [showApplication]);

  useEffect(() => {
    if (isCompleted) {
      (async () => {
        const user = await Auth.currentAuthenticatedUser();

        const organizationId = user.attributes['custom:organizationId'];
        const organizationName = user.attributes['custom:organizationName'];

        const userGroup = (user.signInUserSession.accessToken.payload['cognito:groups'].filter((x) => !x.includes('_'))[0] || 'N/A');
        const items = [
          ['app:organizationId', organizationId || 'N/A'],
          ['app:organizationName', organizationName || 'N/A'],
          ['app:name', user.attributes['name']],
          ['app:email', user.attributes['email']],
          ['app:username', user.username],
          ['app:group', userGroup],
        ];

        await AsyncStorage.multiSet(items);

        onComplete && onComplete();
      })();
    }
  }, [isCompleted]);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const { id, name } = organizations.find(({ id }) => id === selectedOrganizationId);
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        'custom:organizationId': id,
        'custom:organizationName': name,
      });

      const now = moment().toISOString();
      await request(createOrganizationUser, {
        input: {
          organizationId: id,
          username: user.username,
          idNumber: 'N/A',
          name: user.attributes['name'],
          role: 'PendingApproval',
          isActive: 1,
          currentPoints: 0,
          earnedPoints: 0,
          createdAt: now,
          updatedAt: now,
        },
      });

      setIsCompleted(true);
    } catch (err) {
      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={{ marginBottom: 16 }}>歡迎</Text>
      <Text style={styles.hint}>
        請選擇您的機構並提出申請，
      </Text>
      <Text style={styles.hint}>
        該機構管理員將會審核您的資料。
      </Text>
      <View style={styles.formContainer}>
        <Form
          fields={fields}
          errors={[]}
          defaultValue={{}}
          onUpdate={({ organizationId })=>{
            setSelectedOrganizationId(organizationId);
          }}
          onSubmit={() => submit()}
        />
      </View>
      <Button
        mode="contained"
        disabled={!selectedOrganizationId || isSubmitting}
        onPress={submit}>
        申請加入
      </Button>
      <View style={{ height: 100 }} />
      <SignOutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },
  formContainer: {
    width: 250,
    padding: 16,
  },
  hint: {
    color: Colors.light,
    margin: 8,
  },
});
