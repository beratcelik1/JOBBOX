import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  savedTargets: {
    fontSize: 16,
    marginTop: 15,
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
        <TextInput
          style={styles.input}
          value={earningTarget}
          onChangeText={text => setTargetEarning(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Spending Target</Text>
        <TextInput
          style={styles.input}
          value={spendingTarget}
          onChangeText={text => setTargetSpent(text)}
        />
      </View>
      <Button title="Update Targets" onPress={handleEditTargets} />
    </View>
  );
};

export default EditTargetsScreen;