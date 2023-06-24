import React,{ useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);

  useEffect(() => {
    if (successMessageVisible) {
      // Hide the success message after 3 seconds
      const timer = setTimeout(() => {
        setSuccessMessageVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessageVisible]);
  
  const handleSaveChanges = async () => {
    try {
      // Perform validation checks on the input values
      if (newPassword !== confirmPassword) {
        // Set passwordsMatch state to false if the passwords don't match
        setPasswordsMatch(false);
        return;
      }

      // Call the changePassword function with the input values
      await changePassword(currentPassword, newPassword);
      setSuccessMessageVisible(true);

      // Reset the input fields and passwordsMatch state
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordsMatch(true);
      // If the password change is successful, you can perform additional actions here
      // For example, display a success message or navigate to a different screen
    } catch (error) {
      console.error("Failed to save changes: ", error);
      // Handle the error or display an error message

      // If the save changes fail, you can perform additional actions here
      // For example, display an error message or reset the input fields
    }
  };
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      const response = await axios.put(
        'https://tranquil-ocean-74659.herokuapp.com/auth/user/me/change-password',
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      // Handle the response or update the UI accordingly
    } catch (error) {
      console.error("Failed to change password: ", error);
      // Handle the error or display an error message
    }
  };
  
  const handleCurrentPasswordChange = (text) => {
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    // Reset passwordsMatch state when new password changes
    setPasswordsMatch(true);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    // Reset passwordsMatch state when confirm password changes
    setPasswordsMatch(true);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter current password"
          value={currentPassword}
          onChangeText={handleCurrentPasswordChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={[styles.input, !passwordsMatch && styles.inputError]} // Apply inputError style conditionally
          secureTextEntry
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={handleNewPasswordChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={[styles.input, !passwordsMatch && styles.inputError]} // Apply inputError style conditionally
          secureTextEntry
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
      </View>
      {!passwordsMatch && <Text style={styles.errorText}>Passwords do not match</Text>}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red', // Apply red border color for error state
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default ChangePasswordScreen;
