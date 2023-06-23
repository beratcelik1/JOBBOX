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
  },
});

export default PlainCard;
