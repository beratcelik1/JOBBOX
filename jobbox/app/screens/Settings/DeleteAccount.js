import React,{ useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DeleteAccountScreen = ({handleSignOut}) => {
  const handleDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await fetch('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('Account deleted successfully');
  
        // Remove user's token from AsyncStorage
        await AsyncStorage.removeItem('token');
        handleSignOut();
        
      } else if (response.status === 400) {
        alert('Bad Request: The server could not understand the request due to invalid syntax.');
      } else if (response.status === 401) {
        alert('Unauthorized: The request requires user authentication or authorization.');
      } else if (response.status === 403) {
        alert('Forbidden: The server understood the request, but is refusing to fulfill it.');
      } else if (response.status === 404) {
        alert('Not Found: The server can not find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist.');
      } else {
        alert('Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account: ', error);
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
