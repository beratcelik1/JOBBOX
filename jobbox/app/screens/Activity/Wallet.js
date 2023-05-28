import React, { Component, useState } from 'react';
import { Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart'
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  section: {
    marginBottom: 5,
  },
  wallet: {
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  walletDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  walletDetailLabel: {
    fontSize: 16,
    color: 'gray',
  },
  walletDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: { 
    // alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    // paddingVertical: 20, // adjust this to change the height
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 8,
    // textAlign: 'left', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  piContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
    // padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    // padding: 10,

    // marginBottom: 5,
    // borderRadius: 5,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginBottom: 5,
    // alignSelf: 'center',
    // color: 'gray',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: 'gray',
  },
});

const workHistory = [ /*...your work history data...*/ 
  { id: '3', title: 'Work 3', earnings: '$120', date: 'May 5, 2023' },
];

const hireHistory = [ /*...your hire history data...*/ 
 { id: '3', title: 'Hire 3', spent: '$220', date: 'May 6, 2023' },
];

const WalletDetail = ({ label, value, onEdit }) => (
  <View style={styles.walletDetail}>
    <Text style={styles.walletDetailLabel}>{label}</Text>
    <Text style={styles.walletDetailValue}>{value}</Text>
    {onEdit && <Button title="Edit" onPress={onEdit} />}
  </View>
);

const renderWorkHistoryItem = ({ item }) => (
  /*...your item rendering...*/
  <View style={styles.card}>
  <Text style={styles.cardTitle}>{item.title}</Text>
  <View style={styles.cardDetails}>
    <Text style={styles.cardLabel}>Earnings:</Text>
    <Text>{item.earnings}</Text>
  </View>
  <View style={styles.cardDetails}>
    <Text style={styles.cardLabel}>Date:</Text>
    <Text>{item.date}</Text>
  </View>
</View>
);

const renderHireHistoryItem = ({ item }) => (
  /*...your item rendering...*/
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{item.title}</Text>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Spent:</Text>
      <Text>{item.spent}</Text>
    </View>
    <View style={styles.cardDetails}>
      <Text style={styles.cardLabel}>Date:</Text>
      <Text>{item.date}</Text>
    </View>
  </View>
);

const Activity = () => {
  // These should be fetched from your '/user/me' endpoint on component mount
  const [targetEarning, setTargetEarning] = useState(40); 
  const [targetSpent, setTargetSpent] = useState(20); 
  const [isEditingEarning, setIsEditingEarning] = useState(false);
  const [isEditingSpent, setIsEditingSpent] = useState(false);
  // Implement logic to calculate these values
  const totalEarnings = 10; // Calculate total earnings from workHistory
  // const targetEarning = 40;
  const earnCalc = ((totalEarnings/targetEarning)*100)
  
  const totalSpent = 10; // Calculate total spent from hireHistory
  // const targetSpent = 20; 
  const spentCalc = ((totalSpent/targetSpent)*100)
  const profitOrLoss = totalEarnings - totalSpent;
  
  const navigation = useNavigation();
  const widthAndHeight = 150
  const seriesEarn = [earnCalc,100-earnCalc]
  const seriesSpent = [spentCalc, 100-spentCalc]
  // const sliceColor = ['#3CB043','#D0312D']

  const handleEditEarning = (newEarning) => {
    // PUT request to '/user/me' with newEarning
    axios.put('/user/me', { targetEarning: newEarning }, { headers: { /* your auth header */ } })
      .then((res) => {
        setIsEditingEarning(false);
        setTargetEarning(newEarning);
      })
      .catch((err) => console.error(err));
  };

  const handleEditSpent = (newSpent) => {
    // PUT request to '/user/me' with newSpent
    axios.put('/user/me', { targetSpent: newSpent }, { headers: { /* your auth header */ } })
      .then((res) => {
        setIsEditingSpent(false);
        setTargetSpent(newSpent);
      })
      .catch((err) => console.error(err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Wallet</Text>
      <View style={styles.wallet}>
        <View style={{flexDirection: 'row', justifyContent:'space-around'}}> 
        <Text style={styles.sectionTitle}>Earning</Text>
        <Text style={styles.sectionTitle}>Spending</Text>
        </View>
      <View style={styles.piContainer}>
          <PieChart
            widthAndHeight={widthAndHeight}
            series={seriesEarn}
            sliceColor={['#4683fc','#fff']}
            // coverRadius={0.7}
            // coverFill={'#FFF'}
          />
          <PieChart
            widthAndHeight={widthAndHeight}
            series={seriesSpent}
            sliceColor={['#c0c2c7','#fff']}
            // coverRadius={0.7}
            // coverFill={'#FFF'}
          />
      </View>

        <WalletDetail label="Total Earnings" value={`$${totalEarnings}`} />
        <WalletDetail label="Monthly Earning Target" value={`$${targetEarning}`} />
        <WalletDetail label="Total Spent" value={`$${totalSpent}`} />
        <WalletDetail label="Monthly Spending Target" value={`$${targetSpent}`} />
        <WalletDetail label="Profit/Loss" value={`$${profitOrLoss}`} />
        
        <View style={styles.button}>  
          <Button title="Edit Targets"onPress={() => navigation.navigate('EditTargetsScreen')} />
        </View>
      </View>

   
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WorkHistoryScreen')}>
          <Text style={styles.buttonText}>Work History</Text>
          <FlatList
            data={workHistory}
            keyExtractor={item => item.id}
            renderItem={renderWorkHistoryItem}/>
        </TouchableOpacity>

      </View>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HireHistoryScreen')}>
          <Text style={styles.buttonText}>Hire History</Text>
          <FlatList
          data={hireHistory}
          keyExtractor={item => item.id}
          renderItem={renderHireHistoryItem}
        />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Activity;