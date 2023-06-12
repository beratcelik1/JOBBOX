import React, { useState, useEffect } from 'react';
import { Alert, Button, View } from 'react-native';
import { initStripe, useStripe } from '@stripe/stripe-react-native';

export const PaymentEntryPoint = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `http://tranquil-ocean-74659.herokuapp.com/payment/payment-sheet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
      publishableKey,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    initStripe({
      publishableKey: publishableKey,
    });

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'JOBBOX Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      <Button
        variant="primary"
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
};

export default PaymentEntryPoint;
