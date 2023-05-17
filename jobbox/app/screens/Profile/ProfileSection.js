import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  // Add more styles as needed
});

const ProfileSection = ({ route }) => {
  const { section } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      <Text style={styles.text}>{section.text}</Text>
    </View>
  );
};

export default ProfileSection;
