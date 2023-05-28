import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ProgressBarAndroid } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { EditJobScreen } from './EditJobScreen';


function hireApplicationsScreen({ route }) {
    const { job } = route.params;
    const [applicants, setApplicants] = useState([]);
    const [jobProgress, setJobProgress] = useState(0.33); // Add this state to represent the job progress

    useEffect(() => {
        // Simulating a fetch call here
        const fetchedApplicants = [
            { id: '1', name: 'John Doe', bio: 'Software engineer with 5 years of experience.', rating: 4.5, image: 'https://example.com/image2.jpg' },
            { id: '2', name: 'Jane Smith', bio: 'Data analyst specializing in healthcare.', rating: 4.7, image: 'https://example.com/image2.jpg' },
            { id: '3', name: 'Bob Johnson', bio: 'Experienced gardener with a passion for plants.', rating: 4.2, image: 'https://example.com/image3.jpg' },
            // Add more applicants here...
        ];
        setApplicants(fetchedApplicants);
    }, []);

    const handleEditJob = () => {
        // Handle job edit logic here...
    };

    const renderApplicant = ({ item }) => (
        <View style={styles.applicantCard}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: item.image }} style={styles.applicantImage} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.applicantName}>{item.name}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.applicantRating}>{item.rating}</Text>
                                <Ionicons style={styles.applicantStar} name="star" size={17} color="#f28e1b" />
                            </View>
                        </View>

                    </View>
                    <Text style={styles.applicantBio}>{item.bio}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: -5}}>
                            <TouchableOpacity style={styles.button}>
                                <Ionicons name="checkmark-circle" size={20} color="#4683fc" />
                                <Text style={styles.buttonText}>Hire</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Ionicons name="close-circle" size={20} color="#4683fc" />
                                <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <Ionicons name="eye" size={20} color="#4683fc" />
                                <Text style={styles.buttonText}>Review</Text>
                            </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <View style={styles.jobCard}>
                <Image source={{ uri: job.profilePicture }} style={styles.profileImage} />
                <View style={{ flex: 1, marginLeft: '-10%'}}>
                    <Text style={styles.title}>{job.title}</Text>
                    <Text style={styles.description}>{job.description}</Text>
                    <Text style={styles.date}>{job.datePosted}</Text>
                </View>
                <View style={styles.jobProgressSection}>
                    <ProgressBarAndroid 
                        styleAttr="Horizontal"
                        indeterminate={false}
                        progress={jobProgress}
                        style={styles.progressBar}
                    />
                    <Text style={styles.jobStatus}>Status: {jobProgress === 1 ? 'Completed' : 'In Progress'}</Text>
                    <View style={ {justifyContent: 'center', alignItems: 'center'}}>
                         <TouchableOpacity
                            onPress={() => navigation.navigate("EditJob", { job })}
                            style={styles.Postbtn}
                        >
                        <Text style={ {fontWeight: 'bold', color: '#fff' }} > Edit job</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <FlatList
                data={applicants}
                renderItem={renderApplicant}
                keyExtractor={item => item.id}
                style={styles.applicantView}
            />
        </View>
    );
} 

const editJobStack = createStackNavigator(); 

export default function HireApplications() {
    return (
        <editJobStack.Navigator initialRouteName="HireScreen">
            <editJobStack.Screen name="HireApplicationsScreen" component={hireApplicationsScreen} options={{headerShown: false}} />
            <editJobStack.Screen name="EditJob" component={EditJobScreen} options={{headerTitle: '', headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
        </editJobStack.Navigator>
    );
}

// Styles...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    description: {
        fontSize: 18,
        marginTop: 10,
        color: '#fff',
    },
    date: {
        fontSize: 14,
        marginTop: 10,
        color: '#fff9',
    },
    numApplications: {
        fontSize: 14,
        marginTop: 10,
        color: '#fff9',
    },
    jobCard: {
        flexDirection: 'row',
        backgroundColor: '#4683fc',
        padding: 20,
        paddingLeft: 0,
        marginBottom: 10,
        marginTop: '-5%',
        borderRadius: 10,
        marginLeft: -15,
        marginRight: -15,
    },
    applicantView: {
        marginLeft: -15,
        marginRight: -15,
        marginBottom: -15,

    },
    applicantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 10,
        marginRight: 15,
        marginLeft: 15,
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
    applicantStar: {
        marginTop: -3,
        marginLeft: 5,
    }, 
    applicantImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    applicantName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    applicantBio: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        width: '80%',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 7, 
    },
    applicantRating: {
        fontSize: 14,
        marginLeft: 5,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        backgroundColor: '#f2f3f5',
        paddingTop: 6, 
        paddingBottom: 6, 
        paddingLeft: 7, 
        paddingRight: 9, 
        borderRadius: 50,
    },
    buttonText: {
        marginLeft: 5,
    },
    
    jobProgressSection: {
        alignItems: 'flex-end',
    },
    progressBar: {
        height: 20,
    },
    jobStatus: {
        fontSize: 12,
        color: '#fff',
        marginTop: 5,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        marginTop: 10,
    },
    buttonText: {
        color: '#4683fc',
        fontSize: 12,
        fontWeight: 'bold', 
    },
});
