import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, RefreshControl, Modal, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import fetch from 'node-fetch';
import LoadingScreen from '../../components/LoadingScreen';
import { LOCATIONS } from '../constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [sections, setSections] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Kelowna, BC');

  useEffect(() => {
    if (user && user.location) {
      setSelectedLocation(user.location);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response data: ", response.data); // log the response data
      console.log("Profile pic path: ", response.data.profilePic); 
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
          text: education.length > 0 ? 
            education.map(e => ` ${e.degree || 'N/A'} ${e.major || 'N/A'} at ${e.university || 'N/A'}, ${e.date || 'N/A'}, `).join('\n') : 
            'No information provided.'
        },
        {
          id: '4',
          title: 'Skills',
          iconName: 'star',
          data: skills.map(skill => ({ title: skill })), // transform each skill to an object with 'title' property
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {

    // Call fetchUserData once immediately
    fetchUserData();
  
    // Then set it up to be called again every time the Profile screen comes into focus
    const unsubscribe = navigation.addListener('focus', fetchUserData);
  
    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    const token = await AsyncStorage.getItem('token');
    fetch('https://tranquil-ocean-74659.herokuapp.com/auth/user/me/location', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ location }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
  
    setIsLocationModalVisible(false);
  };

  const handleProfilePhotoPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        let localUri = result.assets[0].uri;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('image', { uri: localUri, name: filename, type });

        const token = await AsyncStorage.getItem('token');

        try {
          let response = await axios.post(
            'https://tranquil-ocean-74659.herokuapp.com/upload',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`,
              },
            }
          );
        
          if (response.data && response.data.path) {
            let imagePath = response.data.path;
            let imageUrl = 'https://tranquil-ocean-74659.herokuapp.com' + imagePath;
        
            try {
              let profilePicResponse = await axios.put(
                'https://tranquil-ocean-74659.herokuapp.com/auth/user/me/profilePic',
                { profilePic: imageUrl },
                { headers: { Authorization: `Bearer ${token}`, }, }
              );
        
              if (profilePicResponse.data) {
                setUser((prevUser) => ({
                  ...prevUser,
                  profilePic: profilePicResponse.data.profilePic,
                }));
        
                alert('Profile photo updated successfully!');
              }
            } catch (err) {
              console.error("Failed to update profile picture: ", err);
            }
          }
        } catch (err) {
          console.error("Failed to upload image: ", err);
        }
        
    }
};

return (
  <View style={styles.container}>
    {user ? (
      <>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={handleProfilePhotoPress}>
          <Image style={styles.profileImage} source={{uri: user.profilePic}} />
            {loading && <LoadingScreen />}
          </TouchableOpacity>
          <View>
            <Text style={styles.name}>{user.firstname} {user.lastname}</Text>
            <View style={styles.reviews}>
              <Icon name="star" size={20} color="#f1c40f" />
              <Text>4.5</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{selectedLocation}</Text>
            <TouchableOpacity style={styles.button2} onPress={() => setIsLocationModalVisible(true)}>
              <Icon name="edit" size={15} color="#fff" />
              <Text style={{ color: 'white', marginLeft: 5 }}>Edit Location</Text>
            </TouchableOpacity>
            </View>
            <Modal
          animationType="slide"
          transparent={true}
          visible={isLocationModalVisible}
          onRequestClose={() => setIsLocationModalVisible(false)}
          presentationStyle='overFullScreen'
        >
          <View style={styles.modalView}>
            {LOCATIONS.map((location, index) => (
              <List.Item
                key={index}
                title={location}
                onPress={() => handleLocationSelect(location)}
              />
            ))}
            <Pressable style={styles.button} onPress={() => setIsLocationModalVisible(false)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </Modal>
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
              </Text>
            </TouchableOpacity>
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
    ) : (
      <ActivityIndicator size="large" color="#0000ff" />
    )}
  </View>
);
};

export default Profile;

