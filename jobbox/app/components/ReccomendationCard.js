import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RecommendationCard = ({ name, relationship, recommendation }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.nameText}>{name}</Text>
      <Text style={styles.relationshipText}>{relationship}</Text>
      <View style={styles.separator} />
      <Text style={styles.recommendationText}>{recommendation}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 3.62,
    elevation: 4, 
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  relationshipText: {
    fontSize: 16,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 8,
  },
  recommendationText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default RecommendationCard;
