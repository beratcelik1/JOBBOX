import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center', // Align content in the center horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    // textAlign: 'center',
  },
  text: {
    fontSize: 16,
    // textAlign: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    // textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#4683FC', 
},
*/const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  text: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  // input: {
  //   backgroundColor: '#fff',
  //   padding: 20,
  //   marginBottom: 10,
  //   borderRadius: 10,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   fontSize: 16,
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,
  },
  input: {
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
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

  const [skills, setSkills] = useState(
    section.title === 'Skills' && section.data?.length > 0 
      ? section.data 
      : [{ title: '' }]
  );

  const [recommendations, setRecommendations] = useState(
    section.title === 'Recommendations' && section.data?.length > 0 
      ? section.data 
      : [{ name: '', relationship: '', recommendation: '' }]
  );
  
  
  
  useEffect(() => {
    if (section.title === 'About') {
      setText(section.text);
    } else if (section.title === 'Experience') {
      setExperience(section.data || [{position: '', company: ''}]);
    } else if (section.title === 'Education') {
      setEducation(section.data || [{date: '', degree: '', major: '', university: ''}]);
    } else if (section.title === 'Skills') {
      setSkills(section.data || [{ title: '' }]);
  }
    else if (section.title === 'Recommendations') {
    setRecommendations(section.data || [{ name: '', relationship: '', recommendation: '' }]);
  }
  }, [section]);
  
  const handleEdit = () => {
    if (section.title === 'About') {
      setText(section.text);
    } else if (section.title === 'Experience') {
      setExperience(section.data || [{position: '', company: ''}]);
    } else if (section.title === 'Education') {
      setEducation(section.data || [{date: '', degree: '', major: '', university: ''}]);
    } else if (section.title === 'Skills') {
      setSkills(section.data || [{ title: '' }]);
    }
    else if (section.title === 'Recommendations') {
      setRecommendations(section.data || [{ name: '', relationship: '', recommendation: '' }]);
    }
    setEditing(true);
  };

  const handleDeleteEducation = (index) => {
    let updatedEducation = [...education];
    updatedEducation.splice(index, 1);
    setEducation(updatedEducation);
  };
  
  // Delete handler for Experience
  const handleDeleteExperience = (index) => {
    let updatedExperience = [...experience];
    updatedExperience.splice(index, 1);
    setExperience(updatedExperience);
  };
  
  // Delete handler for Skills
  const handleDeleteSkills = (index) => {
    let updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
  };
  
  // Delete handler for Recommendations
  const handleDeleteRecommendations = (index) => {
    let updatedRecommendations = [...recommendations];
    updatedRecommendations.splice(index, 1);
    setRecommendations(updatedRecommendations);
  };
  
  
  const addExperience = () => {
    setExperience(prevExperience => [...prevExperience, {position: '', company: ''}]);
  };
  
  const addEducation = () => {
    setEducation(prevEducation => [...prevEducation, {date: '', degree: '', major: '', university: ''}]);
  };

  const addSkill = () => {
    setSkills(prevSkills => [...prevSkills, '']);
  };

  const addRecommendation = () => {
    setRecommendations(prevRecommendations => [...prevRecommendations, { name: '', relationship: '', recommendation: '' }]);
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
            updateData = { skills: skills.map(skill => skill.title) }; // only save the titles of the skills
            break;
        case 'Recommendations':
          // Update this block according to your 'Recommendations' section's fields and data
          updateData = { recommendations: recommendations };
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
          section.title === 'About'
            ? (
              <React.Fragment>
                <Text style={styles.label}>About:</Text>
                <TextInput
                style={styles.input}
                value={text}
                placeholder='About text'
                onChangeText={setText}
                />
{/*                 
                <Text style={styles.text}>First Name*:</Text>
                <TextInput
                style={styles.input}
                value={text}
                placeholder='First Name text'
                onChangeText={setText}
                /> 
                <Text style={styles.text}>Last Name*:</Text>
                <TextInput
                style={styles.input}
                value={text}
                placeholder='Last Name text'
                onChangeText={setText}
              
                />
                */}
              </React.Fragment>
            )
            : null
        }
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
                   <Button title="Delete" onPress={() => handleDeleteExperience(index)} />
                  </React.Fragment>
                ))}
                <Button title="Add Experience" onPress={addExperience} />
              </React.Fragment>
            )
            : (
              <React.Fragment>
              </React.Fragment>
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
            <Button title="Delete" onPress={() => handleDeleteEducation(index)} />
          </React.Fragment>
        ))}
        <Button title="Add Education" onPress={addEducation} />
      </React.Fragment>
      
    )
    : null
}

{
    section.title === 'Skills'
      ? (
        <React.Fragment>
          {skills.map((skill, index) => (
            <React.Fragment key={index}>
            <Text style={styles.text}>Skill:</Text>
            <TextInput
              style={styles.input}
              value={skill.title}
              placeholder='Skill'
              onChangeText={(text) => {
                setSkills((prevSkills) => {
                  const updatedSkills = [...prevSkills];
                  updatedSkills[index].title = text;
                  return updatedSkills;
                });
              }}
            />
            <Button title="Delete" onPress={() => handleDeleteSkills(index)} />
            </React.Fragment>
          ))}
          <Button title="Add Skill" onPress={addSkill} />
        </React.Fragment>
      )
      : null
  }

{
  section.title === 'Recommendations'
    ? (
      <React.Fragment>
        {recommendations.map((rec, index) => (
          <React.Fragment key={index}>
            <Text style={styles.text}>Name:</Text>
            <TextInput
              style={styles.input}
              value={rec.name}
              placeholder='Name'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].name = text;
                  return updatedRecs;
                });
              }}
            />
            <Text style={styles.text}>Relationship:</Text>
            <TextInput
              style={styles.input}
              value={rec.relationship}
              placeholder='Relationship'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].relationship = text;
                  return updatedRecs;
                });
              }}
            />
            <Text style={styles.text}>Recommendation:</Text>
            <TextInput
              style={styles.input}
              value={rec.recommendation}
              placeholder='Recommendation'
              onChangeText={(text) => {
                setRecommendations((prevRecs) => {
                  const updatedRecs = [...prevRecs];
                  updatedRecs[index].recommendation = text;
                  return updatedRecs;
                });
              }}
            />
            <Button title="Delete" onPress={() => handleDeleteRecommendations(index)} />
          </React.Fragment>
        ))}
        <Button title="Add Recommendation" onPress={addRecommendation} />
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

// const styles = StyleSheet.create({
//   container: {
//       padding: 15,
//   },
//   input: {
//       marginBottom: 10,
//       backgroundColor: '#fff',
//   },
//   button: {
//       marginTop: 10,
//       backgroundColor: '#4683FC', 
//   },
// });

export default ProfileSection;
