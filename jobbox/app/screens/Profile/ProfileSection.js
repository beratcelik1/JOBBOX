import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingEditButton from '../../components/FloatingEditButton';
import JobExperienceCard from '../../components/JobExperienceCard';
import EducationCard from '../../components/EducationCard';
import PlainCard from '../../components/PlainCard';
import BubbleTextList from '../../components/BubbleTextList';
import RecommendationCard from '../../components/ReccomendationCard'
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
        //navigation.goBack();
        setEditing(false);
      }
  
      //setEditing(false);
    } catch (err) {
      console.error("Failed to update profile section: ", err);
    }
  };
  

  if (editing) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{section.title}</Text>
        {
          section.title === 'About'
            ? (
              <React.Fragment>
                <Text style={styles.text}>About:</Text>
                <TextInput
                style={styles.input}
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
      </ScrollView>
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      {section_content}
      
    </ScrollView>
    <FloatingEditButton onPress={handleEdit}/>
    </React.Fragment>
  );
};

export default ProfileSection;
