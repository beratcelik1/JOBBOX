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

const inboxData = [
  { id: '1', sender: 'User1', latestMessage: 'Hello, this is User1.', time: '10:45 PM' },
  { id: '2', sender: 'User2', latestMessage: 'Hello, this is User2. Nice to meet you!', time: '09:30 AM' },
  // More data...
];

const InboxItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.message} onPress={onPress}>
    <Text style={styles.sender}>{item.sender}</Text>
    <Text style={styles.content}>{item.latestMessage}</Text>
    <Text style={styles.time}>{item.time}</Text>
  </TouchableOpacity>
);

const InboxScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={inboxData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <InboxItem item={item} onPress={() => navigation.navigate('Chat', { sender: item.sender })} />}
      />
    </View>
  );
};

export default InboxScreen;


/*import React from 'react';
import { View, Text, Button  } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Messages() {
    const navigation = useNavigation();
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <View>
            <Text>Messages Screen</Text>
        </View>
      </View>
    );
}
*/