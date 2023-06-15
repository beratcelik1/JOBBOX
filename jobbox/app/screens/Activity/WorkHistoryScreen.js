import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

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

const workHistory = [ /*...your work history data...*/ 
{ id: '1', title: 'Work 1', earnings: '$100', date: 'May 1, 2023' },
  { id: '2', title: 'Work 2', earnings: '$150', date: 'May 3, 2023' },
  { id: '3', title: 'Work 3', earnings: '$120', date: 'May 5, 2023' },
];

const renderWorkHistoryItem = ({ item }) => (
  /*...your item rendering...*/
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

const WorkHistoryScreen = () => {
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