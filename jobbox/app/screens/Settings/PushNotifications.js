import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const PushNotificationsComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Enable Push Notifications</Text>
        <Switch
          trackColor={{  false: '#fff', true: '#4683fc' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      <Text style={styles.description}>
        Receive notifications for important updates and new features.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
});

export default PushNotificationsComponent;
