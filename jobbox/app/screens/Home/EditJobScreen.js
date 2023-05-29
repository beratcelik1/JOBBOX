import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { editJob, deleteJob } from '../../services/JobService';

export function EditJobScreen({ route, navigation }) {
  const { job } = route.params;
  const [description, setDescription] = useState(job.description);
  const [skills, setSkills] = useState(job.skills);
  const [location, setLocation] = useState(job.location);
  const [pay, setPay] = useState(job.pay);
  const [estimatedTime, setEstimatedTime] = useState(job.estimatedTime);
  const [estimatedTimeUnit, setEstimatedTimeUnit] = useState(job.estimatedTimeUnit); 

  useEffect(() => {
    navigation.setOptions({ title: 'Edit Job' });
  }, []);

  const handleSave = async () => {
    try {
      await editJob(job.id, { description, skills, location, pay, estimatedTime, estimatedTimeUnit });
      Alert.alert('Job updated!', '', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Error', 'There was an error updating the job.');
    }
    navigation.goBack();
  };

  const handleDelete = async () => {
    try {
      const response = await deleteJob(job.id);
      if (response) {
        Alert.alert('Job deleted!', '', [
          { text: 'OK', onPress: () => navigation.goBack() }, // replace 'HireScreen' with the name of your Hire Screen
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'There was an error deleting the job.');
    } 
    navigation.goBack();
    navigation.goBack();
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, padding: 15 }}
    >
      <KeyboardAwareScrollView>
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
