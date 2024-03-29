import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const JobExperienceCard = ({ position, company }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.positionText}>{position}</Text>
      <Text style={styles.companyText}>{company}</Text>
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
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyText: {
    fontSize: 16,
  },
});

export default JobExperienceCard;
