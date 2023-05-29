import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DefaultTheme } from 'react-native-paper';
import { editJob, deleteJob } from '../../services/JobService';

const EditJobScreen = ({ route, navigation }) => {
  const { job } = route.params;

  const [jobTitle, setJobTitle] = useState(job.title);
  const [jobDescription, setJobDescription] = useState(job.description);
  const [skills, setSkills] = useState(job.skills);
  const [location, setLocation] = useState(job.location);
  const [pay, setPay] = useState(job.pay);
  const [estimatedTime, setEstimatedTime] = useState(job.estimatedTime);
  const [estimatedTimeUnit, setEstimatedTimeUnit] = useState(job.estimatedTimeUnit);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [category, setCategory] = useState(job.category);

  const timeUnits = ['Minutes', 'Hours', 'Weeks'];
  const categories = ['Web Development', 'Graphic Design', 'Content Writing', 'Marketing', 'Mobile App Development', 'Home Cleaning', 'Gardening', 'Dog Walking', 'Grocery Delivery', 'Moving'];

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4683FC', 
    },
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

  const handleSave = async () => {
    try {
      if (isNaN(pay)) {
        alert('Pay must be valid numbers');
        return;
      }
      if (isNaN(estimatedTime)) {
        alert('Estimated Time must be valid numbers');
        return;
      }
      
      await editJob(job.id, {
        title: jobTitle,
        description: jobDescription,
        skills: skills,
        location: location,
        pay: parseFloat(pay),
        estimatedTime: parseFloat(estimatedTime),
        estimatedTimeUnit: estimatedTimeUnit,
        category: category,
      });
      Alert.alert('Job updated!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'There was an error updating the job.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteJob(job.id);
      if (response) {
        Alert.alert('Job deleted!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (error) {
      Alert.alert('Error', 'There was an error deleting the job.');
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, padding: 15 }}
    >
      <KeyboardAwareScrollView>
        <TextInput
                label="Job Title"
                value={title}
                onChangeText={setJobTitle}
                style={styles.input}
        />
        <TextInput
          label="Job Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
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
          label="Estimated Time"
          value={estimatedTime}
          onChangeText={setEstimatedTime}
          style={styles.input}
        />
        <TextInput
          label="Unit"
          value={estimatedTimeUnit}
          onChangeText={setEstimatedTimeUnit}
          style={styles.input}
        />
        <TextInput
          label="Pay"
          value={pay}
          onChangeText={setPay}
          style={styles.input}
        />
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Delete Job" color="red" onPress={handleDelete} />
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});
