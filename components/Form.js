import React, { useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

const inputs = [];

const renderComponents = ({ index, type, value, options, props, autoFocus, errorMsg, onSubmit, onChange }) => {
  if (props.hidden) {
    return;
  }
  switch (type) {
  case 'text':
    return <Input
      key={index}
      {...props}
      defaultValue={value}
      autoFocus={autoFocus && index === 0 ? true : false}
      ref={(input) => inputs[index] = input}
      returnKeyType={inputs[index+1] ? 'next' : 'send'}
      onSubmitEditing={()=> inputs[index+1] ? inputs[index+1].focus() : onSubmit()}
      onChangeText={onChange}
      errorStyle={{ color: 'red' }}
      errorMessage={errorMsg}
    />;
  case 'select':
  case 'dropdown':
    return <Dropdown
      key={index}
      {...props}
      containerStyle={{ padding: 10, paddingTop: 0 }}
      labelFontSize={16}
      baseColor="rgba(0,0,0,0.5)"
      label={props.label}
      rippleOpacity={0}
      animationDuration={200}
      data={options}
      value={value}
      onChangeText={onChange}
    />;
  case 'switch':
    return <View key={index} style={styles.switchContainer}>
      <Switch
        {...props}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor='#3e3e3e'
        onValueChange={() => onChange(!value)}
        value={value}
      />
      <Text style={{ fontSize: 16, padding: 3 }}>{value ? props.enabledLabel : props.disabledLabel} </Text>
    </View>;
  default:
    return;
  }
};

export default function Form({ fields = [], errors = [], defaultValue = {}, autoFocus = true, onUpdate, onSubmit }) {
  const [data, setData] = useState(defaultValue);

  return (
    <React.Fragment>
      {
        fields.map(({ key, type = 'text', options, props = {} }, index) => {
          const onChange = (value)=>{
            data[key] = value;
            setData({ ...data });
            onUpdate && onUpdate(data);
          };
          return renderComponents({
            index,
            type,
            value: data[key] || '',
            options,
            props,
            autoFocus,
            errorMsg: errors[index],
            onSubmit,
            onChange,
          });
        })
      }
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  switchContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: 16,
  },
});
