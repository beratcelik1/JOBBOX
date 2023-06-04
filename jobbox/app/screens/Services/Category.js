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
    <View style={{ flex: 1, marginTop: 10}}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Loading...</Text>
        </View>
      ) : jobs && jobs.length > 0 ? (
        <FlatList 
          data={jobs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => ( 

          <TouchableOpacity 
          style={styles.jobCard}
          onPress={() => handleJobPress(item)}
          > 
            <View style={styles.jobHeader}>  
              <Text style={styles.jobTitle}>{item.title}</Text>
              <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                  <Text style={styles.jobTitle2}>{item.postedBy?.firstname} {item.postedBy?.lastname} - 4.3 </Text>
                  <Ionicons name="star" size={13} color="#4683fc" /> 
              </View>
            </View> 

            <View
              style={{
              borderBottomColor: '#4683fc',
              borderBottomWidth: 1.5,
              marginBottom: 10,
            }}/>

            <View style = {{ flexDirection: 'row', justifyContent: 'flex-start',}}> 
              <View style = {{ width: '60%'}} > 
                  <View style={styles.jobDetails}>
                      <Text style={styles.jobDescription}>{item.category}</Text>
                  </View>
                  <View style={styles.jobDetails}>
                      <Text style={styles.jobDescription}>{item.location}</Text>
                  </View>
              </View> 

              <View style = {{ width: '40%'}}> 
                  <View style={styles.jobDetails}> 
                      <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                      <Text style={styles.jobDescription}>{item.pay} CAD</Text>
                  </View> 

                  <View style={styles.jobDetails}>
                      <Ionicons name="md-time" size={20} color="#4683fc" />
                      <Text style={styles.jobDescription}>  {item.estimatedTime}</Text>
                      <Text style={styles.jobDescription}>  {item.estimatedTimeUnit}</Text>
                  </View> 

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
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 15,
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  }, 
  jobHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, 
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobTitle2: {
    fontSize: 13,
  },
  jobDescription: {
    fontSize: 14,
    color: '#000',
  },
  jobDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
  },

});
