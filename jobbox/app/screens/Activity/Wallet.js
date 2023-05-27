import React from 'react';

import { Button } from 'react-native';


import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 20,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
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
  button: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginLeft: 30,
    marginRight: 30,
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
  buttonText: {
    fontSize: 16,
  },
});

const Activity = () => {
  // Implement logic to calculate these values
  const totalEarnings = 0; // Calculate total earnings from workHistory
  const totalSpent = 0; // Calculate total spent from hireHistory
  const profitOrLoss = totalEarnings - totalSpent;
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet</Text>
        <Text>Total Earnings: {totalEarnings}</Text>
        <Text>Total Spent: {totalSpent}</Text>
        <Text>Profit/Loss: {profitOrLoss}</Text>
      </View>
      <View style={styles.section}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WorkHistoryScreen')}
        >
          <Text style={styles.buttonText}>Work History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HireHistoryScreen')}
        >
          <Text style={styles.buttonText}>Hire History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Activity;
/*
const workHistory = [
  { id: '1', title: 'Work 1', earnings: '$100', date: 'May 1, 2023' },
  { id: '2', title: 'Work 2', earnings: '$150', date: 'May 3, 2023' },
  { id: '3', title: 'Work 3', earnings: '$120', date: 'May 5, 2023' },
];

const hireHistory = [
  { id: '1', title: 'Hire 1', spent: '$200', date: 'May 2, 2023' },
  { id: '2', title: 'Hire 2', spent: '$180', date: 'May 4, 2023' },
  { id: '3', title: 'Hire 3', spent: '$220', date: 'May 6, 2023' },
];

const renderWorkHistoryItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Earnings:</Text>
      <Text>{item.earnings}</Text>
    </View>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Date:</Text>
      <Text>{item.date}</Text>
    </View>
  </View>
);

const renderHireHistoryItem = ({ item }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Spent:</Text>
      <Text>{item.spent}</Text>
    </View>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Date:</Text>
      <Text>{item.date}</Text>
    </View>
  </View>
);

const Activity = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work History</Text>
        <FlatList
          data={workHistory}
          keyExtractor={item => item.id}
          renderItem={renderWorkHistoryItem}
        />
      </View>
      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hire History</Text>
        <FlatList
          data={hireHistory}
          keyExtractor={item => item.id}
          renderItem={renderHireHistoryItem}
        />
      </View>
    </View>
  );
};

export default Activity;
*/
