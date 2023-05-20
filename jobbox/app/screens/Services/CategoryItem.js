import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    padding: 20,
    borderRadius: 10,
    height: 150, // adjust the height as per your requirement
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
  icon: {
    marginBottom: 10,
  },
});


import { Ionicons } from '@expo/vector-icons'; // make sure to install this package

export default function CategoryItem({ title, onPress, iconName }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Ionicons style={styles.icon} name={iconName} size={24} color="black" />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

