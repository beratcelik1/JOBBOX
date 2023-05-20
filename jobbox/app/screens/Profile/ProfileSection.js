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

const ProfileSection = ({ route }) => {
  const { section } = route.params;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');

  const handleEdit = () => {
    setEditing(true);
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
          // Update this block according to your 'Experience' section's fields and data
          updateData = { experience: [...(section.data?.experience || []), { title: text, company: '', startDate: new Date(), endDate: new Date(), description: '' }] };
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
              name: name.trim(),
              relationship: relationship.trim(),
              recommendation: recommendation.trim()
            }]
          };
          break;
        default:
          break;
      }

      const response = await axios.put('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // after the section is successfully updated on the server, update the section text on the client
      if (response.status === 200) {
        setText(text);
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
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
        />
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
