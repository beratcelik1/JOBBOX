import React, { useState, useEffect } from 'react';
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
  const [text, setText] = useState(section.title === 'About' ? section.text : '');
  const [experience, setExperience] = useState(
    section.title === 'Experience' && section.data?.length > 0 
      ? section.data 
      : [{position: '', company: ''}]
  );
  const [education, setEducation] = useState(
    section.title === 'Education' && section.data?.length > 0 
      ? section.data 
      : []
  );
  
  
  
  useEffect(() => {
    if (section.title === 'About') {
      setText(section.text);
    } else if (section.title === 'Experience') {
      setExperience(section.data || [{position: '', company: ''}]);
    } else if (section.title === 'Education') {
      setEducation(section.data || [{date: '', degree: '', major: '', university: ''}]);
    }
  }, [section]);
  
  const handleEdit = () => {
    if (section.title === 'About') {
      setText(section.text);
    } else if (section.title === 'Experience') {
      setExperience(section.data || [{position: '', company: ''}]);
    } else if (section.title === 'Education') {
      setEducation(section.data || [{date: '', degree: '', major: '', university: ''}]);
    }
    setEditing(true);
  };

  const handleDelete = (index) => {
    let updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };
  
  
  const addExperience = () => {
    setExperience(prevExperience => [...prevExperience, {position: '', company: ''}]);
  };
  
  const addEducation = () => {
    setEducation(prevEducation => [...prevEducation, {date: '', degree: '', major: '', university: ''}]);
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
          updateData = { experience: experience };
          break;
          case 'Education':
          updateData = { education: education };
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
                    <TextInput
                    style={styles.input}
                    value={exp.position}
                    placeholder='Position'
                    onChangeText={(text) => {
                      setExperience((prevExperience) => {
                        const updatedExperience = [...prevExperience];
                        updatedExperience[index].position = text;
                        return updatedExperience;
                      });
                    }}
                  />
                  <Text style={styles.text}>Company:</Text>
                  <TextInput
                    style={styles.input}
                    value={exp.company}
                    placeholder='Company'
                    onChangeText={(text) => {
                      setExperience((prevExperience) => {
                        const updatedExperience = [...prevExperience];
                        updatedExperience[index].company = text;
                        return updatedExperience;
                      });
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

{
  section.title === 'Education'
    ? (
      <React.Fragment>
        {education.map((edu, index) => (
          <React.Fragment key={index}>
            <Text style={styles.text}>Date:</Text>
            <TextInput
              style={styles.input}
              value={edu.date}
              placeholder='Date'
              onChangeText={(text) => {
                let updatedEducation = [...education];
                updatedEducation[index].date = text;
                setEducation(updatedEducation);
              }}
            />
            <Text style={styles.text}>Degree:</Text>
            <TextInput
              style={styles.input}
              value={edu.degree}
              placeholder='Degree'
              onChangeText={(text) => {
                let updatedEducation = [...education];
                updatedEducation[index].degree = text;
                setEducation(updatedEducation);
              }}
            />
            <Text style={styles.text}>Major:</Text>
            <TextInput
              style={styles.input}
              value={edu.major}
              placeholder='Major'
              onChangeText={(text) => {
                let updatedEducation = [...education];
                updatedEducation[index].major = text;
                setEducation(updatedEducation);
              }}
            />
            <Text style={styles.text}>University:</Text>
            <TextInput
              style={styles.input}
              value={edu.university}
              placeholder='University'
              onChangeText={(text) => {
                let updatedEducation = [...education];
                updatedEducation[index].university = text;
                setEducation(updatedEducation);
              }}
            />
            <Button title="Delete" onPress={() => handleDelete(index)} />
          </React.Fragment>
        ))}
        <Button title="Add Education" onPress={addEducation} />
      </React.Fragment>
      
    )
    : null
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
