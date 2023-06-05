import axios from 'axios';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');

  const handlePayment = () => {
    // Here is where you'd integrate your payment processing with APIs/SDKs
    console.log('Payment information:', {
      cardNumber,
      expiryDate,
      cvv,
      cardHolderName,
    });

    const makePayment = async () => {
      // Fetch the token from the async storage
      const token = await AsyncStorage.getItem('token');
      console.log(token);

      // Decode the token to get the user ID
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;

      // send post request for payment
      const response = await axios.post(
        'http://localhost:5001/payment',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: {
            cardNumber: cardNumber,
            expiryDate: expiryDate,
            cvv: cvv,
            cardHolderName: cardHolderName,
          },
        }
      );

      // check if payment was successful
      if (response.status === 200) {
        // payment was successful
        console.log('Payment was successful');
        showMessage({
          message: 'Payment was successful',
          type: 'success',
        });
      }

      // check if payment was unsuccessful
      if (response.status === 400) {
        // payment was unsuccessful
        console.log('Payment was unsuccessful');
        showMessage({
          message: 'Payment was unsuccessful',
          type: 'danger',
        });
      }
    };
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Card Number"
        value={cardNumber}
        onChangeText={setCardNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="MM/YY"
        value={expiryDate}
        onChangeText={setExpiryDate}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="CVV"
        value={cvv}
        onChangeText={setCvv}
        style={styles.input}
        keyboardType="numeric"
        maxLength={3}
        secureTextEntry
      />
      <TextInput
        placeholder="Card Holder Name"
        value={cardHolderName}
        onChangeText={setCardHolderName}
        style={styles.input}
        autoCapitalize="words"
      />
      <View style={styles.buttonContainer}>
        <Button title="Pay" onPress={handlePayment} color="#4CAF50" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 15,
    borderRadius: 5,
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PaymentScreen;
