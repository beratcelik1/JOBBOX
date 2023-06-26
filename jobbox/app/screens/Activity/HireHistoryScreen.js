import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

const renderHireHistoryItem = ({ item }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>Spent:</Text>
        <Text>${item.pay}</Text> 
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>Date:</Text>
        <Text>{new Date(item.endDateTime).toLocaleDateString().toString()}</Text>
      </View>
    </View>
  );
};

const HireHistoryScreen = () => {
  const [hireHistory, setHireHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/postedJobs/completed`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.length > 0) {
          const sortedJobs = response.data.sort((a, b) => new Date(b.endDateTime) - new Date(a.endDateTime));
          setHireHistory(sortedJobs);
        }
        else {
          setHireHistory([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hire History</Text>
        <FlatList
          data={hireHistory}
          keyExtractor={item => item._id}
          renderItem={renderHireHistoryItem}
          style = {{paddingVertical: 5}}
        />
        </View>
      )}
    </View>
  );
};

export default HireHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
    marginHorizontal:5,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: 'gray',
  },
});