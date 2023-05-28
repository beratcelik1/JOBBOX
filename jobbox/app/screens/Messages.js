import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  message: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 14,
    marginVertical: 5,
  },
  timestamp: {
    fontSize: 12,
    color: 'gray',
  },
});

const conversationsData = {
  '1': { 
    id: '1', 
    sender: 'John Doe', 
    avatar: 'https://example.com/path-to-john-doe-avatar-image.jpg', 
    messages: [
      { id: '1', message: 'Hello, this is John Doe.', time: '10:45 PM' },
      { id: '2', message: 'How are you?', time: '11:00 PM' },
      // More messages...
    ]
  },
  '2': { 
    id: '2', 
    sender: 'Jane Smith', 
    avatar: 'https://example.com/path-to-jane-doe-avatar-image.jpg', 
    messages: [
      { id: '1', message: 'Hello, this is Jane Doe.', time: '09:30 AM' },
      { id: '2', message: 'Nice to meet you!', time: '09:35 AM' },
      // More messages...
    ]
  },
  // More conversations...
};

const InboxItem = ({ conversation, onPress }) => {
  const latestMessage = conversation.messages[conversation.messages.length - 1];
  return (
    <TouchableOpacity style={styles.message} onPress={onPress}>
      <Text style={styles.sender}>{conversation.sender}</Text>
      <Text style={styles.content}>{latestMessage.message}</Text>
      <Text style={styles.time}>{latestMessage.time}</Text>
    </TouchableOpacity>
  );
};

const InboxScreen = ({ navigation }) => {
  const conversationsArray = Object.values(conversationsData);
  return (
    <View style={styles.container}>
      <FlatList
        data={conversationsArray}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <InboxItem conversation={item} onPress={() => navigation.navigate('Chat', { senderId: item.id })} />}
      />
    </View>
  );
};

export default InboxScreen;


