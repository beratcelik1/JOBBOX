import React, { Component, useState, useEffect } from 'react';
import { Button, TextInput,} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import PieChart from 'react-native-pie-chart'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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
    marginBottom: 20,
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
  button2: { 
    backgroundColor: '#fff',
    paddingHorizontal: 60, 
    paddingVertical: 15,
    marginTop: 10, 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10.84,
    elevation: 5, 
    alignSelf: 'center' 
  }, 
  button: { 
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 0,
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
  },
  card: {
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 14,
    color: 'gray',
  },
  lineStyle:{
    borderWidth: 0.5,
    borderColor:'black',
    margin:10,
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
  const [earningTarget, setTargetEarning] = useState(50);
  const [spendingTarget, setTargetSpent] = useState(50);

  useFocusEffect (
    React.useCallback(() => {
      const fetchTargets = async () => {
        const token = await AsyncStorage.getItem('token');
        axios.get('https://tranquil-ocean-74659.herokuapp.com/auth/user/me', { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => {
            console.log('Response from server: ', res.data);
            setTargetEarning(res.data.earningTarget);
            setTargetSpent(res.data.spendingTarget);
          })
          .catch((err) => console.error(err));
      };
  
      fetchTargets();
    }, [])
  );
  
  const totalEarnings = 10; 
  const totalSpent = 20; 

  let earnCalc;
  if (earningTarget !== 0 && earningTarget != null && earningTarget != '') {
    earnCalc = Math.min((totalEarnings / earningTarget) * 100, 100);
  } else {
    earnCalc = 100;
  }

  let spentCalc;
  if (spendingTarget !== 0 && spendingTarget != null && spendingTarget != '') {
    spentCalc = Math.min((totalSpent / spendingTarget) * 100, 100);
  } else {
    spentCalc = 100;
  }

  
  const navigation = useNavigation();
  const widthAndHeight = 150
  const seriesEarn = [earnCalc > 0 ? earnCalc : 0.3, earnCalc > 0 ? 100-earnCalc : 100]
  const seriesSpent = [spentCalc > 0 ? spentCalc : 0.3, spentCalc > 0 ? 100-spentCalc : 100]

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
            
            />
            <PieChart
              widthAndHeight={widthAndHeight}
              series={seriesSpent}
              sliceColor={['#c0c2c7','#fff']}

            />
        </View>

        <WalletDetail label="Total Earnings" value={`$${totalEarnings}`} />
        <WalletDetail label="Total Spent" value={`$${totalSpent}`} />
      
        <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1.5,
          marginBottom: 10,
        }}/>
        
        <WalletDetail label="Monthly Earning Target" value={`$${earningTarget}`} />
        <WalletDetail label="Monthly Spending Target" value={`$${spendingTarget}`} /> 

        <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('EditTargetsScreen')} >
          <Text style = {{fontWeight: '700', color: '#4683fc'}}>Edit Targets </Text>
        </TouchableOpacity>
  
      </View>
   
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('WorkHistoryScreen')}>
          <Text style={styles.buttonText}>Work History</Text>
          {workHistory.map(item => <View key={item.id}>{renderWorkHistoryItem({item})}</View>)}
        </TouchableOpacity>
      </View>

      <View style={styles.section} >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HireHistoryScreen')}>
          <Text style={styles.buttonText}>Hire History</Text>
          {hireHistory.map(item => <View key={item.id}>{renderHireHistoryItem({item})}</View>)}
        </TouchableOpacity>
      </View> 
      <View style= {{marginBottom: 30}}> 
      </View>
    </ScrollView>
  );
};

export default Activity;