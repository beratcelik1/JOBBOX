import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

const ProfileSection = ({ route, navigation }) => {
  const { section } = route.params;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const [position, setPosition] = useState('');
  const [company, setCompany] = useState('');
  const [experience, setExperience] = useState([{position: '', company: ''}]); 

  const handleEdit = () => {
    setEditing(true);
  };

  const addExperience = () => {
    setExperience(prevExperience => [...prevExperience, {position: '', company: ''}]);
  };
  

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      let updateData = {};
  
      switch (section.title) {
        case 'About':
          updateData = { about: [...(section.data?.about || []), { title: '', description: text  }] };
          break;
        case 'Experience': 
          updateData = { experience: [...(section.data?.experience || []), ...experience] };
          break;
        case 'Education':
          // Update this block according to your 'Education' section's fields and data
          updateData = { education: [...(section.data?.education || []), { institution: text, degree: '', fieldOfStudy: '', startDate: new Date(), endDate: new Date(), description: '' }] };
          break;
        case 'Skills':
          updateData = { skills: [...(section.data?.skills || []), ...text.split(',').map(skill => skill.trim())] };
          break;
        case 'Recommendations':
          // Update this block according to your 'Recommendations' section's fields and data
          const [name, relationship, recommendation] = text.split(',');
          updateData = {
            recommendations: [...(section.data?.recommendations || []), {
              name: name,
              relationship: relationship,
              recommendation: recommendation
            }]
          };
          break;
        default:
          break;
      }
  
      const response = await axios.put('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // after the section is successfully updated on the server, navigate back to Profile
      if (response.status === 200) {
        navigation.goBack();
      }
  
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile section: ", err);
    }
  };
  

  if (editing) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{section.title}</Text>
        {
          section.title === 'Experience'
            ? (
              <React.Fragment>
                {experience.map((exp, index) => (
                  <React.Fragment key={index}>
                    <Text style={styles.text}>Position:</Text>
                    <TextInput style={styles.input} 
                     value={exp.position} 
                     placeholder='Position' 
                     onChangeText={(text) => { 
                       let updatedExperience = [...experience];
                       updatedExperience[index].position = text;
                       setExperience(updatedExperience); 
                     }} />

                    <Text style={styles.text}>Company:</Text>
                    <TextInput
                      style={styles.input}
                      value={exp.company}
                      placeholder='Company'
                      onChangeText={(text) => {
                        let updatedExperience = [...experience];
                        updatedExperience[index].company = text;
                        setExperience(updatedExperience);
                      }}
                    />
                  </React.Fragment>
                ))}
                <Button title="Add Experience" onPress={addExperience} />
              </React.Fragment>
            )
            : (
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
              />
            )
        }
        <Button title="Save" onPress={handleSave} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      <Text style={styles.text}>{section.text}</Text>
      <Button title="Edit" onPress={handleEdit} />
    </View>
  );
};

export default ProfileSection;
