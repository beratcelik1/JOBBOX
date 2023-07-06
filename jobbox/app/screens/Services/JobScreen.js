import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30, 
  },
  jobCard2: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12.84,
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

  button2: { 
    backgroundColor: '#4683fc',
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    alignItems: 'center', 
  },
  buttonText2: {
    fontSize: 16,
    color: '#fff', 
    fontWeight: '600',
    
  },

 
});

export default function JobScreen({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.jobCard2}> 
        <View style={styles.jobHeader}>  
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                <Text style={styles.jobTitle2}>{job.postedBy?.firstname} {job.postedBy?.lastname} - 4.3 </Text>
                <Ionicons name="star" size={13} color="#4683fc" /> 
            </View>
        </View>     
        <View
            style={{
            borderBottomColor: '#4683fc',
            borderBottomWidth: 1.5,
            marginBottom: 10,
            }}/> 
        
            
        <View style={styles.jobDetails}> 
            <View style={styles.jobDetails}>
                <Ionicons name="md-grid" size={20} color="#4683fc" /> 
                <Text style={{color: '#4683fc', fontWeight: '700'}}>  Category: </Text> 
            </View>
            <Text style={styles.jobDescription}>{job.category}</Text>
        </View>

        <View style={styles.jobDetails}> 
            <View style={styles.jobDetails}>
                <Ionicons name="ios-location-sharp" size={20} color="#4683fc" /> 
                <Text style={{color: '#4683fc', fontWeight: '700'}}>  Location: </Text>
            </View>
            <Text style={styles.jobDescription}>{job.location}</Text>
        </View>

        <View style={styles.jobDetails}>  
            <View style={styles.jobDetails}>
                <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                <Text style={{color: '#4683fc', fontWeight: '700'}}>  Pay: </Text>
            </View>
            <Text style={styles.jobDescription}>{job.pay} CAD</Text>
        </View> 

        <View style={styles.jobDetails}> 
            <View style={styles.jobDetails}>
                <Ionicons name="md-time" size={20} color="#4683fc" /> 
                <Text style={{color: '#4683fc', fontWeight: '700'}}>  Time: </Text>
            </View>
            <Text style={styles.jobDescription}>{job.estimatedTime}  {job.estimatedTimeUnit}</Text>
        </View> 
        <View
            style={{
            borderBottomColor: '#4683fc',
            borderBottomWidth: 1.5,
            marginBottom: 7,
            }}/>
            
        <View style = {{alignItems: 'center'}}> 
            <Text style={{color: '#4683fc', fontWeight: '700', marginBottom: 5}}>Skills </Text>
            <Text style={styles.description}> 
              {Array.isArray(job.skills) && job.skills.length > 0 
                ? job.skills.join(', ') 
                : "No skills listed"} 
            </Text>

            <Text style={{color: '#4683fc', fontWeight: '700', marginBottom: 5, marginTop: 15}}>Description</Text>
            <Text style={styles.jobDescription}>{job.description}</Text>
        </View> 

        <TouchableOpacity 
            style={styles.button2}
            // onPress={() => handleJobPress(job)}  
        > 
            <Text style={styles.buttonText2}> Apply For Job </Text>
        </TouchableOpacity>
      </View>
    </View>
);
}
