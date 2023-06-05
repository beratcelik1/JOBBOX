import React, { useState, useRef, useEffect } from 'react';
import {View,ScrollView,StyleSheet,TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native';
import { TextInput, Button, List } from 'react-native-paper';
import Modal from 'react-native-modal';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { TIME_UNITS, CATEGORIES, SKILLS_BY_CATEGORY, LOCATIONS } from '../constants';
import { showMessage } from 'react-native-flash-message';

export default function PostJob({ navigation, route }) {
  const { template, editing } = route.params || {};

  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [skills, setSkills] = useState([]);
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [estimatedTimeUnit, setEstimatedTimeUnit] = useState('minutes');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [category, setCategory] = useState('');
  const selectedCategory = CATEGORIES.find(c => c.id === category);
  const [isSkillsModalVisible, setIsSkillsModalVisible] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(new Set());
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);

  const scrollViewRef = useRef();
  const jobDescriptionRef = useRef();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4683FC', // change the primary color to blue
    },
  };

  useEffect(() => {
    if (template) {
      setJobTitle(template.title);
      setJobDescription(template.description);
      setSkills(template.skills);
      setLocation(template.location);
      setPay(template.pay?.toString());
      setEstimatedTime(template.estimatedTime?.toString());
      setEstimatedTimeUnit(template.estimatedTimeUnit);
      setCategory(template.category);
    }
  }, [template]);

  const isFormValid = () => {
    return (
      jobTitle !== '' &&
      !!selectedCategory  &&
      !!selectedSkills  &&
      !!selectedLocation &&
      estimatedTime !== '' &&
      !!estimatedTimeUnit &&
      pay !== ''  &&
      jobDescription !== ''
    );
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
    setCategory(category.id);
    console.log("Selected Category: ", category);
    const categoryId = Number(category.id); // Convert to number
   console.log("Skills for selected category: ", SKILLS_BY_CATEGORY.get(categoryId));
    setSkills(SKILLS_BY_CATEGORY.get(categoryId) || []); // set skills for selected category
    setSelectedSkills(new Set()); // reset selected skills when category changes
    toggleCategoryModal();
};
  const handleSelectSkill = (skill) => {
    setSelectedSkills((prevSkills) => {
      const newSkills = new Set(prevSkills);
      if (newSkills.has(skill)) {
        newSkills.delete(skill);
      } else {
        newSkills.add(skill);
      }
      return newSkills;
    });
    setIsSkillsModalVisible(false);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsLocationModalVisible(false);
  };
  

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('token');
    if (isNaN(pay)) {
      alert('Pay must be valid numbers');
      return;
    }
    if (isNaN(estimatedTime)) {
      alert('Estimated Time must be valid numbers');
      return;
    }

    fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/${template._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add this line
      },
      body: JSON.stringify({
        description: jobDescription,
        skills: Array.from(selectedSkills),
        location: location,
        pay: parseFloat(pay), // ensure pay is a number
        estimatedTime: parseFloat(estimatedTime),
        estimatedTimeUnit: estimatedTimeUnit,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));

    showMessage({
      message: 'Your job is updated!',
      type: 'info',
      floating: true,
      icon: 'success',
      duration: 3000,
    });
    navigation.navigate('HireScreen');
  };

  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    if (isNaN(pay)) {
      alert('Pay must be valid numbers');
      return;
    }
    if (isNaN(estimatedTime)) {
      alert('Estimated Time must be valid numbers');
      return;
    }
    // Inside your handlePost function...
    fetch('http://tranquil-ocean-74659.herokuapp.com/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Add this line
      },
      body: JSON.stringify({
        title: jobTitle,
        description: jobDescription,
        skills: Array.from(selectedSkills),
        location: location,
        pay: parseFloat(pay), // ensure pay is a number
        estimatedTime: parseFloat(estimatedTime),
        estimatedTimeUnit: estimatedTimeUnit,
        category: category,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));

    showMessage({
      message: !template
        ? 'Your request has been sent!'
        : 'Your job is posted!',
      description:
        !template &&
        'you will get a notification when your job post is approved.',
      type: 'info',
      floating: true,
      icon: 'success',
      duration: 3000,
    });
    navigation.navigate('HireScreen');
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
        <TextInput
          label="Job Title"
          value={jobTitle}
          onChangeText={setJobTitle}
          style={styles.input}
          theme={theme}
          editable={!template}
        />
        <View style={styles.inputRow}>
          <View style={styles.overlayContainer}>
            <TextInput
            label="Category"
            value={selectedCategory ? selectedCategory.title : ''}
            style={styles.input}
            editable={!template}
          />
            {!template && (
              <TouchableOpacity
                style={styles.overlay}
                onPress={toggleCategoryModal}
              />
            )}
          </View>
        </View>
        <View style={styles.overlayContainer}>
        <TextInput
          label="Skills Required"
          value={Array.from(selectedSkills).join(', ')}
          style={styles.input}
          editable={false}
          theme={theme}
        />
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsSkillsModalVisible(true)}
        />
      </View>
      <View style={styles.overlayContainer}>
        <TextInput
          label="Location"
          value={selectedLocation}
          style={styles.input}
          theme={theme}
        />
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsLocationModalVisible(true)}
        />
      </View>
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
              value={estimatedTimeUnit || 'Select'}
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
                  {TIME_UNITS.map((unit, index) => (
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
                  {CATEGORIES.map((category, index) => (
                    <List.Item
                      key={index}
                      title={category.title}
                      onPress={() => handleSelectCategory(category)}
                    />
                  ))}
                <Button onPress={toggleCategoryModal}>Close</Button>
              </View>
            </Modal>
                      <Modal
            isVisible={isSkillsModalVisible}
            style={styles.modal}
            onBackdropPress={() => setIsSkillsModalVisible(false)}
          >
            <View style={styles.modalContent}>
            {skills.map((skill, index) => (
              <List.Item
                key={index}
                title={skill}
                titleStyle={selectedSkills.has(skill) ? styles.selectedSkill : {}}
                onPress={() => handleSelectSkill(skill)}
              />
            ))}
              <Button onPress={() => setIsSkillsModalVisible(false)}>Close</Button>
            </View>
          </Modal>
          <Modal
          isVisible={isLocationModalVisible}
          style={styles.modal}
          onBackdropPress={() => setIsLocationModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {LOCATIONS.map((location, index) => (
              <List.Item
                key={index}
                title={location}
                onPress={() => handleSelectLocation(location)}
              />
            ))}
            <Button onPress={() => setIsLocationModalVisible(false)}>Close</Button>
          </View>
        </Modal>
        <Button
          mode="contained"
          onPress={editing ? handleEdit : handlePost}
          style={styles.button}
          disabled={!isFormValid()}
        >
          {editing ? 'Save Edit' : 'Post Job'}
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
    // Inside your styles definition
    selectedSkill: {
      color: '#4683fc',
    },  
});
