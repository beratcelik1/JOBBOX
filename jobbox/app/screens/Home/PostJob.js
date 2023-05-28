import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform  } from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import Modal from 'react-native-modal';
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';



export default function PostJob({ navigation }) {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [location, setLocation] = useState('');
    const [pay, setPay] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [estimatedTimeUnit, setEstimatedTimeUnit] = useState('minutes');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [category, setCategory] = useState('Web Development'); // Default category
    
    
    const timeUnits = ['Minutes', 'Hours', 'Weeks'];
    const categories = ['Web Development', 'Graphic Design', 'Content Writing', 'Marketing', 'Mobile App Development', 'Home Cleaning', 'Gardening', 'Dog Walking', 'Grocery Delivery', 'Moving'];

    const scrollViewRef = useRef();
    const jobDescriptionRef = useRef();

    const theme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#4683FC', // change the primary color to blue
        },
      };
    

    const isFormValid = () => {
        return jobTitle !== '' && 
               jobDescription !== '' && 
               skills !== '' && 
               location !== '' && 
               pay !== '' && 
               estimatedTime !== '';
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleCategoryModal = () => {
        setIsCategoryModalVisible(!isCategoryModalVisible);
    };

    const handleSelectTimeUnit = (unit) => {
        setEstimatedTimeUnit(unit);
        toggleModal();
    };
    const handleSelectCategory = (category) => {
        setCategory(category);
        toggleCategoryModal();
    };

    const handlePost = async () => {
        const token = await AsyncStorage.getItem('token');
        if (isNaN(pay)) {
            alert('Pay must be valid numbers');
            return;
        } 
        if (isNaN(estimatedTime)) {
            alert('Estimated Time must be valid numbers');
            return;}
        // Inside your handlePost function...
        fetch('http://tranquil-ocean-74659.herokuapp.com/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add this line
            },
            body: JSON.stringify({
                    title: jobTitle,
                    description: jobDescription,
                    skills: skills,
                    location: location,
                    pay: parseFloat(pay),           // ensure pay is a number
                    estimatedTime: parseFloat(estimatedTime),
                    estimatedTimeUnit: estimatedTimeUnit,
                    category: category
            }),
         })
         .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    navigation.goBack(); 
    }

       return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            style={{ flex: 1, padding: 15 }}
        >
               <KeyboardAwareScrollView 
        ref={scrollViewRef} 
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={0} // adjust based on your needs
    >
            <TextInput
                label="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                style={styles.input}
                theme={theme}
            />
            <View style={styles.inputRow}>
                <View style={styles.overlayContainer}>
                    <TextInput
                        label="Category"
                        value={category}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.overlay} onPress={toggleCategoryModal} />
                </View>
            </View>
            <TextInput
                label="Skills Required"
                value={skills}
                onChangeText={setSkills}
                style={styles.input}
                theme={theme}
            />
            <TextInput
                label="Location"
                value={location}
                onChangeText={setLocation}
                style={styles.input}
                theme={theme}
            />
            <View style={styles.inputRow}>
                <TextInput
                    label="Estimated Time"
                    value={estimatedTime}
                    onChangeText={setEstimatedTime}
                    style={[styles.input, styles.inputHalf]}
                    theme={theme}
                />
                <View style={styles.overlayContainer}>
                    <TextInput
                        label="Unit"
                        value={estimatedTimeUnit}
                        style={[styles.input, styles.inputHalf]}
                        theme={theme}
                    />
                    <TouchableOpacity style={styles.overlay} onPress={toggleModal} />
                </View>
            </View>
            <TextInput
                label="Pay"
                value={pay}
                onChangeText={setPay}
                style={styles.input}
                theme={theme}
            />
            <TextInput
                ref={jobDescriptionRef}
                label="Job Description"
                value={jobDescription}
                onChangeText={setJobDescription}
                style={[styles.input, styles.descriptionInput]}
                theme={theme}
            />

            <Modal 
                isVisible={isModalVisible} 
                style={styles.modal} 
                onBackdropPress={toggleModal}
            >
                <View style={styles.modalContent}>
                    {timeUnits.map((unit, index) => (
                    <List.Item
                        key={index}
                        title={unit}
                        onPress={() => handleSelectTimeUnit(unit)}
                    />
                    ))}
                    <Button onPress={toggleModal}>Close</Button>
                </View>
            </Modal>
            <Modal 
                isVisible={isCategoryModalVisible} 
                style={styles.modal} 
                onBackdropPress={toggleCategoryModal}
            >
                <View style={styles.modalContent}>
                    {categories.map((category, index) => (
                    <List.Item
                        key={index}
                        title={category}
                        onPress={() => handleSelectCategory(category)}
                    />
                    ))}
                    <Button onPress={toggleCategoryModal}>Close</Button>
                </View>
            </Modal>

            <Button mode="contained" onPress={handlePost} style={styles.button}
                disabled={!isFormValid()}>
                Post Job
            </Button>
            </KeyboardAwareScrollView>
</KeyboardAvoidingView>
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
    descriptionInput: {
        marginBottom: 10,
        backgroundColor: '#fff',
        flex: 2, // make the description input larger
    },
    button: {
        marginTop: 8,
        backgroundColor: '#4683FC', 
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    inputHalf: {
        flex: 1,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0, 
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    overlayContainer: {
        position: 'relative',
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
});