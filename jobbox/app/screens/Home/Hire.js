import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { useContext } from 'react';
import { RootNavigationContext } from '../../navigation/RootNavigationContext';
import { Ionicons } from '@expo/vector-icons'; // you might need to install this package

function HireScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // handle search logic here
        console.log(searchQuery);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="ios-search" size={20} color="#000" />
                <TextInput
                    style={styles.searchInput}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="Try a job template..."
                    placeholderTextColor="gray"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchButton}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>

            <Button 
                onPress={() => navigation.navigate("PostJob")}
                title="Post a Job"
            />
        </View>
    );
}

const HireStack = createStackNavigator();

export default function Hire() {
    return (
        <HireStack.Navigator initialRouteName="HireScreen">
            <HireStack.Screen name="HireScreen" component={HireScreen} options={{headerShown: false}} />
            <HireStack.Screen name="PostJob" component={PostJob} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
        </HireStack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingLeft: 10,
    },
    searchIcon: {
        padding: 10,
    },
    searchInput: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    searchButton: {
        backgroundColor: '#4683fc',
        borderRadius: 50,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
