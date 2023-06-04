import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
  },
});

export default function JobScreen({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.label}>Created by:</Text>
        <Text style={styles.value}>{job.creator}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Rating:</Text>
          <View style={styles.row}>
            <Ionicons name="star" size={24} color={job.rating >= 1 ? 'gold' : 'gray'} />
            <Ionicons name="star" size={24} color={job.rating >= 2 ? 'gold' : 'gray'} />
            <Ionicons name="star" size={24} color={job.rating >= 3 ? 'gold' : 'gray'} />
            <Ionicons name="star" size={24} color={job.rating >= 4 ? 'gold' : 'gray'} />
            <Ionicons name="star" size={24} color={job.rating >= 5 ? 'gold' : 'gray'} />
          </View>
        </View>
        <Text style={styles.label}>Descriptionnnn:</Text>
        <Text style={styles.value}>{job.description}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{job.location}</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.label}>Pay:</Text>
        <Text style={styles.value}>{job.pay}</Text>
        </View>
        </View>
        </View>
);
}
