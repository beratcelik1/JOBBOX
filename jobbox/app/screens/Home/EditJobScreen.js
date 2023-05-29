import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DefaultTheme } from 'react-native-paper';
import { editJob, deleteJob } from '../../services/JobService';

export function EditJobScreen  ({ route, navigation }) {
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
            value={estimatedTime.toString()}
            onChangeText={(text) => {
              if (!isNaN(text)) {
                setEstimatedTime(parseFloat(text));
              }
            }}
            keyboardType="numeric"
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
          value={pay.toString()}
          onChangeText={(text) => {
            if (!isNaN(text)) {
              setPay(parseFloat(text));
            }
          }}
          keyboardType="numeric"
          style={styles.input}
          theme={theme}
        />
        <TextInput
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
        <Button onPress={handleSave} style={styles.button}>Save Changes</Button>
        <Button onPress={handleDelete} style={styles.button} color="red">Delete Job</Button>
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
