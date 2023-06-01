import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem'; // make sure the import path is correct
import Icon from 'react-native-vector-icons/MaterialIcons';



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
        width: -10,
        height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
  },
});

const categories = [
  { id: '1', title: 'Web Development', iconName: 'web' },
  { id: '2', title: 'Graphic Design', iconName: 'palette' },
  { id: '3', title: 'Content Writing', iconName: 'create' },
  { id: '4', title: 'Marketing', iconName: 'campaign' },
  { id: '5', title: 'Mobile App Development', iconName: 'mobile-friendly' },
  { id: '6', title: 'Home Cleaning', iconName: 'cleaning-services' },
  { id: '7', title: 'Gardening', iconName: 'grass' },
  { id: '8', title: 'Dog Walking', iconName: 'pets' },
  { id: '9', title: 'Grocery Delivery', iconName: 'local-grocery-store' },
  { id: '10', title: 'Moving', iconName: 'local-shipping' },
  // add more categories as needed
];

export default function Services({ navigation }) {
  const predefinedCategories = [
    { id: '1', title: 'Web Development', iconName: 'web' },
    { id: '2', title: 'Graphic Design', iconName: 'palette' },
    { id: '3', title: 'Content Writing', iconName: 'create' },
    { id: '4', title: 'Marketing', iconName: 'campaign' },
    { id: '5', title: 'Mobile App Development', iconName: 'mobile-friendly' },
    { id: '6', title: 'Home Cleaning', iconName: 'cleaning-services' },
    { id: '7', title: 'Gardening', iconName: 'grass' },
    { id: '8', title: 'Dog Walking', iconName: 'pets' },
    { id: '9', title: 'Grocery Delivery', iconName: 'local-grocery-store' },
    { id: '10', title: 'Moving', iconName: 'local-shipping' },
    // add more categories as needed
  ];
  const [categoriesWithJobs, setCategoriesWithJobs] = useState([]); 

  useEffect(() => {
    fetch(`https://tranquil-ocean-74659.herokuapp.com/jobs`)
    .then(response => response.json())
    .then(data => {
      const uniqueCategories = [...new Set(data.map(job => job.category))];
      setCategoriesWithJobs(uniqueCategories);
    })
    .catch(error => console.error('Error:', error));
  }, []);
  
  return (
    <View style={styles.container}>
    <FlatList 
        data={predefinedCategories}
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
