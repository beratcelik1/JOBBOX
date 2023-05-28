import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

import { editJob, deleteJob } from '../../services/JobService';


export function EditJobScreen({ route, navigation }) {
    const { job } = route.params;

    // const [jobTitle, setTitle] = useState(job.jobTitle);
    const [jobDescription, setJobDescription] = useState(job.jobDescription);
    const [skills, setSkills] = useState(job.skills);
    const [location, setLocation] = useState(job.location);
    const [pay, setPay] = useState(job.pay);
    const [estimatedTime, setEstimatedTime] = useState(job.estimatedTime);
    const [estimatedTimeUnit, setEstimatedTimeUnit] = useState(job.estimatedTimeUnit);
    // do this for all the fields you want to be editable
    
    const timeUnits = ['Minutes', 'Hours', 'Weeks'];

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
   
    useEffect(() => {
        navigation.setOptions({ title: 'Edit Job' });
    }, []);

    const handleSave = async () => {
        try {
          await editJob(job.id, { jobDescription, skills, location, pay, estimatedTime, estimatedTimeUnit });
          Alert.alert('Job updated!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
        } catch (error) {
          Alert.alert('Error', 'There was an error updating the job.');
        }
      
        navigation.goBack();
      };

    const handleDelete = async () => {
        try {
          await deleteJob(jobId);
          // do something after the job has been deleted
        } catch (error) {
          console.error(error);
        }
    };

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
            {/* <TextInput
                label="Job Title"
                value={jobTitle}
                onChangeText={setJobTitle}
                style={styles.input}
                theme={theme}
            /> */}
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
            
            <Button mode="contained" onPress={handleSave} style={styles.button}
                disabled={!isFormValid()}>
                Save Changes
            </Button>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}
