import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

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
});

const EditTargetsScreen = () => {
  const [targetEarning, setTargetEarning] = useState(null);
  const [targetSpent, setTargetSpent] = useState(null);

  useEffect(() => {
    // Fetch initial targetEarning and targetSpent values from '/user/me' when component mounts
    axios.get('/user/me', { headers: { /* your auth header */ } })
      .then((res) => {
        setTargetEarning(res.data.targetEarning);
        setTargetSpent(res.data.targetSpent);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleEditEarning = () => {
    // PUT request to '/user/me' with new targetEarning
    axios.put('/user/me', { targetEarning }, { headers: { /* your auth header */ } })
      .catch((err) => console.error(err));
  };

  const handleEditSpent = () => {
    // PUT request to '/user/me' with new targetSpent
    axios.put('/user/me', { targetSpent }, { headers: { /* your auth header */ } })
      .catch((err) => console.error(err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Earning Target</Text>
        <TextInput
          style={styles.input}
          defaultValue={targetEarning?.toString()}
          onChangeText={text => setTargetEarning(Number(text))}
        />
        <Button title="Update Earning Target" onPress={handleEditEarning} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monthly Spending Target</Text>
        <TextInput
          style={styles.input}
          defaultValue={targetSpent?.toString()}
          onChangeText={text => setTargetSpent(Number(text))}
        />
        <Button title="Update Spending Target" onPress={handleEditSpent} />
      </View>
    </View>
  );
};

export default EditTargetsScreen;
