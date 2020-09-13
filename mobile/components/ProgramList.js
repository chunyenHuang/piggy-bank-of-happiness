import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, AsyncStorage } from 'react-native';
import { ListItem, Badge } from 'react-native-elements';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from 'src/utils/request';
import { sortBy } from 'src/utils/sorting';
import { listOrganizationPrograms } from 'src/graphql/queries';
import Colors from 'constants/Colors';
import ModifyProgram from 'components/ModifyProgram';
import check from 'src/permission/check';
import { onCreateOrganizationProgram, onUpdateOrganizationProgram } from 'src/graphql/subscriptions';
import BadgeInactive from 'components/BadgeInactive';

export default function ProgramList() {
  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState(undefined);

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
    };
    const data = await asyncListAll(listOrganizationPrograms, params);
    setPrograms(data.sort(sortBy('name', true)).sort(sortBy('isActive', true)));

    setIsLoading(false);
  };

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_PG__SUBSCRIPTION')) return;

      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationProgram))
        .subscribe({
          next: (event) => {
            if (event) {
              const newItem = event.value.data.onCreateOrganizationProgram;
              const matched = programs.find(({ id }) => id === newItem.id);
              if (!matched) {
                programs.unshift(newItem);
              } else {
                Object.assign(matched, newItem);
              }
              setPrograms([...programs]);
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationProgram))
        .subscribe({
          next: (event) => {
            if (event) {
              const updatedItem = event.value.data.onUpdateOrganizationProgram;
              // remove the original one first if found
              const matched = programs.find(({ id }) => id === updatedItem.id);
              if (!matched) {
                programs.unshift(updatedItem);
              } else {
                Object.assign(matched, updatedItem);
              }
              setPrograms([...programs]);
            }
          },
        });
    })();

    return () => {
      subscriptionCreate && subscriptionCreate.unsubscribe();
      subscriptionUpdate && subscriptionUpdate.unsubscribe();
    };
  }, [programs]);

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      <ModifyProgram
        hideButton={true}
        program={program}
        onClose={() => setProgram(undefined)}
      />
      {programs.map((program, index)=>(
        <ListItem
          key={index}
          bottomDivider
          onPress={() => setProgram(program)}
        >
          <ListItem.Content>
            <ListItem.Title>{program.name}</ListItem.Title>
            {program.description && <ListItem.Subtitle style={styles.subtitle}>{program.description}</ListItem.Subtitle>}
          </ListItem.Content>
          {!program.isActive && <BadgeInactive />}
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
