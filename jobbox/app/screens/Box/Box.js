import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Box = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userId = await AsyncStorage.getItem('userId');
                console.log('userId:', userId);
                if (!userId) {
                  console.log('User ID not found in storage');
                  return; // or handle this situation some other way
              }
                // Use userId here instead of user._id
                const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/inprogress`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setJobs(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.status}</Text>
      {/* Display other job information here */}
    </View>
  );

  return (
    <View>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Box;
