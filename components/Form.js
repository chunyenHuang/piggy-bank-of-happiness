import React, { useState } from 'react';
import { Input } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';

const inputs = [];

export default function Form({ fields = [], errors = [], defaultValue = {}, autoFocus = true, onUpdate, onSubmit }) {
  const [data, setData] = useState(defaultValue);

  return (
    <React.Fragment>
      {
        fields.map(({ key, type = 'text', options, props = {} }, index) => {
          const onChangeText = (value)=>{
            data[key] = value;
            setData({ ...data });
            onUpdate && onUpdate(data);
          };
          return (
            type === 'text' ?
              <Input
                key={index}
                {...props}
                defaultValue={data[key]}
                autoFocus={autoFocus && index === 0 ? true : false}
                ref={(input) => inputs[index] = input}
                returnKeyType={inputs[index+1] ? 'next' : 'send'}
                onSubmitEditing={()=> inputs[index+1] ? inputs[index+1].focus() : onSubmit()}
                onChangeText={onChangeText}
                errorStyle={{ color: 'red' }}
                errorMessage={errors[index]}
              /> :
              <Dropdown
                key={index}
                containerStyle={{ padding: 10, paddingTop: 0 }}
                labelFontSize={16}
                baseColor="rgba(0,0,0,0.5)"
                label={props.label}
                rippleOpacity={0}
                animationDuration={200}
                data={options}
                value={data[key]}
                onChangeText={onChangeText}
              />
          );
        })
      }
    </React.Fragment>
  );
}
