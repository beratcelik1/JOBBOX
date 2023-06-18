import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AccountSecurityScreen = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="package-variant-closed" size={100} color="gray" />
      <Text style={styles.text}>Account Security</Text>
      <Text style={styles.subtext}>This section is under construction.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#888',
  },
});

export default AccountSecurityScreen;
