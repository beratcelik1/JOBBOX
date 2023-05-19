import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#dedcdc',
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
});

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

