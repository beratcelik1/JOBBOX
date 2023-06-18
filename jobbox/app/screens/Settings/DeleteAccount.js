import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DeleteAccountScreen = () => {
  const handleDeleteAccount = () => {
    
    // Implement logic to delete the account
    console.log("deleting account")
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
