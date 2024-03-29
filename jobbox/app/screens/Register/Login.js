// screens/Login.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Switch, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import PasswordInput from '../../components/PasswordInput';
import { useForm, Controller } from 'react-hook-form';


const logo = require('../../assets/images/jobboxlogo2.png');

export default function Login({ navigation, setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRemembered, setIsRemembered] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 

    const { control, handleSubmit } = useForm();


    const handleLogin = (email, password) => {
        fetch('https://tranquil-ocean-74659.herokuapp.com/auth/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ email, password })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(async data => {
            console.log('Data received from server:', data);
    
            if (data.token) {
              if (data.user.verified) {
                console.log(isRemembered);
                try {
                  await AsyncStorage.setItem('remember', JSON.stringify(isRemembered));
                    await AsyncStorage.setItem('token', data.token);
                    await AsyncStorage.setItem('userId', data.user._id);
                  setIsAuthenticated(true);
                } catch (err) {
                  console.error('Error storing data to AsyncStorage:', err);
                }
              } else {
                showMessage({
                  message: 'Verify your email and try again!',
                  type: 'info',
                  floating: true,
                  icon: 'success',
                  duration: 4000,
                });
              }
            } else {
              Alert.alert('Login Failed', 'Invalid email or password');
            }
          })
          .catch(error => console.log('Error:', error));
      };
    
      const onSubmit = data => {
        handleLogin(data.email, data.password);
      };
    
    useEffect(() => {
        const checkRememberedUser = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUserId = await AsyncStorage.getItem('userId');
            const remember = JSON.parse(await AsyncStorage.getItem('remember')); // retrieve 'remember' flag

            if (remember && storedToken && storedUserId) {
                // User data found in AsyncStorage, authenticate the user
                setIsAuthenticated(true);
            }
        };

        checkRememberedUser();
    }, [setIsAuthenticated]);


    return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={{ flex: 1, padding: 15, justifyContent: 'center', }}
        >
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
            <Controller 
              control={control} 
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  value={value}
                  style={{ marginBottom: 10, backgroundColor: '#fff' }}
                />
              )}
              name="email"
              rules={{ required: true }}
              defaultValue=""
            />
            <PasswordInput control={control} name="password" />
            {loginError && <Text style={styles.errorText}>Invalid email or password</Text>}
            <View style={styles.rememberForgotContainer}>
              <View style={styles.rememberContainer}>
                <Switch
                  value={isRemembered}
                  onValueChange={setIsRemembered}
                />
                <Text style={styles.noBtn}> Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <Pressable>
              <Pressable
                style={({ pressed }) => [{opacity: pressed ? 0.5 : 1,},styles.pressable,]}
                onPress={handleSubmit(onSubmit)}
              >
                <Button mode="contained" style={styles.button}><Text style={styles.Btn}>Login</Text></Button>
              </Pressable>
              <Button onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.noBtn}>Don't have an account?<Text style={styles.forgotPassword}> Sign up.</Text></Text>
              </Button>
            </Pressable>
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },



});
