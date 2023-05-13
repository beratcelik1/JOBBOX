import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  jobCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
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
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobCreator: {
    color: 'gray',
    fontSize: 14,
  },
  jobDescription: {
    color: 'gray',
    fontSize: 14,
  },
  jobLocation: {
    color: 'gray',
    fontSize: 14,
  },
  jobPay: {
    color: 'gray',
    fontSize: 14,
  },
});

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchedJobs = [
      { 
        id: '1', 
        title: 'Job 1 in '+category, 
        creator: 'John Doe', 
        rating: 5, 
        description: 'Description of the job', 
        location: 'Kelowna, BC', 
        pay: '$120'
      },
      { 
        id: '2', 
        title: 'Job 2 in '+category, 
        creator: 'Jane Doe', 
        rating: 4.5, 
        description: 'Description of the job', 
        location: 'Kelowna, BC', 
        pay: '$25'
      },
      // add more jobs as needed
    ];
    setJobs(fetchedJobs);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: category,
      headerStyle: {
        backgroundColor: '#fff', // or any color of your choice
      },
      headerTintColor: '#4683fc', // color of header text and icons
      headerTitleStyle: {
        fontWeight: 'bold', // set the header text to bold
      },
    });
  }, [navigation, category]);

  const handleJobPress = (job) => {
    navigation.navigate('Job', { job: job });
  }

  return (
    <View>
      <FlatList 
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJobPress(item)}>
            <View style={styles.jobCard}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobCreator}>Creator: {item.creator}</Text>
              <Text style={styles.jobDescription}>Description: {item.description}</Text>
              <Text style={styles.jobLocation}>Location: {item.location}</Text>
              <Text style={styles.jobPay}>Pay: {item.pay}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Ionicons name="star" size={14} color="gold" />
                <Text style={styles.jobCreator}> {item.rating} / 5</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

