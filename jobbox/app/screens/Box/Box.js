import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';  
import { formatDateTime } from '../../utils/formatDateTime'; 
import WorkPeriodDetails from './WorkPeriod';  

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
  },
};

const BoxHiring = ({ hiringJobs }) => {
  const navigation = useNavigation(); 

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);


  const handleJobPress = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }; 

  
  const renderItem = ({ item }) => ( 
    <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item)}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={[
        styles.jobStatusContainer,
        item.status === 'Applied' && { backgroundColor: '#5ec949' },
        item.status === 'in progress' && { backgroundColor: '#4683fc' },
        item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
      ]}>
        <Text style={styles.jobStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList 
        data={hiringJobs} 
        renderItem={renderItem} 
        keyExtractor={(item) => item._id} 
      />
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={false} 
        onRequestClose={() => setModalVisible(false)}
      >
        <WorkPeriodDetails  
          job={selectedJob} 
          closeModal={() => setModalVisible(false)} 
        />

      </Modal>
    </View>
  );
};

const BoxWorking = ({ workingJobs }) => {
  const navigation = useNavigation(); 

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);


  const handleJobPress = (job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }; 

 
  const renderItem = ({ item }) => ( 
    <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item)}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <View style={[
        styles.jobStatusContainer,
        item.status === 'Applied' && { backgroundColor: '#5ec949' },
        item.status === 'in progress' && { backgroundColor: '#4683fc' },
        item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
      ]}>
        <Text style={styles.jobStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <FlatList 
        data={workingJobs} 
        renderItem={renderItem} 
        keyExtractor={(item) => item._id} 
      />
      <Modal 
        visible={modalVisible} 
        animationType="slide" 
        transparent={false} 
        onRequestClose={() => setModalVisible(false)}
      >
        <WorkPeriodDetails  
          job={selectedJob} 
          closeModal={() => setModalVisible(false)} 
        />

      </Modal>
    </View>
  );
  
};

const Tab = createMaterialTopTabNavigator();
const HiringStack = createStackNavigator();
const WorkingStack = createStackNavigator();

function HiringStackNavigator({ hiringJobs }) {
  return (
    <HiringStack.Navigator>
      <HiringStack.Screen name="BoxHiring" children={() => <BoxHiring hiringJobs={hiringJobs} />} options={{ headerShown: false }}/>
      <HiringStack.Screen name="WorkPeriodDetails" component={WorkPeriodDetails} options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#4683fc',
          headerBackTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}/>
      <HiringStack.Screen name="ChatScreen" component={ChatScreen} options={{
          headerTitle: 'Chat',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#4683fc',
          headerBackTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}/>
    </HiringStack.Navigator>
  );
}

function WorkingStackNavigator({ workingJobs }) {
  return (
    <WorkingStack.Navigator>
      <WorkingStack.Screen name="BoxWorking" children={() => <BoxWorking workingJobs={workingJobs}/>} options={{ headerShown: false }}/>
      <WorkingStack.Screen name="WorkPeriodDetails" component={WorkPeriodDetails} options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#4683fc',
          headerBackTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }} />
      <WorkingStack.Screen name="ChatScreen" component={ChatScreen} options={{
          headerTitle: 'Chat',
          headerShown: true,
          headerTransparent: true,
          headerTintColor: '#4683fc',
          headerBackTitle: '',
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
        }}/>
    </WorkingStack.Navigator>
  );
}

const Box = () => {
  const [hiringJobs, setHiringJobs] = useState([]);
  const [workingJobs, setWorkingJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          console.log('User ID not found in storage');
          return;
        }

        const response = await axios.get(`https://tranquil-ocean-74659.herokuapp.com/jobs/user/${userId}/inprogress`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const hiring = response.data.filter(job => job.postedBy && job.postedBy._id === userId);
        const working = response.data.filter(job => job.hiredApplicant && job.hiredApplicant._id === userId);


        setHiringJobs(hiring);
        setWorkingJobs(working);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <NavigationContainer independent={true} theme={MyTheme}>
      <Tab.Navigator initialRouteName="Hiring" screenOptions={{ tabBarActiveTintColor: '#4683fc', tabBarInactiveTintColor: '#000', tabBarIndicatorStyle: { backgroundColor: '#4683fc' }, tabBarStyle: { backgroundColor: '#fff' }, swipeEnabled: true }}>
      <Tab.Screen name="Hiring" children={() => <HiringStackNavigator hiringJobs={hiringJobs} />} options={{ title: 'Hiring' }} />
        <Tab.Screen name="Working" children={() => <WorkingStackNavigator workingJobs={workingJobs} />} options={{ title: 'Working' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  jobCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.84,
  },
  jobTitle: {
    fontSize: 18,
  },
  jobStatus: {
    fontSize: 16,
    fontWeight: '500',
  }, 
  jobStatusContainer: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  jobStatus: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff'
  }
};

export default Box;