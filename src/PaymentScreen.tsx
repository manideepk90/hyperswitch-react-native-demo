// PaymentScreen.ts

import {useEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { sessionParams, useHyper } from '../hyperswitch-sdk-react-native/src';

export default function PaymentScreen() {
  const {initPaymentSession,presentPaymentSheet} = useHyper();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSheetParams, setPaymentSheetParams] = useState({});

  const setup = async () => {
    setLoading(true);
    try {
      console.log('called before');
      const response = await fetch('http:10.0.2.2:4242/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const key = await response.json();
      const paymentSheetParamsResult = await initPaymentSession(key);
      setPaymentSheetParams(paymentSheetParamsResult);
    } catch (err) {
      setError('Failed to load Client Secret');
    }
    setLoading(false);
  };

  useEffect(() => {
    setup();
  }, []);

  const checkout = async () => {
    console.log('paymentSheetParams', paymentSheetParams);
    const paymentSheetResponse = await presentPaymentSheet(paymentSheetParams as sessionParams);
    console.log(paymentSheetResponse);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        disabled={loading}
        onPress={setup}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading Session...' : 'Reload Client'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={loading || error ? true : false}
        style={styles.button}
        onPress={checkout}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading Session...' : 'Checkout'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.textView}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width - 50,
    height: Dimensions.get('screen').height - 50,
    gap: 100,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#3680ef',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
  textView: {
    color: '#000',
  },
});
