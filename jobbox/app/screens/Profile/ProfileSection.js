import React, { useState, useEffect } from 'react';

import { TouchableOpacity,View, Text, TextInput, Button, StyleSheet, ScrollView, Keyboard } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingEditButton from '../../components/FloatingEditButton';
import JobExperienceCard from '../../components/JobExperienceCard';
import EducationCard from '../../components/EducationCard';
import PlainCard from '../../components/PlainCard';
import BubbleTextList from '../../components/BubbleTextList';
import RecommendationCard from '../../components/ReccomendationCard'
import FloatingSaveButton from '../../components/FloatingSaveButton';
import { AntDesign } from '@expo/vector-icons';

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
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

 useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  
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
        //setEditing(false);
      }
  
      //setEditing(false);
    } catch (err) {
      console.error("Failed to update profile section: ", err);
    }
  };
  

  if (editing) {
    return (
      <React.Fragment>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{section.title}</Text>
        {
          section.title === 'About'
            ? (

              <View style={{
                backgroundColor: '#fff',
                padding: 16,
                marginBottom: 30,
                borderRadius: 8,
              }}>
                <TextInput

                value={text}
                placeholder='About text'
                onChangeText={setText}
                />
              </View>
            )
            : null
        }
        {
          section.title === 'Experience'
            ? (
              <React.Fragment>
                {experience.map((exp, index) => (
                  <View key={index} style={{
                    backgroundColor: '#fff',
                    padding: 16,
                    marginBottom: 30,
                    borderRadius: 8,
                  }}>
                    <TouchableOpacity style={{
                      position: 'absolute',
                      top: -20,
                      right: 0,
                      width: 30,
                      height: 30,
                      borderRadius: 12,
                      backgroundColor: '#fff',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }} onPress={()=>handleDeleteExperience(index)}>
                          <AntDesign name="close" size={18} color="#ff0000" />
                    </TouchableOpacity>
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
                  </View>
                ))}<TouchableOpacity onPress={addExperience} style={[{
                  alignItems: 'center',
                  backgroundColor: '#4683fc',
                  padding: 10,
                  marginBottom: 40
                },isKeyboardVisible ? {paddingBottom: 280} : {}]}>
                        <Text style={{color: '#ffffff' }}>Add Experience</Text>
                      </TouchableOpacity>
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
          <View key={index} style={{
            backgroundColor: '#fff',
            padding: 16,
            marginBottom: 30,
            borderRadius: 8,
          }}>
          <TouchableOpacity style={{
    position: 'absolute',
    top: -20,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }} onPress={()=>handleDeleteEducation(index)}>
        <AntDesign name="close" size={18} color="#ff0000" />
      </TouchableOpacity>
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
          </View>

        ))}
        <TouchableOpacity onPress={addEducation} style={[{
    alignItems: 'center',
    backgroundColor: '#4683fc',
    padding: 10,
    marginBottom: 40
  },isKeyboardVisible ? {paddingBottom: 280} : {}]}>
          <Text style={{color: '#ffffff' }}>Add Education</Text>
        </TouchableOpacity>
      </React.Fragment>
      
    )
    : null
}

{
    section.title === 'Skills'
      ? (
        <React.Fragment>
          {skills.map((skill, index) => (
            <View key={index} style={{
              backgroundColor: '#fff',
              padding: 16,
              marginBottom: 30,
              borderRadius: 8,
            }}>
              <TouchableOpacity style={{
    position: 'absolute',
    top: -20,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }} onPress={()=>handleDeleteSkills(index)}>
        <AntDesign name="close" size={18} color="#ff0000" />
      </TouchableOpacity>
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
            </View>

          ))}
          <TouchableOpacity onPress={addSkill} style={[{
    alignItems: 'center',
    backgroundColor: '#4683fc',
    padding: 10,
    marginBottom: 40
  },isKeyboardVisible ? {paddingBottom: 280} : {}]}>
          <Text style={{color: '#ffffff' }}>Add Skill</Text>
        </TouchableOpacity>
        </React.Fragment>
      )
      : null
  }

{
  section.title === 'Recommendations'
    ? (
      <React.Fragment>
        {recommendations.map((rec, index) => (
          <View key={index} style={{
            backgroundColor: '#fff',
            padding: 16,
            marginBottom: 30,
            borderRadius: 8,
          }}>
            <TouchableOpacity style={{
    position: 'absolute',
    top: -20,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  }} onPress={()=>handleDeleteRecommendations(index)}>
        <AntDesign name="close" size={18} color="#ff0000" />
      </TouchableOpacity>
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
          </View>
        ))}
        <TouchableOpacity onPress={addRecommendation} style={[{
    alignItems: 'center',
    backgroundColor: '#4683fc',
    padding: 10,
    marginBottom: 40
  },isKeyboardVisible ? {paddingBottom: 280} : {}]}>
          <Text style={{color: '#ffffff' }}>Add Recommendation</Text>
        </TouchableOpacity>
      </React.Fragment>
    )
    : null
}

      </ScrollView>
      <FloatingSaveButton onPress={handleSave}/>
      </React.Fragment>
    );
  }


  let section_content;
  switch (section.title) {
    case 'About':
      section_content=(<PlainCard content={section.text}/>)
      break;
      case 'Experience': 
      section_content=section.data.map((experience, index) => (
        <JobExperienceCard
          key={index}
          position={experience.position}
          company={experience.company}
        />
      ))
      break;
      case 'Education':
        section_content=section.data.map((education, index) => (
          <EducationCard
            key={index}
            university={education.university}
            degree={education.degree}
            major={education.major}
            date={education.date}
          />
        ))
      break;
      case 'Skills':
        section_content=(<BubbleTextList items={section.data} />)
        break;
    case 'Recommendations':
      section_content=section.data.map(
        (recommendation, index) => (
          <RecommendationCard
            key={index}
            name={recommendation.name}
            relationship={recommendation.relationship}
            recommendation={recommendation.recommendation}
          />
        )
      )
      break;
    default:
      break;
  }
  section_content=section.data.length>0?section_content:(<Text style={styles.text}>{section.text}</Text>);
  return (

    <React.Fragment>
    <ScrollView style={styles.container} >
      <Text style={styles.title}>{section.title}</Text>
      <TouchableOpacity onLongPress={handleEdit}>
      {section_content}
      </TouchableOpacity>
      
      
    </ScrollView>
    <FloatingEditButton onPress={handleEdit}/>
    </React.Fragment>

  );
};

export default ProfileSection;
