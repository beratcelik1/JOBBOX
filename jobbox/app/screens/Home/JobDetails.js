import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 18,
        marginTop: 10,
    },
    date: {
        fontSize: 14,
        marginTop: 10,
        color: '#666',
    },
    numApplications: {
        fontSize: 14,
        marginTop: 10,
        color: '#666',
    },
});

function JobDetail({ route }) {
    const { job } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.description}>{job.description}</Text>
            <Text style={styles.date}>{job.datePosted}</Text>
            <Text style={styles.numApplications}>Applications: {job.numApplications}</Text>
        </View>
    );
}

export default JobDetail;
