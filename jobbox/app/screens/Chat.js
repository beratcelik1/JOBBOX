import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';

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
      },
      sender: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      content: {
        fontSize: 14,
      },

      time: {
        fontSize: 12,
        color: 'gray',
        alignSelf: 'flex-end',
        marginTop: 5,
      },
      messageInput: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
      },
      sendButton: {
        backgroundColor: '#4B9CD3',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
      },
      sendButtonText: {
        color: '#fff',
        fontSize: 16,
      },
});

const ChatScreen = ({ route, navigation }) => {
  const { sender } = route.params;
  const user = route.params.user;

  // Fetch conversation data here, possibly using `sender` to identify the conversation
  const conversationData = [
    { id: '1', sender: 'User1', message: 'Hello, this is User1.', time: '10:45 PM' },
    { id: '2', sender: 'User2', message: 'Hello, this is User2. Nice to meet you!', time: '09:30 AM' },
    // More data...
  ];

  /*useEffect(() => {
    navigation.setOptions({
      title: user.name, // Display the user's name in the header
      headerStyle: {
        backgroundColor: '#f8f8f8',
      },
      headerTintColor: '#333',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, []);*/

  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    // Handle sending the message here
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversationData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <View style={styles.messageBox}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.content}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        style={styles.input}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

export default ChatScreen;
