import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../components/LoadingScreen';
import defaultImage from '../../assets/images/defaultimage3.png';

const ApplicantProfile = ({route}) => {
  const { userId } = route.params;
  const [applicant, setApplicant] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [experiences, setExperiences] = useState([]);

  const navigation = useNavigation();

  const fetchApplicantData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      console.log('Token:', token);
      console.log('UserId:', userId);
      console.log("Sending request for userId: ", userId);
      const response = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/auth/users/${userId}`, { 
        headers: { Authorization: `Bearer ${token}` }, 
      });

      setApplicant({
  ...response.data,
  firstname: response.data.firstname || 'N/A',
  lastname: response.data.lastname || 'N/A',
  location: response.data.location || 'N/A'
});
      console.log(response.data); 

      
      const about = Array.isArray(response.data.about) ? response.data.about : [];
      const experience = Array.isArray(response.data.experience) ? response.data.experience : [];
      const education = Array.isArray(response.data.education) ? response.data.education : [];
      const skills = Array.isArray(response.data.skills) ? response.data.skills : [];
      const recommendations = Array.isArray(response.data.recommendations) ? response.data.recommendations : [];

      
      setSections([
        {
          id: '1',
          title: 'About',
          iconName: 'info',
          data: about,
          text: about.length > 0 ? about.map(a => `${a.title} ${a.description}`).join(', ') : 'No information provided.'
        },
        {
          id: '2',
          title: 'Experience',
          iconName: 'work',
          data: experience,
          text: experience.length > 0 ? experience.map(e => ` - ${e.position} at ${e.company}`).join('\n') : 'No information provided.'
        },
        {
          id: '3', 
          title: 'Education', 
          iconName: 'school', 
          data: education, 
          text: education.length > 0 ? 
            education.map(e => ` ${e.degree || 'N/A'} ${e.major || 'N/A'} at ${e.university || 'N/A'}, ${e.date || 'N/A'}, `).join('\n') : 
            'No information provided.'
        },
        {
          id: '4',
          title: 'Skills',
          iconName: 'star',
          data: skills.map(skill => ({ title: skill })), // transform each skill to an object with 'title' property
          text: skills.length > 0 ? skills.join(', ') : 'No information provided.',
          skillList: skills
        },          
        {
          id: '5',
          title: 'Recommendations',
          iconName: 'thumb-up',
          data: recommendations,
          text: recommendations.length > 0 ? recommendations.map(r => `${r.name} (${r.relationship}): ${r.recommendation}`).join(', ') : 'No information provided.'
        },
      ]);        

      setExperiences(experience);

    } catch (err) {
      console.error("Failed to fetch applicant data: ", err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchApplicantData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchApplicantData);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchApplicantData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {applicant && (  // Ensure that 'applicant' is not null before trying to access its properties
            <View style={styles.headerContainer}>
              <Image style={styles.profileImage} source={applicant.profilePic ? {uri: applicant.profilePic} : defaultImage} />
              <View>
                <Text style={styles.name}>{applicant.firstname} {applicant.lastname}</Text>
                <View style={styles.reviews}>
                  <Icon name="star" size={20} color="#f1c40f" />
                  <Text>4.5</Text>
                </View>
                <View>
                  <Text>{applicant.location}</Text>
                </View>
              </View>
            </View>
          )}
                <FlatList
        data={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 5 }}
        renderItem={({ item }) => (
          <View style={styles.sectionContainer}>
            <Icon name={item.iconName} size={24} color="#4683fc" style={styles.sectionIcon} />
            <Text>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <Text style={styles.sectionText}>{item.text}</Text> {/* Add this line to display the content */}
            </Text>
          </View>
        )}
        numColumns={1}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button2: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 5,
      marginLeft: 10,
      backgroundColor: '#4683fc',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 10,
      paddingRight: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    container: {
      flex: 1,
      marginTop: 5,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 5,
      marginRight: 5, 
      margingTop: 10, 
      padding: 20,
      marginBottom: 7,
      borderRadius: 10,
      backgroundColor: '#f8f9fa',
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 7,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 10,
      backgroundColor: '#d3d3d3',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    reviews: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      padding: 15,
      borderRadius: 10,
      marginRight:15,
      marginLeft:15,
      height: 75,
      backgroundColor: '#fff',
      // Android shadow properties
      elevation: 5,
      // iOS shadow properties
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5, 
    },
    sectionIcon: {
      marginRight: 10,
      marginLeft: '10%',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    sectionText: {
      flex: 1,
      marginTop: 5,
      fontSize: 14,
    },
    modalView: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 35,
      alignItems: 'center',
      fontSize: 20, 
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: -7,
      },
      shadowOpacity: 0.25,
      shadowRadius: 6.84,
      elevation: 5, 
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      marginTop: 15,
    },
});

export default ApplicantProfile;
