import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput, Button, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import LoadingScreen from '../../components/LoadingScreen';
import {CATEGORIES, SKILLS_BY_CATEGORY, LOCATIONS} from '../constants';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Keyboard } from 'react-native';


function WorkScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState(''); 
    const [jobs, setJobs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState([]);
    const [payFilter, setPayFilter] = useState({ min: '', max: '' });
    const [locationFilter, setLocationFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false); 
    const theme = {...DefaultTheme,colors: {...DefaultTheme.colors,primary: '#4683FC', },};
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        axios.get('/jobs')
          .then(response => {setJobs(response.data);})
          .catch(error => {
            console.error('There was an error fetching jobs', error);
          });
      }, []);
      
        const openFilterModal = () => {
            setFilterModalVisible(true);
        };

        const closeFilterModal = () => {
            setFilterModalVisible(false);
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
        const filters = {
            category: categoryFilter,
            skills: skillsFilter,
            pay: payFilter.min || null,
            location: locationFilter,
        };
      
        const query = Object.keys(filters)
          .filter((key) => filters[key])
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
          .join('&');
      
          fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/?${query}`)
          .then(response => response.json())
          .then(data => setJobs(data))
          .catch(error => console.error('Error:', error));
      };      

      const handleCategoryChange = (category) => {
        setCategoryFilter(category);
        // Clear skills filter when changing category
        setSkillsFilter([]);
      
        // Fetch skills for selected category
        let skillsForCategory = SKILLS_BY_CATEGORY.get(category) || [];
        setSkillsForCategory(skillsForCategory);
      };

      const categories = CATEGORIES.map(category => category.title);

      
      const renderJob = ({ item }) => ( 
        <TouchableOpacity 
                style={styles.jobCard}
                onPress={() => navigation.navigate('JobDetail', { job: item })} 
            > 
            <View style={styles.jobHeader}>  
                <Text style={styles.jobTitle}>{item.postedBy?.firstname} {item.postedBy?.lastname}</Text>
                <Text style={styles.jobTitle}>{item.title}</Text>
            </View>   
            <View
                style={{
                borderBottomColor: '#4683fc',
                borderBottomWidth: 1.5,
                marginBottom: 10,
                }}/>

            <View style = {{ 
                flexDirection: 'row',
                justifyContent: 'flex-start',}}> 

                <View style = {{ width: '60%'}} > 
                <View style={styles.jobDetails}>
                    <Text style={styles.jobDescription}>{item.category}</Text>
                </View>
                <View style={styles.jobDetails}>
                    <Text style={styles.jobDescription}>{item.location}</Text>
                </View>
                </View> 

                <View> 
                <View style={styles.jobDetails}> 
                    <Ionicons name="md-cash" size={20} color="#4683fc" /> 
                    <Text style={styles.jobDescription}>{item.pay} CAD</Text>
                </View> 

                <View style={styles.jobDetails}>
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
    style={[styles.modal, isKeyboardVisible ? {paddingBottom: 280} : {}]} 
    onBackdropPress={closeFilterModal}>
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
                }}/></View>);} 

function JobDetailScreen({ route, navigation }) {
    const { job } = route.params;

    const handleApplyPress = () => {
        (async () => {
            const token = await AsyncStorage.getItem('token');
            console.log(token);
            const decodedToken = jwt_decode(token);
            const userId = decodedToken.userId;
            fetch(`http://tranquil-ocean-74659.herokuapp.com/jobs/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: job._id,
                    userId: userId,}),})
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
            showMessage({
                message: "You have successfully applied for this job!",
                type: "success",
                icon: "success",
                duration: 3000,
                hideOnPress: true,
                floating: true,
            });})(); };
    return (
        <View style={styles.container2}>
            <View style={styles.jobCard2}>
                <Text style={styles.title2}>{job.title}</Text>
                <Text style={styles.description2}>{job.description}</Text>
                <Text style={styles.date2}>{job.datePosted}</Text>
                <TouchableOpacity style={styles.applyButton} onPress={handleApplyPress}>
                    <Text style={styles.buttonText2}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>);}

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
    jobDescription: {
        fontSize: 14,
        color: '#000',
    },
    jobDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 14,
        color: '#4683fc',
        fontWeight: '600'
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
    searchSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 50, paddingLeft: 10, marginLeft: 15, marginRight: 15, marginTop: 10, height: 40, }, 

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
    jobCompany: {
        color: 'gray',
        fontSize: 14,
    },
    jobLocation: {
        color: 'gray',
        fontSize: 14,
    },
    jobPosted: {
        color: 'gray',
        fontSize: 14,
        marginTop: 5,
    },
    jobExtras: {
        flex: 1,
        width: 4,
        alignItems: 'flex-start',
    },
    jobExtra: {
        flexDirection: 'row',
        alignItems: 'center',
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
