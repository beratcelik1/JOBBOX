// screens/Login.js

import React, { useState } from 'react';
import { StyleSheet, View, Image, Switch, TouchableOpacity} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';


const logo = require('../assets/images/jobboxlogo2.png');

export default function Login({ navigation, setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRemembered, setIsRemembered] = useState(false);

    const handleLogin = () => {
        fetch('https://tranquil-ocean-74659.herokuapp.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: username, 
                password: password 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(async data => {
            console.log(data);
            if (data.token) {
                await AsyncStorage.setItem('token', data.token);
                setIsAuthenticated(true);
            } else {
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        })
        .catch(error => console.log('Error:', error));
    };
    
    
      
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
            </View>

            <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
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
                <TouchableOpacity onPress={() => {/* handle forgot password */}}>
                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
            </View>


            <Button mode="contained" onPress={handleLogin} style={styles.button} >
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
