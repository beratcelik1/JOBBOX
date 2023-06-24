import React from 'react';
import { ScrollView,View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SettingsPage = ({handleSignOut}) => {
  const navigation = useNavigation();

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAccountSecurity = () => {
    navigation.navigate('AccountSecurity');
  };

  const handleDeleteAccount = () => {
    navigation.navigate('DeleteAccount');
  };

  const handlePushNotifications = () => {
    navigation.navigate('PushNotifications');
  };

  const handleAppTheme = () => {
    navigation.navigate('AppTheme');
  };

  const handleFontSize = () => {
    navigation.navigate('FontSize');
  };

  const handleLayoutSettings = () => {
    navigation.navigate('LayoutSettings');
  };

  const handleFAQ = () => {
    navigation.navigate('FAQ');
  };

  const handleContactSupport = () => {
    navigation.navigate('ContactSupport');
  };

  const handleLogout = () => {
    // Implement your logout logic here
    console.log('User logged out');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
          <Text style={styles.optionText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleAccountSecurity}>
          <Text style={styles.optionText}>Account Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleDeleteAccount}>
          <Text style={styles.optionText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <TouchableOpacity style={styles.option} onPress={handlePushNotifications}>
          <Text style={styles.optionText}>Push Notifications</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <TouchableOpacity style={styles.option} onPress={handleAppTheme}>
          <Text style={styles.optionText}>App Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleFontSize}>
          <Text style={styles.optionText}>Font Options</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLayoutSettings}>
          <Text style={styles.optionText}>Layout Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Help and Support</Text>
        <TouchableOpacity style={styles.option} onPress={handleFAQ}>
          <Text style={styles.optionText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleContactSupport}>
          <Text style={styles.optionText}>Contact Support</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.option} onPress={handleSignOut}>
          <Text style={[styles.optionText, styles.logoutText]}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutText: {
    color: 'red',
  },
});

export default SettingsPage;
