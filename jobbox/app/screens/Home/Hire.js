import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PostJob from '../Home/PostJob';
import { useContext } from 'react';
import { RootNavigationContext } from '../../navigation/RootNavigationContext';

function HireScreen({ navigation }) {
    const navigationRef = useContext(RootNavigationContext);
    navigationRef.current?.navigate('PostJob');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // handle search logic here
        console.log(searchQuery);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={text => setSearchQuery(text)}
                    value={searchQuery}
                    placeholder="Search foor a job template"
                />
                <Button 
                    onPress={handleSearch}
                    title="Search"
                />
            </View>
            <Button 
                onPress={() => navigation.navigate("PostJob")}
                title="Post a Job"
            />
        </View>
    );
}

const HireStack = createStackNavigator();

export default function Hire() {
    return (
        <HireStack.Navigator initialRouteName="HireScreen">
            <HireStack.Screen name="HireScreen" component={HireScreen} options={{headerShown: false}} />
            <HireStack.Screen name="PostJob" component={PostJob} options={{headerShown: true, headerBackTitle: '', headerBackTitleVisible: false}} />
        </HireStack.Navigator>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
    },
});
