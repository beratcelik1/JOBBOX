// screens/Signup.js

import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

const logo = require('../assets/images/jobboxlogo2.png');

export default function Signup({ navigation }) {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        fetch('https://tranquil-ocean-74659.herokuapp.com/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                firstname: firstname, 
                lastname: lastname, 
                email: email, 
                password: password 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data.token) {
                navigation.navigate('MyTabs');
            } else {
                // handle error, show a message to the user
                Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
            }
        })
        .catch(error => console.log('Error:', error));
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
