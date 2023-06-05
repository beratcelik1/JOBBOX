import React, { useState, useEffect, useCallback } from 'react'; // add useCallback
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text, StyleSheet, View, TextInput} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30, // adjust this value as per your needs
  },
});

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

  // Declare getMessages function using the useCallback hook
  const getMessages = useCallback(async () => {
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
  }, [currentChat]); // Make sure to include any dependencies used inside the function

  useEffect(() => {
    getMessages();
  }, [getMessages]); // Add getMessages as a dependency

  useEffect(() => {
    const interval = setInterval(() => {
      getMessages();
    }, 3000); // Fetches every 5 seconds
  
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [getMessages]); // Add getMessages as a dependency

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

      // Create a new notification
      const notification = {
        to: currentChat.members.find(member => member !== user._id), // the recipient will be the other member of the chat
        from: user._id,
        action: 'message',
        conversationId: currentChat._id,
      };
      await axios.post("https://tranquil-ocean-74659.herokuapp.com/notifications/", notification);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>; // replace with your actual loading component or spinner
  }

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          // borderTopColor: '#E8E8E8',
          borderTopWidth: 0,
          borderRadius: 35,  // Rounded edges
          marginHorizontal: 10,  // Increase width
          backgroundColor: 'white',
        }}
        textInputStyle={{
          paddingTop: 10, 
          paddingBottom: 10,
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
      renderBubble={props => { // add this prop
        return (
          <Bubble
            {...props}
            textStyle={{
              left: {
                color: 'black', // whatever color you want for the text
              },
            }}
            timeTextStyle={{
              left: {
                color: 'black', // this will set the color of the timestamp
              },
            }}
            wrapperStyle={{
              left: {
                backgroundColor: 'white', // a darker grey
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

export default ChatRoom;
