import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { View, Text, FlatList, TouchableOpacity, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ChatScreen from './ChatScreen';  
import { formatDateTime } from '../../utils/formatDateTime'; 
import WorkPeriodDetails from './WorkPeriod';  
import { Ionicons } from '@expo/vector-icons';


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

  
  const renderItem = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);
    
    return (
      <TouchableOpacity style={styles.jobCard} onPress={() => handleJobPress(item)}>
      <View style= {{flexDirection: 'row', justifyContent: 'space-between',}}>
        <Text style={{...styles.jobTitle, color: '#fff'} }>{item.title}</Text>
        <View style={[
          styles.jobStatusContainer,
          item.status === 'Applied' && { backgroundColor: '#5ec949' },
          item.status === 'in progress' && { backgroundColor: '#fff' },
          item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
        ]}>
          <Text style={{...styles.jobStatus, color: '#4683fc'}}>{item.status}</Text>
        </View>
      </View> 
      <View
        style={{
        borderBottomColor: '#fff',
        borderBottomWidth: 1.5,
        marginBottom: 10,
        marginTop: 5, 
        }}/> 

    <View style = {{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5}}> 
        <View style = {{ width: '60%'}} > 
            <View style={styles.jobDetails}>
                <Text style={styles.jobDescriptionH}>Employee: {item.hiredApplicant?.firstname} {item.hiredApplicant?.lastname}</Text>
            </View>
            <View style={styles.jobDetails}>
                <Text style={styles.jobDescriptionH}>Category: {item.category}</Text>
            </View>
        </View> 

        <View style = {{ width: '40%'}}> 
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
                <Ionicons name="md-cash" size={20} color="#fff" /> 
                <Text style={styles.jobDescriptionH}>  {item.pay} $ </Text>
            </View> 

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Ionicons name="md-time" size={20} color="#fff" />
                <Text style={styles.jobDescriptionH}>  {item.estimatedTime}</Text>
                <Text style={styles.jobDescriptionH}>  {item.estimatedTimeUnit}</Text>
            </View> 
        </View>
    </View> 
    <View style={styles.timeContainer}>
          <View style={styles.timeBoxH}>
            <Text style={styles.timeTitleH}>Start</Text>
            <Text style={styles.timeTextH}>{startDate}</Text>
            <Text style={styles.timeTextH}>{startTime}</Text>
          </View>
          <View style={styles.timeBoxH} marginLeft='2%'>
            <Text style={styles.timeTitleH}>End</Text>
            <Text style={styles.timeTextH}>{endDate}</Text>
            <Text style={styles.timeTextH}>{endTime}</Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  };
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

  const renderItem = ({ item }) => {
    const [startDate, startTime] = formatDateTime(item.startDateTime);
    const [endDate, endTime] = formatDateTime(item.endDateTime);
    
    return (
      <TouchableOpacity style={styles.jobCardWork} onPress={() => handleJobPress(item)}>
      <View style= {{flexDirection: 'row', justifyContent: 'space-between',}}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[
          styles.jobStatusContainer,
          item.status === 'Applied' && { backgroundColor: '#5ec949' },
          item.status === 'in progress' && { backgroundColor: '#4683fc' },
          item.status === 'Completed' && { backgroundColor: '#c7c7c7'}
        ]}>
          <Text style={styles.jobStatus}>{item.status}</Text>
        </View>
      </View> 
      <View
        style={{
        borderBottomColor: '#4683fc',
        borderBottomWidth: 1.5,
        marginBottom: 10,
        marginTop: 5, 
        }}/> 

    <View style = {{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5}}> 
        <View style = {{ width: '60%'}} > 
            <View style={styles.jobDetails}>
                <Text style={styles.jobDescription}>Employer: {item.postedBy.firstname} {item.postedBy.lastname}</Text>
            </View>
            <View style={styles.jobDetails}>
                <Text style={styles.jobDescription}>Category: {item.category}</Text>
            </View>
        </View> 

        <View style = {{ width: '40%'}}> 
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 5}}> 
                <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                <Text style={styles.jobDescription}>  {item.pay} $ </Text>
            </View> 

            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Ionicons name="md-time" size={20} color="#4683fc" />
                <Text style={styles.jobDescription}>  {item.estimatedTime}</Text>
                <Text style={styles.jobDescription}>  {item.estimatedTimeUnit}</Text>
            </View> 
        </View>
    </View> 
    <View style={styles.timeContainer}>
          <View style={styles.timeBox}>
            <Text style={styles.timeTitle}>Start</Text>
            <Text style={styles.timeText}>{startDate}</Text>
            <Text style={styles.timeText}>{startTime}</Text>
          </View>
          <View style={styles.timeBox} marginLeft='2%'>
            <Text style={styles.timeTitle}>End</Text>
            <Text style={styles.timeText}>{endDate}</Text>
            <Text style={styles.timeText}>{endTime}</Text>
          </View>
        </View>

      </TouchableOpacity>
    );
  };
  

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

  const isFocused = useIsFocused();

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

    if(isFocused)
      fetchData();
  }, [isFocused]);

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
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
    marginBottom: 5
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 7, 
    borderRadius: 10, 
    marginTop: 10, 
  },
  timeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  timeText: {
    fontSize: 13,
    color: '#000',
  },
  jobDescription: {
    fontSize: 14,
    color: '#000',
  }, 
   
  timeBoxH: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#4683fc',
    paddingVertical: 7, 
    borderRadius: 10, 
    marginTop: 10, 
  },
  timeTitleH: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeTextH: {
    fontSize: 13,
    color: '#fff',
  },
  jobDescriptionH: {
    fontSize: 14,
    color: '#fff',
  },

  jobDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
  }, 
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
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 20,
    backgroundColor: '#4683fc',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6.84, 
    borderWidth: 5, // Specify the width of the border
    borderColor: '#fff', // Specify the color of the border
  }, 
  jobCardWork: {
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
    shadowOpacity: 0.,
    shadowRadius: 6.84, 
    borderWidth: 5, // Specify the width of the border
    borderColor: '#4683fc', // Specify the color of the border
  },
  jobTitle: {
    fontSize: 18,
    marginHorizontal: 5,
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