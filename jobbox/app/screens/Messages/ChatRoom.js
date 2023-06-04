import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text } from 'react-native';

const ChatRoom = ({ route, navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const currentChat = route.params.currentChatId;
  const { receiverName } = route.params;

  // Set the title to the other user's name
  useEffect(() => {
    navigation.setOptions({ title: receiverName });
  }, [receiverName]);

  // Fetch the current user's information
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  // Get conversations for current user
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user._id) {
      getConversations();
    }
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/messages/" + currentChat._id);
          const formattedMessages = res.data.map((message) => ({
            _id: message._id,
            text: message.text,
            createdAt: new Date(message.createdAt),
            user: {
              _id: message.sender,
            },
          })).reverse();
          setMessages(formattedMessages);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('no chat info')
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSend = async (messagesArray) => {
    // Extract text from the first message in the array
    const newMessage = messagesArray[0].text;
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    try {
      const res = await axios.post("https://tranquil-ocean-74659.herokuapp.com/messages/", message);
      const formattedMessage = {
        _id: res.data._id,
        text: res.data.text,
        createdAt: new Date(res.data.createdAt),
        user: {
          _id: res.data.sender,
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessage));
    } catch (err) {
      console.log(err);
    }
  };
  

  if (loading) {
    return <Text>Loading...</Text>; // replace with your actual loading component or spinner
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => handleSend(messages)}
      user={{ _id: user._id }}
      renderAvatar={null}
    />
  );
};

export default ChatRoom;