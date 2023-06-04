import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatRoom = ({ currentChatId }) => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});

  // setCurrentChat(currentChatId);
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
        // console.log(res);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      if(currentChat){
        try {
          const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/messages/" + currentChat._id);
      // try {
      //   const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/messages/" + currentChat?._id);
        // console.log(res);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log('no chat info')
    }
    };
    getMessages();
  }, [currentChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // const receiverId = currentChat.members.find(
    //   (member) => member !== user._id
    // );

    try {
      const res = await axios.post("https://tranquil-ocean-74659.herokuapp.com/messages/", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <GiftedChat
      messages={[]}
      onSend={e => handleSend(e)}
      user={{ _id: user._id, name: `${user.firstname} ${user.lastname}` }}
    />
  );
};

export default ChatRoom;