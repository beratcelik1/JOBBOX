import React, { useState } from 'react';
import { StyleSheet, View, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import { useForm, Controller } from 'react-hook-form';
import PasswordInput from '../../components/PasswordInput'; // import your PasswordInput component

const logo = require('../../assets/images/jobboxlogo2.png');

export default function Signup({ navigation }) {
  const { control, handleSubmit } = useForm();

  const handleSignup = (data) => {
    fetch('https://tranquil-ocean-74659.herokuapp.com/auth/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
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
                await AsyncStorage.setItem('token', data.token); // Store the token here after signup
                await AsyncStorage.setItem('userId', data.user._id);
                showMessage({
                    message: 'Verify your account and Log In Here!',
                    type: 'info',
                    floating: true,
                    icon: 'success',
                    duration: 4000,
                  });
                navigation.navigate('Login');
            } else {
                // handle error, show a message to the user
                Alert.alert('Signup Failed', 'An error occurred during signup. Please try again.');
            }
        })
        .catch(error => console.log('Error:', error));
    };
    const onSubmit = data => {
        handleSignup(data);
    };
    
    return (
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={{ flex: 1, padding: 15, justifyContent: 'center', }}
    >
        <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.firstLastNameContainer}>
            <Controller 
            control={control} 
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                label="First Name"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input2}
                />
            )}
            name="firstname"
            rules={{ required: true }}
            defaultValue=""
            />
            <Controller 
            control={control} 
            render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                label="Last Name"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input2}
                />
            )}
            name="lastname"
            rules={{ required: true }}
            defaultValue=""
            />
        </View>
        <Controller 
            control={control} 
            render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                label="Email"
                onBlur={onBlur}
                onChangeText={value => onChange(value)}
                value={value}
                style={styles.input}
            />
            )}
            name="email"
            rules={{ required: true }}
            defaultValue=""
        />
        <PasswordInput control={control} name="password" />
        <Pressable
            style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},styles.pressable,]}
            onPress={handleSubmit(onSubmit)}
        >
            <Button mode="contained" style={styles.button}><Text style={styles.Btn}>Sign Up</Text></Button>
        </Pressable>
        <Button onPress={() => navigation.navigate('Login')} >
            <Text style={styles.noBtn}>Already have an account?<Text style={styles.noBtnBold}> Login.</Text></Text>
        </Button>
        </View>
    </KeyboardAvoidingView>
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
