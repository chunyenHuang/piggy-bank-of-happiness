import React, { useState, useCallback, useEffect } from 'react';
import { SearchBar } from 'react-native-elements';
import { StyleSheet } from 'react-native';
import lodashDebounce from 'lodash.debounce';

export default function CustomSearchBar({ debounce = 600, onUpdate, showLoading, ...props }) {
  const [userQuery, setUserQuery] = useState('');

  const updateQuery = () => {
    onUpdate && onUpdate(userQuery);
  };

  const delayedQuery = useCallback(lodashDebounce(updateQuery, debounce), [userQuery]);

  useEffect(() => {
    delayedQuery();

    // Cancel the debounce on useEffect cleanup.
    return delayedQuery.cancel;
  }, [userQuery, delayedQuery]);

  return (
    <SearchBar
      placeholder="搜尋"
      onChangeText={setUserQuery}
      value={userQuery}
      lightTheme={true}
      containerStyle={styles.container}
      inputContainerStyle={styles.input}
      inputStyle={styles.input}
      round={true}
      showLoading={showLoading}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    height: 42,
  },
  input: {
    height: 20,
  },
});
