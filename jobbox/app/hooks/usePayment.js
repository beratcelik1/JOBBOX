import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { initStripe, useStripe } from '@stripe/stripe-react-native';

const usePayment = ({ jobId }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `http://tranquil-ocean-74659.herokuapp.com/payment/payment-sheet`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId })
      }
    );

    // handle error
    if (!response.ok) {
      console.log(`Error: ${JSON.stringify(response.json())}`);
      return;
    }

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
      allowsDelayedPaymentMethods: true
    });
    if (!error) {
      setPaymentReady(true);
    }
  };

  const openPaymentSheet = async () => {
    if (!paymentReady) {
      Alert.alert('Error', 'Payment Sheet is not ready yet.');
      return;
    }
    
    setLoading(true);
    const { error } = await presentPaymentSheet();
    setLoading(false);

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your payment is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);
  
  return { loading, openPaymentSheet };
};

export default usePayment;
