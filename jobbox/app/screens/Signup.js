// screens/Signup.js

import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import firebase from 'firebase';

const logo = require('../assets/images/jobboxlogo2.png');

export default function Signup({ navigation }) {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // You can also update the user's details
            user.updateProfile({
                displayName: firstname + ' ' + lastname,
            }).then(() => {
                console.log(`User created: ${user.displayName}`);
                navigation.navigate('MyTabs');
            }).catch((error) => {
                console.error('Error updating user: ', error);
            });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Error signing up: ', errorCode, errorMessage);
        });
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>
            
            <View style={styles.firstLastNameContainer}> 
                <TextInput
                    label="FirstName"
                    value={firstname}
                    onChangeText={setFirstName}
                    style={styles.input2}
                />
                <TextInput
                    label="LastName"
                    value={lastname}
                    onChangeText={setLastName}
                    secureTextEntry
                    style={styles.input2}
                />
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
            <Button mode="contained" onPress={handleSignup} style={styles.button}>
                <Text style={styles.Btn}>Sign Up</Text>
            </Button>
            <Button onPress={() => navigation.navigate('Login')} >
                <Text style={styles.noBtn}>Already have an account? 
                    <Text style={styles.noBtnBold}> Login.</Text> 
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
    input2: {
        marginBottom: 10,
        backgroundColor: '#fff',
        width: '49%',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#fff', 
    },
    Btn: {
        color: '#4683FC',
        fontWeight: 'bold' 
    },
    noBtn: {
        color: '#fff',
    },
    noBtnBold: {
        color: '#fff',
        fontWeight: 'bold',
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
    firstLastNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    
});
