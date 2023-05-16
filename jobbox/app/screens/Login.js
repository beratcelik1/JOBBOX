import React, { useState } from 'react';
import { StyleSheet, View, Image, Switch, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

import * as firebase from "firebase/app";
import "firebase/auth";

const logo = require('../assets/images/jobboxlogo2.png');

export default function Login({ navigation, setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemembered, setIsRemembered] = useState(false);

  const handleLogin = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        console.log(`User signed in: ${user.displayName}`);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error('Error signing in: ', errorCode, errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.rememberForgotContainer}>
        <View style={styles.rememberContainer}>
          <Switch
            value={isRemembered}
            onValueChange={setIsRemembered}
          />
          <Text style={styles.noBtn}> Remember me</Text>
        </View>
        <TouchableOpacity onPress={() => { /* handle forgot password */ }}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        <Text style={styles.Btn}>Login</Text>
      </Button>
      <Button onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.noBtn}>Don't have an account?
          <Text style={styles.forgotPassword}> Sign up.</Text>
        </Text>
      </Button>
    </View>
  );
}

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
  
