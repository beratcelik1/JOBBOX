import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({
  placeholder,
  searchQuery,
  setSearchQuery,
  onSearch,
  showSearchButton,
}) => {
  return (
    <View style={styles.searchSection}>
      <Ionicons
        style={styles.searchIcon}
        name="ios-search"
        size={20}
        color="#000"
      />
      <TextInput
        style={styles.searchInput}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />
      {showSearchButton && (
        <TouchableOpacity onPress={onSearch} style={styles.searchButton}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingLeft: 10,
    marginBottom: 20,
  },
  searchIcon: {
    padding: 10,
    paddingLeft: 0
  },
  searchInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    borderRadius: 50,
    backgroundColor: '#fff',
    color: '#424242',
  },
  searchButton: {
    backgroundColor: '#4683fc',
    borderRadius: 50,
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SearchBar;
