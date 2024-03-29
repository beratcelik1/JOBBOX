import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import {CATEGORIES, SKILLS_BY_CATEGORY, LOCATIONS} from '../constants';
import { Keyboard } from 'react-native';
import { formatDateTime } from '../../utils/formatDateTime';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4683FC',
    },
  };


function WorkScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [jobs, setJobs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState([]);
    const [payFilter, setPayFilter] = useState({ min: '', max: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false); 
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [isFilterApplied, setFilterApplied] = useState(false);

      
        const openFilterModal = () => {
            setFilterModalVisible(true);
        };

        const closeFilterModal = () => {
            setFilterModalVisible(false);
        };
      
        const fetchJobs = useCallback(() => {
            setIsLoading(true);
            
            AsyncStorage.getItem('token')
            .then(token => {
              fetch('http://tranquil-ocean-74659.herokuapp.com/jobs', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              })
              .then(response => response.json())
              .then(data => {
                // Update this line to prepend the new data
                setJobs(data);
                setIsLoading(false);
                setRefreshing(false);
              })
              .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
                setRefreshing(false);
              });
            })
            .catch(err => console.log(err));
          }, []);

          const onRefresh = useCallback(() => {
            setCategoryFilter('');
            setPayFilter({ min: '' });
            setFilterApplied(false);
            fetchJobs(); // fetch jobs after resetting filters
          }, [fetchJobs]);

          const removeFilters = () => {
            setCategoryFilter('');
            setPayFilter({ min: ''});
            setFilterApplied(false);
            fetchJobs(); // fetch jobs after removing filters
          };          

    useEffect(() => {
    if (scrollPosition === 0) {
        fetchJobs();
    }
    }, [scrollPosition, fetchJobs]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

    useEffect(() => {
        if (searchQuery.length > 0) {
            setIsLoading(true);
            fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/search?search=${searchQuery}`)
                .then(response => response.json())
                .then(data => setJobs(data))
                .catch(error => console.error('Error:', error));
        } else {
            fetchJobs();
        }
    }, [searchQuery, fetchJobs]);  
      
    const handleFilter = () => {
        setIsLoading(true);
        setFilterApplied(true);
        const filters = {
          category: categoryFilter,
          skills: skillsFilter,
          pay: payFilter.min || null,
        };
      
        const query = Object.keys(filters)
          .filter((key) => filters[key])
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
          .join('&');
      
        AsyncStorage.getItem('token')
        .then(token => {
          fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/?${query}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
          .then(response => response.json())
          .then(data => {
            setJobs(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
            setIsLoading(false);
          });
        })
        .catch(err => console.log(err));
      };

      const categories = CATEGORIES.map(category => category.title);

      const renderJob = ({ item }) => ( 
        <TouchableOpacity 
                style={styles.jobCard}
                onPress={() => navigation.navigate('JobDetail', { job: item })} 
            > 
            <View style={styles.jobHeader}>  
                <Text style={styles.jobTitle}>{item.title}</Text>
                <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                    <Text style={styles.jobTitle2}>{item.postedBy?.firstname} {item.postedBy?.lastname} {' '}
                        <Ionicons name="star" size={13} color="#4683fc" /> {item.postedBy.hireRating == 0 ? '-' : item.hireRating}
                    </Text>
                </View>
            </View>     
            <View
                style={{
                borderBottomColor: '#4683fc',
                borderBottomWidth: 1.5,
                marginBottom: 10,
                }}/>

            <View style = {{ flexDirection: 'row', justifyContent: 'flex-start',}}> 
                <View style = {{ width: '60%'}} > 
                    <View style={styles.jobDetails}>
                        <Text style={styles.jobDescription}>{item.category}</Text>
                    </View>
                    <View style={styles.jobDetails}>
                        <Text style={styles.jobDescription}>{item.location}</Text>
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
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons style={styles.searchIcon} name="ios-search" size={20} color="#000" />
                <TextInput
                    style={styles.searchInput}
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    placeholder="Search"
                    placeholderTextColor="gray"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="ios-close" size={20} color="#000" />
                    </TouchableOpacity>
                )}

                {isFilterApplied ? (
                    <TouchableOpacity style={styles.filterButton} onPress={removeFilters}>
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                        <Ionicons name="filter" size={24} color="white" />
                    </TouchableOpacity>
                )}
            </View>
            <Modal 
                isVisible={isFilterModalVisible} 
                style={[styles.modal, isKeyboardVisible ? {paddingBottom: 280} : {}]} 
                onBackdropPress={closeFilterModal}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filters</Text>
                <View style={styles.filterBox}>
                    <Picker
                        selectedValue={categoryFilter}
                        onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                        style={styles.picker}
                        dropdownIconColor="#4683FC"
                        >
                        <Picker.Item label="Category..." value="" />
                        {categories.map((category, index) => (
                            <Picker.Item key={index} label={category} value={category} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.filterBox}>
                    <TextInput
                        style={styles.modalInput}
                        onChangeText={(value) => setPayFilter({...payFilter, min: value})}
                        value={payFilter.min}
                        placeholder="Min Pay..."
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity onPress={() => { handleFilter(); closeFilterModal(); }} style={styles.applyFilterButton}>
                    <Text style={styles.filterOption}>Apply</Text>
                </TouchableOpacity>
            </View>
                </Modal>
            <FlatList
                data={jobs}
                renderItem={renderJob}
                keyExtractor={item => item._id}
                style={styles.jobView}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
                onScroll={event => { setScrollPosition(event.nativeEvent.contentOffset.y);}}
            />  
        </View> 
    );} 

function JobDetailScreen({ route, navigation }) {
    const { job } = route.params;
    const [startDate, startTime] = formatDateTime(job.startDateTime);
    const [endDate, endTime] = formatDateTime(job.endDateTime);

    const handleApplyPress = async () => {
        try {
          // Fetch the token from the async storage
          const token = await AsyncStorage.getItem('token');
          const userId = await AsyncStorage.getItem('userId')
    
          console.log('User ID:', userId);
          console.log('Job posted by:', job.postedBy._id);
    
          if (String(job.postedBy._id) === String(userId)) {
            showMessage({
                message: "You cannot apply to a job that you created.",
                type: "danger",
                icon: "danger",
                duration: 3000,
                hideOnPress: true,
                floating: true,
            });
            return;
          }
    
          // Check if the user has already applied
          if (job.applicants.includes(userId)) {
            showMessage({
                message: "You have already applied for this job.",
                type: "danger",
                icon: "danger",
                duration: 3000,
                hideOnPress: true,
                floating: true,
            });
            return;
          }
    
          // Send the POST request to apply for the job
          const response = await fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/apply/${job._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            // If server response is not ok, throw an error
            throw new Error(`HTTP error! status: ${response.status}`);
          } else {
            const data = await response.json();
            console.log(data);
            
            // Create a notification
            const notification = {
                to: job.postedBy._id, 
                from: userId,
                action: 'job_application',
                jobId: job._id,
            };
            await axios.post('https://tranquil-ocean-74659.herokuapp.com/auth/notifications', notification);
    
            // Show a success message if application is successful
            showMessage({
              message: "You have successfully applied for this job!",
              type: "success",
              icon: "success",
              duration: 3000,
              hideOnPress: true,
              floating: true,
            });
          }
        } catch (error) {
          // Display error message and log the error for debugging
          console.error('Error:', error);
    
          showMessage({
            message: "An error occurred while applying for the job. Please try again later.",
            type: "danger",
            icon: "danger",
            duration: 3000,
            hideOnPress: true,
            floating: true,
          });
        }
    };
          
    return (
        <View style={styles.container2}> 
            <View style={styles.jobCard2}> 
                <View style={styles.jobHeader}>  
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                        <Text style={styles.jobTitle2}>{job.postedBy?.firstname} {job.postedBy?.lastname} - 4.3 </Text>
                        <Ionicons name="star" size={13} color="#4683fc" /> 
                    </View>
                </View>     
                <View style={{ borderBottomColor: '#4683fc', borderBottomWidth: 1.5, marginBottom: 10, }}/>  

                <View style={styles.jobDetails}> 
                    <View style={styles.jobDetails}>
                        <Ionicons name="md-grid" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  Category: </Text> 
                    </View>
                    <Text style={styles.jobDescription}>{job.category}</Text>
                </View>

                <View style={styles.jobDetails}> 
                    <View style={styles.jobDetails}>
                        <Ionicons name="ios-location-sharp" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  Location: </Text>
                    </View>
                    <Text style={styles.jobDescription}>{job.location}</Text>
                </View>

                <View style={styles.jobDetails}>  
                    <View style={styles.jobDetails}>
                        <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  Pay: </Text>
                    </View>
                    <Text style={styles.jobDescription}>{job.pay} CAD</Text>
                </View> 

                <View style={styles.jobDetails}> 
                    <View style={styles.jobDetails}>
                        <Ionicons name="md-time" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  Time: </Text>
                    </View>
                    <Text style={styles.jobDescription}>{job.estimatedTime}  {job.estimatedTimeUnit}</Text>
                </View>
                <View style={styles.jobDetails}> 
                    <View style={styles.jobDetails}>
                        <Ionicons name="md-calendar" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  Start Date/Time: </Text>
                    </View>
                    <Text style={styles.jobDescription}>{startDate} {startTime}</Text>
                </View>
                <View style={styles.jobDetails}> 
                    <View style={styles.jobDetails}>
                        <Ionicons name="md-calendar" size={20} color="#4683fc" /> 
                        <Text style={{color: '#4683fc', fontWeight: '700'}}>  End Date/Time: </Text>
                    </View>
                    <Text style={styles.jobDescription}>{endDate} {endTime}</Text>
                </View>
                <View
                    style={{
                    borderBottomColor: '#4683fc',
                    borderBottomWidth: 1.5,
                    marginBottom: 7,
                    }}/>
                    
                <View style = {{alignItems: 'center'}}> 
                    <Text style={{color: '#4683fc', fontWeight: '700', marginBottom: 5}}>Skills </Text>
                    <Text style={styles.description}> 
                        {Array.isArray(job.skills) && job.skills.length > 0 
                        ? job.skills.join(', ') 
                        : "No skills listed"} 
                    </Text>

                    <Text style={{color: '#4683fc', fontWeight: '700', marginBottom: 5, marginTop: 15}}>Description</Text>
                    <Text style={styles.jobDescription}>{job.description}</Text>
                </View> 

                <TouchableOpacity 
                    style={styles.button2}
                    onPress={handleApplyPress}
                > 
                    <Text style={styles.buttonText2}> Apply For Job </Text>
                </TouchableOpacity>
            </View>
        </View>);}

const Stack = createStackNavigator();  
export default function Work() {
    return (
      <PaperProvider theme={theme}>
        <Stack.Navigator initialRouteName="WorkScreen">
          <Stack.Screen name="WorkScreen" component={WorkScreen} options={{ headerShown: false }} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}}/>
        </Stack.Navigator>
      </PaperProvider>
    );
  }

const styles = StyleSheet.create({ 
    jobHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10, 
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    jobTitle2: {
        fontSize: 13,
    },
    jobDescription: {
        fontSize: 14,
        color: '#000',
    },
    jobDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },

    button: { 
        backgroundColor: '#4683fc',
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, 
        alignItems: 'center', 
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        
    }, 
    container: {
        flex: 1,
        marginBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: 'white',
        borderWidth: 0.5,
        borderRadius: 50,
        paddingLeft: 10,
        margin: 10,
        elevation: 5,
        // iOS shadow properties
        shadowColor: '#000',
        shadowOffset: {width: 0,height: 2,},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
          
    searchIcon: {
        padding: 0,
    },
    searchInput: {
        flex: 1,
        paddingTop: -10,
        paddingRight: -10,
        paddingBottom: -10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
        height: 40,
    },
    searchButton: {
        backgroundColor: '#4683fc',
        borderRadius: 50,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    filterSection: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'left',
        marginTop: 10,
        marginBottom: 10,
    }, 
    button2: { 
        backgroundColor: '#4683fc',
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, 
        alignItems: 'center', 
      },
      buttonText2: {
        fontSize: 16,
        color: '#fff', 
        fontWeight: '600',
        
      },

    filterButton: {
        width: 40, // specify the width
        height: 40, // specify the height
        backgroundColor: '#4683fc',
        justifyContent: 'center', // center the icon vertically
        alignItems: 'center', // center the icon horizontally
        borderRadius: 10, // this will make the corners rounded
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 2,
        borderRadius: 50,
        marginHorizontal: 5,
    },
    
    filterOption: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        padding: 10,
    },
      filterIcon: {
        padding: 10,
        backgroundColor: '#4683fc',
        borderRadius: 8, // Change this to control the corner roundness
        color: 'white',
    },
    jobView: {
        width: '100%',
        marginBottom: -15,
        paddingTop: 10, 
    },
    jobCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        marginLeft: 15,
        marginRight: 15,
        // Android shadow properties
        elevation: 5,
        // iOS shadow properties
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
        fontWeight: 'bold',
        marginBottom: 5,
    }, 

    container2: {
        flex: 1,
        padding: 20,
    },
    jobCard2: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12.84,
    },
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description2: {
        fontSize: 14,
        color: '#666',
        marginTop: 10,
    },
    date2: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
    },
    applyButton: {
        backgroundColor: '#3498db',
        paddingVertical: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText2: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    inputHalf: {
        flex: 1,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0, 
    },
    modalContent: {
        backgroundColor: '#f6f6f6',  // Light grey background for contrast
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center', // center align items
        borderTopRightRadius: 20, // Rounded edges for a softer look
        borderTopLeftRadius: 20,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: '#000',
    },
    filterBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 15,  // More rounded edges
        marginBottom: 20,  // Increase space between inputs
        width: '100%',  // Take full width of the modal
        paddingHorizontal: 15,  // More padding for text input
    },
    modalInput: {
        backgroundColor: 'white',
        fontSize: 16,
        color: '#333',
    },
    accordionText: {
        fontSize: 16,
        color: '#333',
    },
    applyFilterButton: {
        backgroundColor: '#4683FC',
        borderRadius: 50,
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    picker: {
        height: 220,
        width: '100%',
    },
    

});