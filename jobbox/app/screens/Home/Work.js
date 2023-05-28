import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { TextInput, Button, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';


import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

function WorkScreen({ navigation }) {
    const [searchQuery, setSearchQuery] = useState('');
    // At the top of your WorkScreen function...
    const [jobs, setJobs] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState('');
    const [payFilter, setPayFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const categories = ['Web Development', 'Graphic Design', 'Content Writing', 'Marketing', 'Mobile App Development', 'Home Cleaning', 'Gardening', 'Dog Walking', 'Grocery Delivery', 'Moving'];

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
        <TouchableOpacity style={styles.jobCard} onPress={() => navigation.navigate('JobDetail', { job: item })}>
            <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobCompany}>{item.employer}</Text>
                <Text style={styles.jobLocation}>{item.location}</Text>
                <Text style={styles.jobPosted}>{item.datePosted}</Text>
            </View>
            <View style={styles.jobExtras}>
                <Text style={styles.jobExtra}><Ionicons name="time-outline" size={14} color="gray" /> {item.estimatedTime}</Text>
                <Text style={styles.jobExtra}><Ionicons name="cash-outline" size={14} color="green" /> {item.pay}</Text>
                <Text style={styles.jobExtra}><Ionicons name="star-outline" size={14} color="gold" /> {item.rating}</Text>
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
                <TouchableOpacity
                    onPress={handleSearch}
                    style={styles.searchButton}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
    <TouchableOpacity onPress={openFilterModal}>
        <Text style={styles.filterOption}>Filter</Text>
    </TouchableOpacity>
</View>
<Modal 
                isVisible={isFilterModalVisible} 
                style={styles.modal} 
                onBackdropPress={closeFilterModal}
            >
<View style={styles.modalContent}>
    <Text>Filter by:</Text>
    <View style={styles.filterBox}>
        <Accordion
            title={categoryFilter || "Category..."}
            data={categories}
            renderContent={(content) => (
                <TouchableOpacity onPress={() => {
                    setCategoryFilter(content);
                    closeCategoryModal();
                }}>
                    <Text>{content}</Text>
                </TouchableOpacity>
            )}
        />
    </View>
    <View style={styles.filterBox}>
        <TextInput
            onChangeText={setSkillsFilter}
            value={skillsFilter}
            placeholder="Skills..."
            placeholderTextColor="gray"
        />
    </View>
    <View style={styles.filterBox}>
        <TextInput
            onChangeText={setPayFilter}
            value={payFilter}
            placeholder="Pay..."
            placeholderTextColor="gray"
        />
    </View>
    <View style={styles.filterBox}>
        <TextInput
            onChangeText={setLocationFilter}
            value={locationFilter}
            placeholder="Location..."
            placeholderTextColor="gray"
        />
    </View>
    <TouchableOpacity onPress={() => { handleFilter(); closeFilterModal(); }}>
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

    return (
        <View style={styles.container2}>
            <View style={styles.jobCard2}>
                <Text style={styles.title2}>{job.title}</Text>
                <Text style={styles.description2}>{job.description}</Text>
                <Text style={styles.date2}>{job.datePosted}</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 50,
        paddingLeft: 10,
        marginLeft: 15, 
        marginRight: 15, 
        marginTop: 10, 
        height: 40,
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
    filterOption: {
        color: '#4683fc',
        fontWeight: 'bold',
        fontSize: 16,
    },
    jobView: {
        width: '100%',
        marginBottom: -15,

    },
    jobCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10,
        // Android shadow properties
        elevation: 5,
        // iOS shadow properties
        shadowColor: "#000",
        shadowOffset: {
        width: -10,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    },
    jobDetails: {
        flex: 1,
        width: '70%',
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
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start', // align items to the left
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        paddingTop: 30,
        paddingLeft: 60, // increased padding
        paddingRight: 60, // increased padding
      },
    filterBox: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },    

});
