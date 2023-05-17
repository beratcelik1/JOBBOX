import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // you might need to install this package
import { createStackNavigator } from '@react-navigation/stack';

import JobDetail from './JobDetails';

function Work({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // handle search logic here
        console.log(searchQuery);
    }; 

    // Sample job data
    const jobs = [
        {id: '1', title: 'Lawn mowing', company: 'Raphael Mwachiti', location: 'City A', posted: '2 days ago'},
        {id: '2', title: 'Help with moving', company: 'Joe Harrison', location: 'City B', posted: '3 days ago'},
        // More jobs...
    ]; 

    const renderJob = ({item}) => (
        <TouchableOpacity 
            style={styles.jobCard} 
            onPress={() => navigation.navigate('JobDetail', { job: item })}>
            <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobCompany}>{item.company}</Text>
                <Text style={styles.jobLocation}>{item.location}</Text>
                <Text style={styles.jobPosted}>{item.posted}</Text>
            </View>
            <View style={styles.jobExtras}>
                <Text style={styles.jobExtra}><Ionicons name="time-outline" size={14} color="gray" /> {item.estimatedTime}</Text>
                <Text style={styles.jobExtra}><Ionicons name="cash-outline" size={14} color="green" /> {item.pay}</Text>
                <Text style={styles.jobExtra}><Ionicons name="star-outline" size={14} color="gold" /> {item.rating}</Text>
            </View>
        </TouchableOpacity>
    );
    
    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="ios-search" size={20} color="#000" />
                <TextInput
                    style={styles.searchInput}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="What Job are you looking for..."
                    placeholderTextColor="gray"
                />
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchButton}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
                <Text>Filter by:</Text>
                <TouchableOpacity>
                    <Text style={styles.filterOption}>Category</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.filterOption}>Rating</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.filterOption}>Time</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.filterOption}>Pay</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={jobs}
                renderItem={renderJob}
                keyExtractor={item => item.id}
                style={styles.jobView}
            />

        </View>
    );
} 
const WorkStack = createStackNavigator();

export default function Hire() {
    return (
        <WorkStack.Navigator initialRouteName="Work">
            <WorkStack.Screen name="Work" component={Work} options={{headerShown: false}} />
            <WorkStack.Screen name="JobDetail" component={JobDetail} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
        </WorkStack.Navigator>
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
    filterSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    filterOption: {
        color: '#4683fc',
        fontWeight: 'bold',
        fontSize: 16,
    },
    jobView: {
        width: '100%',
        marginBottom: -15,

    },
    jobCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    jobDetails: {
        flex: 1,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    jobCompany: {
        color: 'gray',
        fontSize: 14,
    },
    jobLocation: {
        color: 'gray',
        fontSize: 14,
    },
    jobPosted: {
        color: 'gray',
        fontSize: 14,
        marginTop: 5,
    },
    jobExtras: {
        flex: 1,
        alignItems: 'flex-end', // This aligns the extra details to the right
    },
    jobExtra: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});
