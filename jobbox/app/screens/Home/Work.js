import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // you might need to install this package

import { createStackNavigator } from '@react-navigation/stack';

function WorkScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    // At the top of your WorkScreen function...
    const [jobs, setJobs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);


    const fetchJobs = useCallback(() => {
        setIsLoading(true);
        fetch('http://tranquil-ocean-74659.herokuapp.com/jobs')
            .then(response => response.json())
            .then(data => {
                // Update this line to prepend the new data
                setJobs(data);
                setIsLoading(false);
                setRefreshing(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
                setRefreshing(false);
            });
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
    if (scrollPosition === 0) {
        fetchJobs();
    }
  }, [scrollPosition, fetchJobs]);


    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);
    

    useEffect(() => {
        if (searchQuery.length > 0) {
            setIsLoading(true);
            fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/search?search=${searchQuery}`)
                .then(response => response.json())
                .then(data => setJobs(data))
                .catch(error => console.error('Error:', error));
        } else {
            fetchJobs();
        }
    }, [searchQuery, fetchJobs]);

    const handleSearch = () => {
        setIsLoading(true);
        fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/search?search=${searchQuery}`)
          .then(response => response.json())
          .then(data => setJobs(data))
          .catch(error => console.error('Error:', error));
      };
      
      const handleFilter = () => {
        setIsLoading(true);
        fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/category?category=${categoryFilter}`)
          .then(response => response.json())
          .then(data => setJobs(data))
          .catch(error => console.error('Error:', error));
      };
      
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
                <TextInput
                    style={styles.filterInput}
                    onChangeText={setCategoryFilter}
                    value={categoryFilter}
                    placeholder="Category..."
                    placeholderTextColor="gray"
                />
                <TouchableOpacity onPress={handleFilter}>
                    <Text style={styles.filterOption}>Apply Filter</Text>
                </TouchableOpacity>
            </View> 
            <FlatList
                data={jobs}
                renderItem={renderJob}
                keyExtractor={item => item.id}
                style={styles.jobView}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListFooterComponent={
                    isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null
                }
                onScroll={event => {
                    setScrollPosition(event.nativeEvent.contentOffset.y);
                }}
            />
        </View>
    );
} 

function JobDetailScreen({ route, navigation }) {
    //... your existing JobDetail component code

    const { job } = route.params;

    return (
        <View style={styles.container2}>
            <View style={styles.jobCard2}>
                <Text style={styles.title2}>{job.title}</Text>
                <Text style={styles.description2}>{job.description}</Text>
                <Text style={styles.date2}>{job.datePosted}</Text>
            </View>
        </View>
    );
}
  
// Define a type for your stack
const Stack = createStackNavigator();
  
export default function Work() {
    return (
      <Stack.Navigator initialRouteName="WorkScreen">
        <Stack.Screen name="WorkScreen" component={WorkScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}}/>
      </Stack.Navigator>   
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginLeft: 15, 
        marginRight: 15, 
        marginTop: 10, 
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
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10,
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
    jobDetails: {
        flex: 1,
        width: '70%',
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
        width: 4,
        alignItems: 'flex-start', // This aligns the extra details to the right
    },
    jobExtra: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    container2: {
        flex: 1,
        padding: 20,
    },
    jobCard2: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
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
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description2: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    date2: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
});
