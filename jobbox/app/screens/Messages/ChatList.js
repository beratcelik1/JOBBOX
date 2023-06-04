import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, TouchableOpacity, View, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SearchBar } from 'react-native-elements';
import SearchBar from '../../components/SearchBar';

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
    // fontWeight: 'bold',
  },
  chatListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#d3d3d3',
  },
});

function ChatList({ navigateToChat, navigation }) {
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

  const handleChatNavigation = async (receiverId, receiverName) => {
    let conversation = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/conversations/find/${user._id}/${receiverId}`);

    if (!conversation.data) {
      conversation = await axios.post(`http://tranquil-ocean-74659.herokuapp.com/conversations`, {
        senderId: user._id,
        receiverId: receiverId
      });
    }

    navigation.navigate('ChatRoom', {currentChatId: conversation.data, receiverName: receiverName});
  };

  //   navigation.navigate('ChatRoom', { currentChatId: conversation.data });
  // };

  return (
    <View style={styles.container}>
      <SearchBar
  placeholder={'Search users...'}
  searchQuery={search}
  setSearchQuery={searchFilterFunction}
/>
      {search.length > 0 ?
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item._id)}>
              <View style={styles.chatListItem}>
                <Image 
                  source={{uri: item.profilePic ? item.profilePic : 'https://cdn-icons-png.flaticon.com/512/847/847969.png?w=826&t=st=1685898712~exp=1685899312~hmac=650bef1520ec4ea89beec54315f42f553b7a246868819cb05c873088997dc5e0'}} 
                  style={styles.profileImage} 
                />
                <Text style={styles.label}>{item.firstname}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        :
        <FlatList
          data={filteredDataSource.filter(user => conversationPartnerIds.includes(user._id))}
          keyExtractor={(item, index) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleChatNavigation(item._id, item.firstname)}>
              <View style={styles.chatListItem}>
                <Image 
                  source={{uri: item.profilePic ? item.profilePic : 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}} 
                  style={styles.profileImage} 
                />
                <Text style={styles.label}>{item.firstname}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
}

export default ChatList;
