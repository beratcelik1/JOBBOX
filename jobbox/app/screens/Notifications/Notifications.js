import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Swipeable } from 'react-native-gesture-handler'; // import Swipeable

function NotificationCard({ item, users, onSwipe }) {
  const [jobTitle, setJobTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fromUser = users[item.from];
  const jobId = item.jobId;

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(token => {
        fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => response.json())
        .then(job => {
          setJobTitle(job.title);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      })
      .catch(err => console.log(err));
  }, [jobId]);

  // Don't render anything until the job title has loaded.
  if (isLoading) {
    return null;
  }

  // format the message based on the action type
  let message;
  switch (item.action) {
    case 'message':
      message = `${fromUser.firstname} messaged you`;
      break;
    case 'job_application':
      message = `${jobTitle}: you have a new application`;
      break;
    case 'hired':
      message = `${jobTitle}: you were hired ✅`;
      break;
    case 'rejected':
      message = `${jobTitle}: you were rejected ❌`;
      break;
    default:
      message = 'Unknown action';
  }

  // format the timestamp to show time in hours
  const date = new Date(item.createdAt);
  let hours = date.getHours();
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const timeIn12Hours = `${hours}:${minutes} ${ampm}`;

  const renderRightAction = () => {
    return (
      <TouchableOpacity
        style={styles.rowBackRight}
        onPress={onSwipe}
      >
        <Text style={styles.backTextWhite}>Clear</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightAction}>
      <View style={styles.notificationCard}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{message}</Text>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{timeIn12Hours}</Text>
      </View>
    </View>
    </Swipeable>
  );
};

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
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID not found in storage');
          return;
        }
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
    let intervalId = null;
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
      intervalId = setInterval(fetchNotifications, 600000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
  }, [user]);

  const deleteNotification = async (id) => {
    const token = await AsyncStorage.getItem('token');
    console.log("hi");
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

return (
  <View style={styles.container}>
    <FlatList
      data={notifications}
      keyExtractor={item => item._id}
      renderItem={({item}) => 
        <NotificationCard 
          item={item} 
          users={users} 
          onSwipe={() => deleteNotification(item._id)}
        />}
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
    marginBottom: 4,
    borderWidth: 0,
    elevation: 1, // for android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 4.22,
    padding: 13,
    marginTop: 10, 
    paddingBottom: 5,
  },
  notificationContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    paddingRight: 8,
    paddingBottom: 20,
  },
  backTextWhite: {
    paddingRight: 15,
    paddingBottom: 7,
    color: 'red',
  },
  messageRow: {
    flex: 1,
  },
  timeRow: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  notificationText: {
    fontSize: 17,
    color: 'black',
  },
  timeText: {
    fontSize: 13,
    color: 'grey',
  },
});