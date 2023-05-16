

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { Ionicons } from '@expo/vector-icons';
import JobDetail from './JobDetails';

function HireScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        // Simulating a fetch call here
        const fetchedJobs = [
            { id: '1', title: 'Software Engineer', description: 'A full-time position', datePosted: '2023-01-01', numApplications: '3'  },
            { id: '2', title: 'Data Analyst', description: 'A part-time position', datePosted: '2023-02-15', numApplications: '1' },
            // Add more jobs here...
        ];
        setJobs(fetchedJobs);
    }, []);

    const handleSearch = () => {
        console.log(searchQuery);
    };
    const handleJobPress = (job) => {
        navigation.navigate('JobDetail', { job: job });
    }

    const renderJob = ({ item }) => (
        <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription}>{item.description}</Text>
            <Text style={styles.jobDate}>{item.datePosted}</Text>
            <Text style={styles.jobDate}>Applications: {item.numApplications}</Text>
            <Button onPress={() => handleJobPress(item)} title="View Applications" />
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
            />

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
            <HireStack.Screen name="JobDetail" component={JobDetail} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
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
