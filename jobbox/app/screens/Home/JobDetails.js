import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function WorkJobDetails({ route }) {
    const { job } = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.jobCard}>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.description}>{job.description}</Text>
                <Text style={styles.date}>{job.datePosted}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    jobCard: {
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
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
});

export default WorkJobDetails;
