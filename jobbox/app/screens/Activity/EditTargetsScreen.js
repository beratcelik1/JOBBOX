import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet,TouchableOpacity} from 'react-native';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10, 
    marginTop: 25, 
    fontWeight: '700',
    alignSelf: 'center'
  }, 
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignSelf: 'center',
    marginHorizontal: 20, 
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignContent: 'center',
    justifyContent: 'center',
    elevation: 5,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {width: 0,height: 2,},
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
    alignSelf: 'center',
    color: '#000'
  },
  icon: {
    marginHorizontal: 10,
  },
  savedTargets: {
    fontSize: 16,
    marginTop: 15,
  }, 
  button: { 
    backgroundColor: '#fff',
    paddingHorizontal: 20, 
    paddingVertical: 15,
    marginTop: 10, 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5, 
    alignSelf: 'center' 
  },
});

const EditTargetsScreen = ({ navigation }) => {
  const [earningTarget, setTargetEarning] = useState('');
  const [spendingTarget, setTargetSpent] = useState('');

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', { headers: { Authorization: `Bearer ${token}` } });

        if (response.status === 200) {
          setTargetEarning(response.data.earningTarget?.toString());
          setTargetSpent(response.data.spendingTarget?.toString());
        }
      } catch (err) {
        console.error("Failed to fetch targets: ", err);
      }
    };

    fetchTargets();
  }, []);

  const handleEditTargets = async () => {
    // console.log("Update button clicked");
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.put('https://tranquil-ocean-74659.herokuapp.com/auth/user/me',
        { earningTarget, spendingTarget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // after the targets are successfully updated on the server, navigate back
      if (response.status === 200) {
        navigation.goBack();
      }

    } catch (err) {
      console.error("Failed to update targets: ", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Earning Target</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.input}
            value={earningTarget}
            onChangeText={text => setTargetEarning(text)}
          />
          <Text style={styles.icon}>$</Text>
        </View>
      </View> 

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Spending Target</Text>
        <View style={styles.inputWithIcon}>
          <TextInput
            style={styles.input}
            value={spendingTarget}
            onChangeText={text => setTargetSpent(text)}
          />
          <Text style={styles.icon}>$</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditTargets}>
        <Text style = {{fontWeight: '700', color: '#4683fc'}}>Save Targets </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditTargetsScreen;
