
import { View, Text, StyleSheet, FlatList, TextInput, Button, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useContext } from "react";
import { ConversationContext } from '../ConversationContext';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 15,
      },
      messageBox: {
        maxWidth: '75%',
        margin: 10, 
        padding: 10,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#ccc',
        alignSelf: 'flex-start', // Default to left-align (the other user's messages)
      },
      messageBoxSelf: {
        maxWidth: '75%',
        margin: 10, 
        padding: 10,
        borderRadius: 15,
        borderWidth: 0.5,
        borderColor: '#ccc',
        alignSelf: 'flex-end', // Right-align for your own messages      
        backgroundColor: '#4683fc',
      },
      sender: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      content: {
        fontSize: 14,
        color: 'black', // Set the text color of the sender's messages to black
      },
      contentSelf: {
        fontSize: 14,
        color: 'white', // Set the text color of your messages to white
      },

      time: {
        fontSize: 12,
        color: 'black',
        alignSelf: 'flex-end',
        marginTop: 5,
      },
      typingBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end', // Align items to the bottom
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderTopColor: '#ccc',
        borderTopWidth: 1,
      },
      input: {
        flex: 1,
        minHeight: 10, // Minimum height
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginRight: 10,
        borderColor: '#ddd',
        borderWidth: 1,
      },
      sendButton: {
        width: 50,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#4683fc',
      },
      sendButtonText: {
        color: '#fff',
      },
});

const TypingBar = ({ newMessage, setNewMessage, handleSendMessage }) => {
  return (
    <View style={styles.typingBarContainer}>
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="Type a message..."
        multiline={true}
        numberOfLines={4} // Change this number to control the maximum expansion
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const ChatScreen = ({ route, navigation }) => {
  const currentUser = {
    id: '456', // Some unique identifier
    name: 'You', // Your name or identifier
    avatar: 'https://example.com/path-to-your-avatar-image.jpg'
  };
  const { senderId } = route.params;
  if (!senderId) {
    console.error('No senderId provided');
    return null;
  }
  const [conversationsData, setConversationsData] = useContext(ConversationContext);
  
  const conversation = conversationsData[senderId]; // if conversationsData is an object
  if (!conversation) {
    console.error('No conversation found for this senderId');
    return null;
  }

  const user = conversation; // Now 'user' is an object containing user data

  

  useEffect(() => {
    navigation.setOptions({
      title: conversation.sender.name, // Display the user's name in the header
      headerStyle: {
        backgroundColor: '#f8f8f8',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [conversation]);


  const [newMessage, setNewMessage] = React.useState('');
  const [messages, setMessages] = React.useState(conversation.messages); // Add this line


  const handleSendMessage = () => {
    // Handle sending the message here
    if (!newMessage) return;

  const newMessageObject = {
    id: Math.random().toString(), // Simple id generation, you may want to use something more sophisticated
    sender: currentUser.name,
    message: newMessage,
    time: new Date().toLocaleTimeString(), // Current time
  };

   // Adding the new message to the conversation
   setMessages((prevMessages) => [...prevMessages, newMessageObject]);
  
   // Adding the new message to the overall conversation data as well
   conversationsData[senderId].messages.push(newMessageObject);
 
   setNewMessage(''); // Clear the input field
  };

  
 


return (
  <View style={styles.container}>
    <FlatList
  data={messages}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={item.sender === currentUser.name ? styles.messageBoxSelf : styles.messageBox}>
      <Text style={item.sender === currentUser.name ? styles.contentSelf : styles.content}>
        {item.message}
      </Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  )}
/>
    <TypingBar
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
    />
  </View>
);
  

};

export default ChatScreen;
