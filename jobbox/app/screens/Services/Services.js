import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CATEGORIES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  categoryCard: {
    flex: 1,
    margin: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 150, // adjust the height as per your requirement
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default function Services({ navigation }) {
  const [categoriesWithJobs, setCategoriesWithJobs] = useState([]); 

  useEffect(() => {
    const fetchJobs = async () => {
      const token = await AsyncStorage.getItem('token'); // you need to import AsyncStorage
      console.log('Token: ', token); 

      fetch(`https://tranquil-ocean-74659.herokuapp.com/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
      .then(response => response.json())
      .then(data => {
        const uniqueCategories = [...new Set(data.map(job => job.category))];
        setCategoriesWithJobs(uniqueCategories);
      })
      .catch(error => console.error('Error:', error));
    }

    fetchJobs();
  }, []);
  
  return (
    <View style={styles.container}>
    <FlatList data={CATEGORIES}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Category', { category: item.title })}
        >
            <Icon name={item.iconName} size={24} color="#4683fc" />
            <Text style={styles.categoryText}>{item.title}</Text>
        </TouchableOpacity>
        )}
        numColumns={2}
    />
    </View>
  );
}
