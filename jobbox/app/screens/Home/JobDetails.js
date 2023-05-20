import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function JobDetail({ route, navigation }) {
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

const styles = StyleSheet.create({
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
