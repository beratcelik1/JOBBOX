import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatRoom = ({ currentChatId }) => {
  const [conversations, setConversations] = useState([]);
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

  // get conversations for current user
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/conversations/" + user._id);
        console.log(res);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);


  
  // // Fetch existing messages
  // useEffect(() => {
  //   fetch(`http://tranquil-ocean-74659.herokuapp.com/auth/messages/${currentChatId}`)
  //     .then(response => response.json())
  //     .then(fetchedMessages => setMessages(fetchedMessages))
  //     .catch(error => console.error('Error:', error));
  // }, [currentChatId]);

  // function handleSend(newMessage = []) {
  //   fetch(`http://tranquil-ocean-74659.herokuapp.com/auth/message`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       senderId: user._id,
  //       receiverId: currentChatId,
  //       content: newMessage[0].text,
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(message => setMessages(GiftedChat.append(messages, message)))
  //     .catch(error => console.error('Error:', error));
  // }

  return (
    <GiftedChat
      messages={[]}
      // onSend={newMessage => handleSend(newMessage)}
      user={{ _id: user._id, name: `${user.firstname} ${user.lastname}` }}
    />
  );
};

export default ChatRoom;


// useEffect(() => {
//   const getConversations = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userResponse = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUser(userResponse.data);

//       const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/conversations/" + userResponse.data._id);
//       console.log(res);
//       setConversations(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   getConversations();
// }, []);