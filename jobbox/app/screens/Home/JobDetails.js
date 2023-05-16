import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function JobDetail({ route }) {
    const { job } = route.params;
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        // Simulating a fetch call here
        const fetchedApplicants = [
            { id: '1', name: 'John Doe', bio: 'Software engineer with 5 years of experience.', rating: 4.5, image: 'https://example.com/image1.jpg' },
            { id: '2', name: 'Jane Smith', bio: 'Data analyst specializing in healthcare.', rating: 4.7, image: 'https://example.com/image2.jpg' },
            { id: '3', name: 'Bob Johnson', bio: 'Experienced gardener with a passion for plants.', rating: 4.2, image: 'https://example.com/image3.jpg' },
            // Add more applicants here...
        ];
        setApplicants(fetchedApplicants);
    }, []);

    const renderApplicant = ({ item }) => (
        <View style={styles.applicantCard}>
            <Image source={{ uri: item.image }} style={styles.applicantImage} />
            <View>
                <Text style={styles.applicantName}>{item.name}</Text>
                <Text style={styles.applicantBio}>{item.bio}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={20} color="#ffd700" />
                    <Text style={styles.applicantRating}>{item.rating}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.jobCard}>
                <Text style={styles.title}>{job.title}</Text>
                <Text style={styles.description}>{job.description}</Text>
                <Text style={styles.date}>{job.datePosted}</Text>
                <Text style={styles.numApplications}>Applications: {job.numApplications}</Text>
            </View>
            <FlatList
                data={applicants}
                renderItem={renderApplicant}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

// Add the rest of your code including styles and export statement...

// Styles...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 18,
        marginTop: 10,
        color: '#fff',
    },
    date: {
        fontSize: 14,
        marginTop: 10,
        color: '#fff9',
    },
    numApplications: {
        fontSize: 14,
        marginTop: 10,
        color: '#fff9',
    },
    jobCard: {
        backgroundColor: '#4683fc',
        padding: 20,
        marginBottom: 20,
        borderRadius: 10,
        marginLeft: -15,
        marginRight: -15,
    },
    applicantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    applicantImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    applicantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    applicantBio: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    applicantRating: {
        fontSize: 14,
        marginLeft: 5,
    },
});

export default JobDetail;
