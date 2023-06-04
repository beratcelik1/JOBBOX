import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from 'react-native-elements';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
  },
  card: {
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
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

function ChatList({ navigateToChat }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [user, setUser] = useState({});
  const [conversations, setConversations] = useState([]);

  // Fetch the current user's information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        
        // Get conversations for current user after fetching user data
        try {
          const res = await axios.get("https://tranquil-ocean-74659.herokuapp.com/conversations/" + response.data._id);
          setConversations(res.data);
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
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

  // Extract all conversation partner ids
  const conversationPartnerIds = conversations.map((conversation) => 
    conversation.members.find((memberId) => memberId !== user._id)
  );

  // get list of all users
  useEffect(() => {
    fetch('http://tranquil-ocean-74659.herokuapp.com/auth/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(users => {
        setUsers(users);
        setFilteredDataSource(users);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = users.filter(item => {
        const itemData = item.firstname.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setSearchResults(newData);
      setSearch(text);
    } else {
      setSearchResults([]);
      setSearch(text);
    }
  };

  const handleChatNavigation = async (receiverId) => {
    let conversation = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/conversations/find/${user._id}/${receiverId}`);

    if (!conversation.data) {
      conversation = await axios.post(`http://tranquil-ocean-74659.herokuapp.com/conversations`, {
        senderId: user._id,
        receiverId: receiverId
      });
    }

    navigateToChat(conversation.data);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        round
        searchIcon={{ size: 24 }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction('')}
        placeholder="Search..."
        value={search}
      />
      {search.length > 0 ?
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item._id)}>
              <Text style={styles.label}>{item.firstname}</Text>
            </TouchableOpacity>
          )}
        />
        :
        <FlatList
          data={filteredDataSource.filter(user => conversationPartnerIds.includes(user._id))}
          keyExtractor={(item, index) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item._id)}>
              <Text style={styles.label}>{item.firstname}</Text>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
}

export default ChatList;
