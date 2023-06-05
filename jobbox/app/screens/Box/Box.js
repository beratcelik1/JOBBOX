import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

function StatusScreen() {
    const [loaded, setLoaded] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoaded(false);

            // Fetch the token from the async storage
            const token = await AsyncStorage.getItem('token');

            // Decode the token to get the user ID
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;

            // Fetch the jobs from your server
            fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setJobs(data);
                    setLoaded(true);
                })
                .catch((error) => console.error('Error:', error));
        };

        fetchJobs();
    }, []);

    const renderJob = ({ item }) => {
        // Provide JSX to render each job in the list
        return (
            <View style={styles.jobCard}>
                {/* Rest of your Job Card design */}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loaded ? (
                <FlatList data={jobs} renderItem={renderJob} keyExtractor={(item, index) => item._id} style={styles.jobList}/>
            ) : (
                <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#0000ff"/>
            )}
        </View>
    );
}

const styles = {
    container: { /* Your Styles Here */ },
    jobCard: { /* Your Styles Here */ },
    jobList: { /* Your Styles Here */ }
}

export default StatusScreen;
