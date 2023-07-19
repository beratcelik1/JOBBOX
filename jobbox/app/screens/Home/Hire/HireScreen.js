import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../../components/SearchBar';
import { formatDateTime } from '../../../utils/formatDateTime';

import styles from './styles';
import JobService from '../../../services/JobService';

function HireScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [archivedJobs, setArchivedJobs] = useState([]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedJobs = await JobService.fetchJobs();
      setJobs(fetchedJobs.activeJobs);
      setAllJobs(fetchedJobs.activeJobs);
      setArchivedJobs(fetchedJobs.archivedJobs);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs(); // Call the function here
      return () => {}; // Return a cleanup function
    }, [])
  );

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery) {
      // if searchQuery is empty, show all jobs
      setJobs(allJobs);
    } else {
      const filteredJobs = allJobs.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()));

      setJobs(filteredJobs);
    }
  };

  const handleJobPress = (job) => {
    console.log(job);
    navigation.navigate('HireApplicationsScreen', { job: job });
  };

  const renderJob = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
        </View>
        <View
          style={{
            borderBottomColor: '#fff',
            borderBottomWidth: 1.5,
            marginBottom: 10,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          <View style={{ width: '60%' }}>
            <View style={styles.jobDetails}>
              <Text style={styles.jobDescription}>{item.category}</Text>
            </View>
            <View style={styles.jobDetails}>
              <Text style={styles.jobDescription}>{item.location}</Text>
            </View>
          </View>

          <View style={{ width: '40%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5 }}>
              <Ionicons name="md-cash" size={20} color="#fff" />
              <Text style={styles.jobDescription}> {item.pay} $</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Ionicons name="md-time" size={20} color="#fff" />
              <Text style={styles.jobDescription}> {item.estimatedTime}</Text>
              <Text style={styles.jobDescription}> {item.estimatedTimeUnit}</Text>
            </View>
          </View>
        </View>

        <View style={{ justifyContent: 'flex-start' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text style={{ marginTop: 4, color: '#fff', fontWeight: '700' }}>Start Date: </Text>
            <Text style={styles.jobDescription}>{startDate}</Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text style={{ marginTop: 4, color: '#fff', fontWeight: '700' }}>Start Time: </Text>
            <Text style={styles.jobDescription}>{startTime}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleJobPress(item)}>
          <Text style={styles.buttonText}> View Possible Hires ({item.applicants ? item.applicants.length : 0})</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <React.Fragment>
        <View style={styles.searchContainer}>
          <TouchableOpacity disabled={loading} onPress={() => navigation.navigate('ArchivedJobsScreen', { archivedJobs })} style={styles.archiveIcon}>
            <Ionicons name="archive" size={32} color="#b8b8b8" />
          </TouchableOpacity>
          <SearchBar placeholder={'Find previously created jobs..'} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={(item) => item._id}
          style={styles.applicantView}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              tintColor="#c0c0c0" // for ios
              colors={['#808080']} // for android, can be multiple colors for different stages of loading
              refreshing={loading}
              onRefresh={fetchJobs}
            />
          }
        />
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('FindTemplateScreen')} style={styles.Postbtn}>
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>New job post</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
      {/* {loading && <LoadingScreen />} */}
    </View>
  );
}

export default HireScreen;
