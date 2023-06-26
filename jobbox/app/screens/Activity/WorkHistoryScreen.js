import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const renderWorkHistoryItem = ({ item }) => {
  // console.log(item);
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>Earned:</Text>
        <Text>${item.pay}</Text> 
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardLabel}>Date:</Text>
        <Text>{new Date(item.endDateTime).toLocaleDateString().toString()}</Text>
      </View>
    </View>
  );
};

const WorkHistoryScreen = () => {
  const [workHistory, setWorkHistory] = useState([]);

  useEffect(() => {
    const fetchHiredJobs = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        
        const response = await axios.get(`http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/hiredJobs/completed`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setWorkHistory(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHiredJobs();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work History</Text>
        <FlatList
          data={workHistory}
          keyExtractor={item => item.id}
          renderItem={renderWorkHistoryItem}
          style = {{paddingVertical: 5}}
        />
      </View>
    </View>
  );
};

export default WorkHistoryScreen;

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