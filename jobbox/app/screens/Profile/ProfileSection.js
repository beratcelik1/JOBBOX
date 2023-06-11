import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// const styles = StyleSheet.create({
//   button2: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center', 
//     marginHorizontal: 5,
//     marginLeft: 10,
//     backgroundColor: '#4683fc',
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingLeft: 10,
//     paddingRight: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     width: '50%',
//   }, 
//   buttonDel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center', 
//     marginHorizontal: 5,
//     marginLeft: 10,
//     backgroundColor: '#eb5c52',
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingLeft: 10,
//     paddingRight: 15,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     width: '50%',
//   },
// });
const styles = StyleSheet.create({
  input: {
      marginBottom: 10,
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 10, 
      paddingHorizontal: 15, 
      paddingVertical: 10,
      fontSize: 18, 
      color: '#333',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 6.62,
      elevation: 4, 
  },
  container: {
      flex: 1,
      padding: 20,
  },
  title: {
      fontSize: 25, 
      fontWeight: 'bold',
      marginBottom: 10, 
      color: '#4683FC' 
  },
  text: {
      fontSize: 15, 
      marginBottom: 10, 
  },
  card: {
      backgroundColor: '#fff',
      padding: 20, 
      marginBottom: 20, 
      borderRadius: 10, 
      
  }, 
  
  //   button2: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center', 
//     marginHorizontal: 5,
//     marginLeft: 10,
//     backgroundColor: '#4683fc',
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingLeft: 10,
//     paddingRight: 15,
//     borderRadius: 10,
    
//     width: '50%',
//   }, 

  button2: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      marginLeft: 10,
      backgroundColor: '#4683fc',
      paddingTop: 12, 
      paddingBottom: 12,
      paddingLeft: 15,
      paddingRight: 20,
      borderRadius: 10, 
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 15.84,
      elevation: 5,
      width: '60%', 
  },
  buttonDel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      marginLeft: 10,
      backgroundColor: '#eb5c52',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 15,
      paddingRight: 20,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 15.84,
      elevation: 5,
      width: '60%', 
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
  
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4683FC', // change the primary color to blue
    },
  };  
  
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
                <View style={{ borderBottomColor: '#000', borderBottomWidth: 1.5, marginBottom: 15}}/>  
                <TextInput
                style={styles.input}
                theme={theme}
                value={text}
                placeholder='About text'
                onChangeText={setText}
                />
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
                  <View style={{ alignItems: 'center'}}> 
                    <TouchableOpacity style={styles.buttonDel} onPress={() => handleDeleteExperience(index)}>
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                        <Text style={{ color: 'white', marginLeft: 5 }}>Delete </Text>
                    </TouchableOpacity>
                  </View>
                  
                   {/* <Button title="Delete" onPress={() => handleDeleteExperience(index)} /> */}
                  </React.Fragment>
                ))} 
                <View style={{ alignItems: 'center'}}> 
                  <TouchableOpacity style={styles.button2} onPress={addExperience}>
                      <Icon name="edit" size={15} color="#fff" />
                      <Text style={{ color: 'white', marginLeft: 5 }}>Add Experience </Text>
                  </TouchableOpacity>
                </View>
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
            <View style={{ alignItems: 'center'}}> 
              <TouchableOpacity style={styles.buttonDel} onPress={() => handleDeleteEducation(index)} >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text style={{ color: 'white', marginLeft: 5 }}>Delete </Text>
              </TouchableOpacity>
            </View>

            {/* <Button title="Delete" onPress={() => handleDeleteEducation(index)} /> */}
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
            <View style={{ alignItems: 'center'}}> 
              <TouchableOpacity style={styles.buttonDel} onPress={() => handleDeleteEducation(index)} >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text style={{ color: 'white', marginLeft: 5 }}>Delete </Text>
              </TouchableOpacity>
            </View>

            {/* <Button title="Delete" onPress={() => handleDeleteSkills(index)} /> */}
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
      <View style={{ borderBottomColor: '#000', borderBottomWidth: 1.5, marginBottom: 15}}/>  
      <View style={styles.card}> 
        <Text style={styles.text}>{section.text}</Text>
      </View> 

      <View style={{ alignItems: 'center'}}> 
        <TouchableOpacity style={styles.button2} onPress={handleEdit}>
            <Icon name="edit" size={15} color="#fff" />
            <Text style={{ color: 'white', marginLeft: 5 }}>Edit {section.title}</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ProfileSection;
