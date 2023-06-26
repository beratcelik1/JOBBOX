import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/Ionicons';

const PasswordInput = ({ control, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput
            label="Password"
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            secureTextEntry={!showPassword}
            style={{ flex: 1, backgroundColor: '#fff' }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, padding: 10 }}>
            <Icon name={showPassword ? 'eye' : 'eye-off'} size={24} color="#4683FC" />
          </TouchableOpacity>
        </View>
      )}
      name={name}
      rules={{ required: true }}
      defaultValue=""
    />
  );
};

export default PasswordInput;
