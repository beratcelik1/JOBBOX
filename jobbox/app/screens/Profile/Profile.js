import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 20,
    paddingRight: 20, 
    paddingTop: 20, 
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
    borderRadius: 15,
    marginRight:15,
    marginLeft:15,
    height: 75,
    backgroundColor: '#fff',
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
        width: -10,
        height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionIcon: {
    marginRight: 10,
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
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Response data: ", response.data); // log the response data
        setUser(response.data);
  
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
            text: education.length > 0 ? education.map(e => `${e.degree} ${e.fieldOfStudy} ${e.institution}`).join(', ') : 'No information provided.'
          },
          {
            id: '4',
            title: 'Skills',
            iconName: 'star',
            data: skills,
            text: skills.length > 0 ? skills.join(', ') : 'No information provided.'
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
        console.error("Failed to fetch user data: ", err);
      }
    };
    
    // Call fetchUserData once immediately
    fetchUserData();
  
    // Then set it up to be called again every time the Profile screen comes into focus
    const unsubscribe = navigation.addListener('focus', fetchUserData);
  
    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  const handleProfilePhotoPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      includeBase64: true,
    }).then(async (image) => {
      setLoading(true);
      const file = {
        uri: image.path,
        type: image.mime,
        name: image.filename || `filename.${image.mime.split('/')[1]}`,
      };
      let formData = new FormData();
      formData.append('image', file);
      const token = await AsyncStorage.getItem('token');
      const uploadResponse = await axios.post(
        'https://tranquil-ocean-74659.herokuapp.com/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const updateResponse = await axios.put(
        'https://tranquil-ocean-74659.herokuapp.com/auth/user/me/profilePic',
        { profilePic: uploadResponse.data.path },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setUser((prevUser) => ({
        ...prevUser,
        profilePic: updateResponse.data.profilePic,
      }));
      setLoading(false);
      alert('Profile photo updated successfully!');
    }).catch((error) => {
      console.log(error);
    });
  };
  
return (
  <View style={styles.container}>
    {user ? (
      <>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfilePhotoPress}>
            <Image style={styles.profileImage} source={{uri: user.profilePic || undefined}} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </TouchableOpacity>
          <View>
            <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
            <View style={styles.reviews}>
              <Icon name="star" size={20} color="#f1c40f" />
              <Text>4.5</Text>
            </View>
            <Text>San Francisco, CA</Text>
          </View>
        </View>

        <FlatList 
          data={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 5 }} // adjust this value as needed
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.sectionContainer}
              onPress={() => navigation.navigate('ProfileSection', { section: item })}
            >
              <Icon name={item.iconName} size={24} color="#4683fc" style={styles.sectionIcon} />
              <Text>
                <Text style={styles.sectionTitle}>{item.title}</Text>
                <Text style={styles.sectionText}><Text></Text></Text> {/* <-- Wrapped sectionText with <Text> */}
              </Text>
            </TouchableOpacity>
          )}  
          numColumns={1}
        />
      </>
    ) : (
      <ActivityIndicator size="large" color="#0000ff" />
    )}
  </View>
);
};

export default Profile;

