import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const renderWorkHistoryItem = ({ item }) => {
  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View
          style={[
            styles.jobStatusContainer,
            item.status === 'applied' && { backgroundColor: '#5ec949' },
            item.status === 'in progress' && { backgroundColor: '#fff' },
            item.status === 'completed' && { backgroundColor: '#c7c7c7' },
          ]}
        >
          <Text style={{ ...styles.jobStatus, color: '#4683fc' }}>
            {item.status}
          </Text>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: '#c7c7c7',
          borderBottomWidth: 1.5,
          marginBottom: 10,
          marginTop: 5,
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginLeft: 5,
        }}
      >
        <View style={{ width: '60%' }}>
          <View style={styles.jobDetails}>
            {/* <Text style={styles.jobDescriptionH}>Employee: {item.hiredApplicant.firstname} {item.hiredApplicant.lastname}</Text> */}
          </View>
          <View style={styles.jobDetails}>
            <Text style={styles.jobDescriptionH}>
              Category: {item.category}
            </Text>
          </View>
        </View>

        <View style={{ width: '40%' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginBottom: 5,
            }}
          >
            <Ionicons name="md-cash" size={20} color="#4683fc" />
            <Text style={styles.jobDescriptionH}> {item.pay} $ </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Ionicons name="md-time" size={20} color="#4683fc" />
            <Text style={styles.jobDescriptionH}> {item.estimatedTime}</Text>
            <Text style={styles.jobDescriptionH}>
              {' '}
              {item.estimatedTimeUnit}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const WorkHistoryScreen = () => {
  const [workHistory, setWorkHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHiredJobs = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(
          `http://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/hiredJobs/completed`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.length > 0) {
          const sortedJobs = response.data.sort(
            (a, b) => new Date(b.endDateTime) - new Date(a.endDateTime)
          );
          setWorkHistory(sortedJobs);
        } else {
          setWorkHistory([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchHiredJobs();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work History</Text>
          <FlatList
            data={workHistory}
            keyExtractor={(item) => item._id}
            renderItem={renderWorkHistoryItem}
            style={{ paddingVertical: 5 }}
          />
        </View>
      )}
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
    marginHorizontal: 5,
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
    shadowColor: '#000',
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
  jobTitle: {
    fontSize: 18,
    marginHorizontal: 5,
  },
  jobStatusContainer: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  jobStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});
