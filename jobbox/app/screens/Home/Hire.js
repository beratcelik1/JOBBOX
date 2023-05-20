

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { Ionicons } from '@expo/vector-icons';
import HireApplications from './HireApplications';

function HireScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Simulating a fetch call here
        const fetchedJobs = [
            { id: '1', title: 'Lawn mowing', description: 'One time', datePosted: '2023-01-01', numApplications: '3'  },
            { id: '2', title: 'Grocery run', description: 'One time', datePosted: '2023-02-15', numApplications: '1' },
            // Add more jobs here...
        ];
        setJobs(fetchedJobs);
    }, []);

    const handleSearch = () => {
        console.log(searchQuery);
    };
    const handleJobPress = (job) => {
        navigation.navigate('HireApplications', { job: job });
    }

    const renderJob = ({ item }) => (
        <View style={styles.jobCard} >
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription}>{item.description}</Text>
            <Text style={styles.jobDate}>{item.datePosted}</Text>
            <Text style={styles.jobDate}>Applications: {item.numApplications}</Text>
            <Button onPress={() => handleJobPress(item)} title="View Applicants" />
        </View>
    );

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

            <FlatList
                data={jobs}
                renderItem={renderJob}
                keyExtractor={item => item.id}
                style={styles.applicantView}
            />
            <View style={ {justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("PostJob")}
                    style={styles.Postbtn}
                    >
                        <Text style={ {fontWeight: 'bold', color: '#fff' }} > New job post</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const HireStack = createStackNavigator();

export default function Hire() {
    return (
        <HireStack.Navigator initialRouteName="HireScreen">
            <HireStack.Screen name="HireScreen" component={HireScreen} options={{headerShown: false}} />
            <HireStack.Screen name="PostJob" component={PostJob} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
            <HireStack.Screen name="HireApplications" component={HireApplications} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
        </HireStack.Navigator>
    );
}


const styles = StyleSheet.create({
    applicantView: {
        marginLeft: -20,
        marginRight: 0,
        marginBottom: 0,
    },
    Postbtn: {
        backgroundColor: '#4683fc',
        borderRadius: 50,
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    container: {
        flex: 1,
        padding: 10,
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
        marginBottom: 20,
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
    jobCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 10,
        // Android shadow properties
        elevation: 5,
        // iOS shadow properties
        shadowColor: "#000",
        shadowOffset: {
            width: -10,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    jobDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
});
