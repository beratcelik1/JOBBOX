import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BubbleTextList = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.bubble}>
          <Text style={styles.text}>{item.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bubble: {
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
  },
});

export default BubbleTextList;
