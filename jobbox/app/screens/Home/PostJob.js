// screens/PostJob.js

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function PostJob({ navigation }) {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [pay, setPay] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');

    const handlePost = async () => {
        // Inside your handlePost function...
        fetch('http://tranquil-ocean-74659.herokuapp.com/jobs', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            title: jobTitle,
            description: jobDescription,
            skills: skills,
            location: location,
            pay: pay,
            estimatedTime: estimatedTime,
            }),
         })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));

        navigation.goBack(); 
    }
    

    return (
        <ScrollView style={styles.container}>
            <TextInput
                label="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                style={styles.input}
            />
            <TextInput
                label="Job Description"
                value={jobDescription}
                onChangeText={setJobDescription}
                style={styles.input}
                multiline
            />
            <TextInput
                label="Skills Required"
                value={skills}
                onChangeText={setSkills}
                style={styles.input}
            />
            <TextInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
            />
            <TextInput
                label="Pay"
                value={pay}
                onChangeText={setPay}
                style={styles.input}
            />
            <TextInput
                label="Estimated Time"
                value={estimatedTime}
                onChangeText={setEstimatedTime}
                style={styles.input}
            />
            <Button mode="contained" onPress={handlePost} style={styles.button}>
                Post Job
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
        backgroundColor: '#4683FC', 
    },
});
