import React,{ useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DeleteAccountScreen = ({handleSignOut}) => {
  const handleDeleteAccount = async () => {
    
    // Implement logic to delete the account
    console.log("deleting account")
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.delete('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.message); // User account deleted successfully
    handleSignOut();
      // Perform any additional actions after successful deletion
    } catch (err) {
      console.error("Failed to delete user account: ", err);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.description}>
        Are you sure you want to delete your account? This action cannot be undone.
      </Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DeleteAccountScreen;
