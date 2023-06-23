import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlainCard = ({ content }) => {
  return (
    <View style={styles.cardContainer}> 
      <Text>{content}</Text>
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
});

export default PlainCard;
