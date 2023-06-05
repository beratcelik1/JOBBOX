import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput, Button, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';

import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import LoadingScreen from '../../components/LoadingScreen';

function WorkScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState(''); 

    // At the top of your WorkScreen function...
    const [jobs, setJobs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState('');
    const [payFilter, setPayFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const categories = ['Web Development', 'Graphic Design', 'Content Writing', 'Marketing', 'Mobile App Development', 'Home Cleaning', 'Gardening', 'Dog Walking', 'Grocery Delivery', 'Moving'];
    const FilterModal = ({visible, setVisible, filterData, setFilterData, categories}) => {
        const [categoryFilter, setCategoryFilter] = useState('');
        const handleApplyFilters = () => {
            // apply filters
            // ...
        }
        return (
            <Modal 
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                style={styles.modal}
            >
                <View style={styles.container}>
                    <Text style={styles.headerText}>Filter by</Text>
                    
                    <View style={styles.filterBox}>
                        <Text style={styles.filterText}>Category</Text>
                        <Picker
                            selectedValue={categoryFilter}
                            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                            style={styles.picker}
                            dropdownIconColor="#4683FC"
                        >
                            <Picker.Item label="Category..." value="" />
                            {categories.map((category) => (
                                <Picker.Item key={category} label={category} value={category} />
                            ))}
                        </Picker>
                    </View>
    
                    <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                        <Text style={styles.applyButtonText}>Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    };
    
    
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false); 

    
    const theme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#4683FC', // change the primary color to blue
        },
    };

    const Accordion = ({ title, data, renderContent }) => {
        const [isCollapsed, setIsCollapsed] = useState(true);
      
        return (
          <View>
            <TouchableOpacity onPress={() => setIsCollapsed(!isCollapsed)}>
              <Text>{title}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={isCollapsed}>
              {data.map((content, index) => (
                <TouchableOpacity key={index} onPress={() => {
                  setCategoryFilter(content);
                  closeCategoryModal();
                }}>
                  <Text>{content}</Text>
                </TouchableOpacity>
              ))}
            </Collapsible>
          </View>
        );
      };
      

        const openFilterModal = () => {
            setFilterModalVisible(true);
        };

        const closeFilterModal = () => {
            setFilterModalVisible(false);
        };


    const openCategoryModal = () => {
        setCategoryModalVisible(true);
      };
    
    const closeCategoryModal = () => {
        setCategoryModalVisible(false);
      };
      


      
    const fetchJobs = useCallback(() => {
        setIsLoading(true);
        fetch('http://tranquil-ocean-74659.herokuapp.com/jobs')
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
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
    if (scrollPosition === 0) {
        fetchJobs();
    }
    }, [scrollPosition, fetchJobs]);


    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);
    

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


    const handleSearch = () => {
        setIsLoading(true);
        fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/search?search=${searchQuery}`)
          .then(response => response.json())
          .then(data => setJobs(data))
          .catch(error => console.error('Error:', error));
      };
      
      const handleFilter = () => {
        setIsLoading(true);
        const filters = {
          category: categoryFilter,
          skills: skillsFilter,
          pay: payFilter,
          location: locationFilter,
        };
      
        const query = Object.keys(filters)
          .filter((key) => filters[key].length > 0)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
          .join('&');
      
        fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/?${query}`)
          .then(response => response.json())
          .then(data => setJobs(data))
          .catch(error => console.error('Error:', error));
      };
      
      const renderJob = ({ item }) => ( 
        <TouchableOpacity 
                style={styles.jobCard}
                onPress={() => navigation.navigate('JobDetail', { job: item })} 
            > 
            <View style={styles.jobHeader}>  
                <Text style={styles.jobTitle}>{item.title}</Text>
                <View style = {{ flexDirection: 'row',justifyContent: 'space-between'}}>
                    <Text style={styles.jobTitle2}>{item.postedBy?.firstname} {item.postedBy?.lastname} - 4.3 </Text>
                    <Ionicons name="star" size={13} color="#4683fc" /> 
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
            {searchQuery.length > 0 &&
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="ios-close" size={20} color="#000" />
                </TouchableOpacity>
            }
            <TouchableOpacity style={styles.filterButton} onPress={openFilterModal}>
                <Ionicons name="filter" size={24} color="white" />
            </TouchableOpacity>
            </View>

<Modal 
    isVisible={isFilterModalVisible} 
    style={styles.modal} 
    onBackdropPress={closeFilterModal}
>
    <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Filter by:</Text>
        <View style={styles.filterBox}>
            <Picker
                selectedValue={categoryFilter}
                onValueChange={(itemValue) => setCategoryFilter(itemValue)}
                style={styles.picker}
                dropdownIconColor="#4683FC"
            >
                <Picker.Item label="Category..." value="" />
                {categories.map((category) => (
                    <Picker.Item key={category} label={category} value={category} />
                ))}
            </Picker>
        </View>
        <View style={styles.filterBox}>
            <TextInput
                style={styles.modalInput}
                onChangeText={setSkillsFilter}
                value={skillsFilter}
                placeholder="Skills..."
                placeholderTextColor="#aaa"
            />
        </View>
        <View style={styles.filterBox}>
            <TextInput
                style={styles.modalInput}
                onChangeText={setPayFilter}
                value={payFilter}
                placeholder="Pay..."
                placeholderTextColor="#aaa"
            />
        </View>
        <View style={styles.filterBox}>
            <TextInput
                style={styles.modalInput}
                onChangeText={setLocationFilter}
                value={locationFilter}
                placeholder="Location..."
                placeholderTextColor="#aaa"
            />
        </View>
        <TouchableOpacity onPress={() => { handleFilter(); closeFilterModal(); }} style={styles.applyFilterButton}>
            <Text style={styles.filterOption}>Apply Filter</Text>
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
                onScroll={event => {
                    setScrollPosition(event.nativeEvent.contentOffset.y);
                }}
            />
    </View>
    );
    
} 

function JobDetailScreen({ route, navigation }) {
    //... your existing JobDetail component code
    const { job } = route.params;

    const handleApplyPress = async () => {
        try {
          // Fetch the token from the async storage
          const token = await AsyncStorage.getItem('token');
      
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
                <View
                    style={{
                    borderBottomColor: '#4683fc',
                    borderBottomWidth: 1.5,
                    marginBottom: 10,
                    }}/> 
                
                    
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
                <View
                    style={{
                    borderBottomColor: '#4683fc',
                    borderBottomWidth: 1.5,
                    marginBottom: 7,
                    }}/>
                    
                <View style = {{alignItems: 'center'}}> 
                    <Text style={{color: '#4683fc', fontWeight: '700', marginBottom: 5}}>Skills </Text>
                    <Text style={styles.jobDescription}>{job.skills}</Text>

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
        </View>
    );
}
  
// Define a type for your stack
const Stack = createStackNavigator();
  
export default function Work() {
    return (
      <Stack.Navigator initialRouteName="WorkScreen">
        <Stack.Screen name="WorkScreen" component={WorkScreen} options={{ headerShown: false }} />
        <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}}/>
      </Stack.Navigator>   
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
        marginHorizontal: 10,
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
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
            width: -10,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#4683FC',
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
