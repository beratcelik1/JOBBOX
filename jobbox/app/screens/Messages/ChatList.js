import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function ChatList({ navigateToChat }) {
  const [users, setUsers] = useState([]);
  // const currentUserID = "YOUR_CURRENT_USER_ID"; // replace with actual value
  const [user, setUser] = useState({});

  // Fetch the current user's information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log("Response data: ", response.data); // log the response data
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
      } }
      fetchUserData();
  });

  useEffect(() => {
    fetch('http://tranquil-ocean-74659.herokuapp.com/auth/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(users => setUsers(users))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleChatNavigation = async (receiverId) => {
    let conversation = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/conversations/find/${user._id}/${receiverId}`);

    if (!conversation.data) {
      conversation = await axios.post(`http://tranquil-ocean-74659.herokuapp.com/conversations`, {
        senderId: user._id,
        receiverId: receiverId
      });
    }

    navigateToChat(conversation.data);
  };

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatNavigation(item._id)}>
            <Text style={styles.item}>{item.firstname}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default ChatList;
