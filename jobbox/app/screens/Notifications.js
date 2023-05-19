import React from 'react';
import { View, Text, Button  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Notifications() {
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dedcdc' }}>
         <View>
            <Text>Notifications Screen</Text>
        </View>
      </View>
    );
}
