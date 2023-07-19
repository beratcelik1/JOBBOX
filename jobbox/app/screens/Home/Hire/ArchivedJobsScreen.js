import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import LoadingScreen from '../../../components/LoadingScreen';
import { formatDateTime } from '../../../utils/formatDateTime';

import styles from './styles';

function ArchivedJobsScreen({ route, navigation }) {
  const { archivedJobs, loading } = route.params;
  const handleJobPress = (job) => {
    console.log(job);
    navigation.navigate('HireApplicationsScreen', { job, isArchived: true });
  };

  const renderJob = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);

    return (
      <View style={styles.jobCardArchive}>
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
          <Text style={styles.buttonText}> View Job details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}
      <FlatList data={archivedJobs} renderItem={renderJob} keyExtractor={(item, index) => item._id.toString()} style={styles.applicantView} />
    </View>
  );
}

export default ArchivedJobsScreen;
