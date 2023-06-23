import React, { useState } from 'react';
import { StyleSheet, View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { TextInput, Text, Button } from 'react-native-paper'; // import Button from 'react-native-paper'

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    try {
      const response = await axios.post('https://tranquil-ocean-74659.herokuapp.com/auth/forgotPassword', { email });
      if (response.data) {
        setIsCodeSent(true);
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      const response = await axios.post('https://tranquil-ocean-74659.herokuapp.com/auth/resetPassword', { email, code, newPassword: password });
      if (response.data) {
        Alert.alert("Success", response.data.message);
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, padding: 15, justifyContent: 'center',}}
    >
        <View style={styles.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            {isCodeSent ? (
            <>
                <TextInput
                label="Code"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                />

                <TextInput
                label="New Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                />

                <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
                />

                <Button mode="contained" onPress={handleResetPassword} style={styles.button}>
                <Text style={styles.Btn}>Reset Password</Text>
                </Button>
            </>
            ) : (
            <Button mode="contained" onPress={handleSendCode} style={styles.button}>
                <Text style={styles.Btn}>Send Code</Text>
            </Button>
            )}
        </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#4683FC', 
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#fff', 
    },
    Btn: {
        color: '#4683FC',
        fontWeight: 'bold',
    },
    noBtn: {
        color: '#fff',
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 77,
    },
    logo: {
        width: 250,
        height: 40,
    },
    rememberForgotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: '#fff',
    },
    forgotPassword: {
        color: '#fff',
        fontWeight: 'bold',
    },
});