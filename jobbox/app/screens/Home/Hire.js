// screens/Home/Hire.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Hire() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        // handle search logic here
        console.log(searchQuery);
    };

    return (
        <View style={styles.container}>
            <Text> scream H </Text>
            <View style={styles.searchSection}>
                <TextInput
                    style={styles.searchInput}
                    onChangeText={text => setSearchQuery(text)}
                    value={searchQuery}
                    placeholder="Search..."
                />
                <Button 
                    onPress={handleSearch}
                    title="Search"
                />
            </View>
            <Button 
                onPress={() => navigation.navigate('PostJob')}
                title="Post a Job"
            />
        </View>
    );
}

// ... rest of your code

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

