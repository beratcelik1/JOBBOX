import React from 'react';
import { View, Text, Button  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Notifications() {
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <View>
            <Text>Notifications Screen</Text>
        </View>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
}