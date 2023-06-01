import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button } from 'react-native';
import SearchBar from '../../components/SearchBar';
import { CATEGORIES } from './constants';

const FindTemplateScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [flatListData, setFlatListData] = useState([]);
  const [templates, setTemplates] = useState([
    {
      id: '1',
      title: 'Cook food',
      description: 'Cook food for 2 people',
      category: CATEGORIES[0],
      skills: 'Cooking',
    },
    {
      id: '2',
      title: 'Help move',
      description: 'Help move furniture',
      category: CATEGORIES[1],
      skills: 'Lifting heavy objects',
    },
    {
      id: '3',
      title: 'Cleaning',
      description: 'Clean the house',
      category: CATEGORIES[2],
      skills: 'Cleaning',
    },
    // add as many templates as you want
  ]);

  useEffect(() => {
    // fetch templates from your server
  }, []);

  useEffect(() => {
    // filter templates based on search query
    setFlatListData(
      templates.filter((template) =>
        template.title.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  const handleUseTemplatePress = (template) => {
    navigation.navigate('PostJob', { template: template });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder={'Look for a template..'}
        search={search}
        setSearchQuery={setSearch}
      />
      <FlatList
        data={flatListData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription}>{item.description}</Text>
            <Text style={styles.jobDate}>{item.datePosted}</Text>
            <Button
              style={styles.button}
              onPress={() => handleUseTemplatePress(item)}
              title="Use template"
            />
          </View>
        )}
      />

      <View style={styles.customJobContainer}>
        <Text style={styles.customJobText}>
          Can't find what you're looking for?{' '}
          <Text
            style={styles.customJobButton}
            onPress={() => navigation.navigate('PostJob')}
          >
            Create a custom job
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 10,
    // Android shadow properties
    elevation: 5,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: {
      width: -10,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  jobDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
  },
  customJobContainer: {
    paddingHorizontal: 50,
  },
  customJobText: {
    textAlign: 'center',
    paddingTop: 8,
    fontSize: 16,
    color: '#666',
  },
  customJobButton: {
    color: '#4683fc',
  },
});

export default FindTemplateScreen;
