// screens/PostJob.js

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

export default function PostJob() {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handlePost = () => {
        // handle job posting logic here
        console.log(`Job Title: ${jobTitle}, Job Description: ${jobDescription}`);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setJobTitle}
                value={jobTitle}
                placeholder="Job Title"
            />
            <TextInput
                style={styles.input}
                onChangeText={setJobDescription}
                value={jobDescription}
                placeholder="Job Description"
            />
            <Button
                onPress={handlePost}
                title="Post Job"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
    },
});
