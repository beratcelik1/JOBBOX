import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet  } from 'react-native';
import axios from 'axios';

export default function Notifications() {
  const [user, setUser] = useState({});
  const [notifications, setNotifications] = useState([]);

  // Fetch the current user's information
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
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/auth/notifications/${user._id}`); // Replace with your API route
        setNotifications(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotifications();
  }, []);

  const NotificationCard = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text>From: {item.from}</Text>
      <Text>Action: {item.action}</Text>
      <Text>Timestamp: {item.createdAt}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Notifications Screen</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={NotificationCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  notificationCard: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9'
  },
});
