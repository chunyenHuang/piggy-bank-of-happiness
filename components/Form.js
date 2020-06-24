import React, { useState } from 'react';
import { Input } from 'react-native-elements';

const inputs = [];
export default function Form({ fields = [], errors = [], defaultValue = {}, onUpdate, onSubmit }) {
  const [data, setData] = useState(defaultValue);

  return (
    <React.Fragment>
      {
        fields.map(({ key, props = {} }, index)=>(
          <Input
            key={index}
            {...props}
            defaultValue={data[key]}
            autoFocus={index === 0}
            ref={(input) => inputs[index] = input}
            returnKeyType={inputs[index+1] ? 'next' : 'send'}
            onSubmitEditing={()=> inputs[index+1] ? inputs[index+1].focus() : onSubmit()}
            onChangeText={(value) => {
              data[key] = value;
              setData({ ...data });
              onUpdate && onUpdate(data);
            }}
            errorStyle={{ color: 'red' }}
            errorMessage={errors[index]}
          />
        ))
      }
    </React.Fragment>
  );
}
