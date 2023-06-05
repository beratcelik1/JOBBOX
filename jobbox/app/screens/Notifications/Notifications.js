import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function Notifications() {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // fetch all users names
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://tranquil-ocean-74659.herokuapp.com/auth/users/");
        const usersById = {};
        response.data.forEach(user => {
          usersById[user._id] = user;
        });
        setUsers(usersById);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch the current user's information
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user data: ", err);
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/auth/notifications/${user._id}`); 
        // console.log(response.data);
        // console.log(user._id);
        setNotifications(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    // Only call fetchNotifications if user._id exists (i.e., if the user data has been fetched)
    if (user._id) {
      fetchNotifications();
      intervalId = setInterval(fetchNotifications, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [user]);

  const deleteNotification = async (id) => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.delete(`https://tranquil-ocean-74659.herokuapp.com/auth/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((item) => item._id !== id)); // remove the deleted notification from the local state
    } catch (err) {
      console.error(err);
    }
  };

  const renderHiddenItem = (data, rowMap) => (
    <TouchableOpacity
      style={[styles.rowBack, styles.rowBackRight]}
      onPress={() => deleteNotification(data.item._id)}
    >
      <Text style={styles.backTextWhite}>Clear</Text>
    </TouchableOpacity>
  );


  const NotificationCard = ({ item }) => {
    const fromUser = users[item.from];
  
    // format the message based on the action type
    const message = item.action === 'message'
      ? `${fromUser ? fromUser.firstname : 'Unknown'} messaged you`
      : `${fromUser ? fromUser.firstname : 'Unknown'} applied to your job`
  
    // format the timestamp to show time in hours
    const date = new Date(item.createdAt);
    let hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const timeIn12Hours = `${hours}:${minutes} ${ampm}`;

    return (
      <View style={styles.notificationCard}>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>{message}</Text>
          <Text style={styles.timeText}>{timeIn12Hours}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={NotificationCard}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10, // adjust this value as per your needs
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 0,
    elevation: 1, // for android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    padding: 13,
  },
  notificationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notificationText: {
    fontSize: 17,
    color: 'black',
  },
  timeText: {
    fontSize: 15,
    color: 'grey',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  rowBackRight: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 15,
  },
  backTextWhite: {
    paddingRight: 15,
    paddingBottom: 7,
    color: 'red',
  },
});