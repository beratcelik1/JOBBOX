import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View } from 'react-native';

function ChatList({ navigateToChat }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://tranquil-ocean-74659.herokuapp.com/auth/users')
      .then(response => {
        if (!response.ok) {
          // console.log(response);
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(users => {
        // console.log(users); 
        setUsers(users);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item, index) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToChat(item._id)}>
            <Text style={styles.item}>{item.firstname}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default ChatList;
