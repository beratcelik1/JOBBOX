import React from 'react';
import { View, Text, Button  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Messages() {
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <View>
            <Text>Messages Screen</Text>
        </View>
      </View>
    );
}
