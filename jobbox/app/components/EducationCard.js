import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EducationCard = ({ university, degree, major, date }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.universityText}>{university}</Text>
      <Text style={styles.degreeText}>{degree} {major}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  universityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  degreeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  majorText: {
    fontSize: 16,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: 'gray',
  },
});

export default EducationCard;
