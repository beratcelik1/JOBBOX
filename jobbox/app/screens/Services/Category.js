import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CategoryScreen({ route, navigation }) {
  const { category} = route.params;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true); // set loading state to true as fetching begins
        const response = await fetch(`https://tranquil-ocean-74659.herokuapp.com/jobs?category=${encodeURIComponent(category)}`);
        const data = await response.json();
        setJobs(data);
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false); // set loading state to false as fetching ends
      }
    };
    fetchJobs();
  }, [category]);


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
    <View style={{backgroundColor:'#fff', flex: 1}}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : jobs && jobs.length > 0 ? (
        <FlatList 
          data={jobs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleJobPress(item)}>
              <View style={styles.jobCard}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobCreator}>Creator: {item.jobCreator}</Text>
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
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#777', fontSize: 12, textAlign: 'center', fontWeight: '500' }}>
            There is not any jobs created in this category at this moment.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20, 
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
        width: -10,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
