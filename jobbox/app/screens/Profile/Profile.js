import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#dedcdc',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginRight:5,
    marginLeft:5,
    height: 75,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 5,
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

const sections = [
  { id: '1', title: 'About', iconName: 'info', text: 'Software developer with over 5 years of experience...' },
  // Update the text field with relevant content for each section
  { id: '2', title: 'Experience', iconName: 'work', text: 'Experience details...' },
  { id: '3', title: 'Education', iconName: 'school', text: 'Education details...' },
  { id: '4', title: 'Skills', iconName: 'star', text: 'Skills details...' },
  { id: '5', title: 'Recommendations', iconName: 'thumb-up', text: 'Recommendations details...' },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
      }
    };    

    fetchUserData();
  }, []);

  const handleProfilePhotoPress = () => {
    console.log('Profile photo pressed.');
  };

  if (!user) {
    return null; // Or return a loading spinner
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleProfilePhotoPress}>
          <Image 
            style={styles.profileImage}
            // remove the source prop to display placeholder
          />
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
      <View>
        <Text style={styles.sectionTitle}>{item.title}</Text>
        <Text style={styles.sectionText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  )}
  numColumns={1}
/>

          </View>
          );
          };

export default Profile;

