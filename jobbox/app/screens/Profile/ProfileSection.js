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
  // Add more styles as needed
});

const ProfileSection = ({ route }) => {
  const { section } = route.params;

  // You would typically fetch the relevant data for the section from your API here.
  // For the sake of this example, let's just display the section title.
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      {/* Render the data for the section here */}
    </View>
  );
};

export default ProfileSection;
