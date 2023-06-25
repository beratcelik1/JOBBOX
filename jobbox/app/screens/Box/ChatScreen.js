import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import axios from 'axios';
import { View, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({ route }) => {
  const { jobId, senderId, conversationId, receiverId } = route.params;
// take conversationId from params
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

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

  const getMessages = useCallback(async () => {
    try {
      const res = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/messages/${conversationId}`); // use conversationId here
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
      console.error(err);
    }
  }, [conversationId]); // dependency on conversationId

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 3000); // Fetches every 3 seconds

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [getMessages]);

  const handleSend = async (messagesArray) => {
    const newMessage = messagesArray[0].text;
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: conversationId,
    };
  
    try {
      const res = await axios.post('https://tranquil-ocean-74659.herokuapp.com/messages', message);
      const formattedMessage = {
        _id: res.data._id,
        text: res.data.text,
        createdAt: new Date(res.data.createdAt),
        user: {
          _id: res.data.sender,
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessage));

      // Create a notification
      const notification = {
        to: receiverId, 
        from: user._id,
        action: 'message',
        conversationId: conversationId,
        jobId: jobId,
      };
      await axios.post('https://tranquil-ocean-74659.herokuapp.com/auth/notifications', notification);
  
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; 
  }

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 0,
          borderRadius: 35,  
          marginHorizontal: 10,  
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {width: 0,height: 2,},
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
        textInputStyle={{
          paddingTop: 7, 
          marginTop:8,
          paddingBottom: 7,
          paddingLeft: 8,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
    <GiftedChat
      messages={messages}
      onSend={messages => handleSend(messages)}
      user={{ _id: user._id }}
      renderAvatar={null}
      renderInputToolbar={props => renderInputToolbar(props)}
      renderBubble={props => {
        return (
          <Bubble
            {...props}
            textStyle={{
              left: {
                color: 'black', 
              },
            }}
            timeTextStyle={{
              left: {
                color: 'black', 
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: 'white',
                borderColor: '#F9F7F6',
                borderWidth: 0,
              },
            }}
          />
        );
      }}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
});

export default ChatScreen;

