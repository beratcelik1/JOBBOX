// chatroom.js
import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ChatRoom = ({ currentChatId }) => {
  const [conversations, setConversations] = useState([]);
  // const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState({});

  const currentChat = currentChatId;
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
        if (currentChat) {
            try {
                const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/messages/" + currentChat._id);
                const formattedMessages = res.data.map((message) => ({
                    _id: message._id,
                    text: message.text,
                    createdAt: new Date(message.createdAt),
                    user: {
                        _id: message.sender,
                        // name: message.sender,
                        // avatar: 'https://placeimg.com/140/140/any',
                    },
                })).reverse();;
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

    // const receiverId = currentChat.members.find(
    //   (member) => member !== user._id
    // );
    console.log("user id:",user._id);
    console.log("chat id:",currentChat.members);
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
      setMessages([formattedMessage, ...messages]);
    } catch (err) {
      console.log(err);
    }
  };
  //   try {
  //     const res = await axios.post("https://tranquil-ocean-74659.herokuapp.com/messages/", message);
  //     setMessages([...messages, res.data]);
  //     // setNewMessage("");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <GiftedChat
      messages={messages}
      // onSend={e => handleSend(e)}
      onSend={messages => handleSend(messages)}
      // user={{ _id: user._id, name: `${user.firstname} ${user.lastname}` }}
      user={{ _id: user._id }}
    />
  );
};

export default ChatRoom;


// try {
    //   const res = await axios.post("https://tranquil-ocean-74659.herokuapp.com/messages/", message);
    //   const formattedMessage = {
    //     _id: res.data._id,
    //     text: res.data.text,
    //     createdAt: new Date(res.data.createdAt),
    //     user: {
    //       _id: res.data.sender,
    //     },
    //   };
    //   setMessages((previousMessages) => GiftedChat.append(previousMessages, formattedMessage));
    // } catch (err) {
    //   console.log(err);
    // }