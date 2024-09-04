// PaymentScreen.ts

import {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {sessionParams, useHyper} from './../hyperswitch-sdk-react-native/src';
import fetchPaymentParams from '../utils/fetchPaymentParams';

export default function PaymentScreen() {
  const {initPaymentSession, presentPaymentSheet} = useHyper();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSheetParams, setPaymentSheetParams] = useState({});
  const isDarkMode = useColorScheme() === 'dark';

  const setup = async () => {
    setError('');
    setLoading(true);
    try {
      const key = await fetchPaymentParams();
      console.log("key from server ",key);
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

    const params: sessionParams = {
      ...(paymentSheetParams as sessionParams),
      configuration: {
        merchantDisplayName: 'Manideep',
        appearance: {
          themes: isDarkMode ? 'dark' : 'light',
          primaryButton: {
            colors: {
              light: {
                background: '#3680ef',
                componentBorder: 'white',
                placeholderText: 'white',
              },
              dark: {
                background: '#3680ef',
                componentBorder: 'white',
                placeholderText: 'white',
              },
            },
            shapes: {
              borderRadius: 30,
              borderWidth: 3,
            },
          },
        },
      },
      branding: 'auto',
    };
    const paymentSheetResponse = await presentPaymentSheet(params);
    console.log(paymentSheetResponse);
    switch (paymentSheetResponse?.status) {
      case 'cancelled':
        setMessage('Payment cancelled by user.');
        setup();
        break;
      case 'succeded':
        setMessage('Payment Success..');
        break;
      case 'failed':
        setError(paymentSheetResponse?.message);
        setMessage('');
      default:
        setMessage('Something went wrong... Reload Client Secret');
    }
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
        style={[
          styles.button,
          {
            opacity: loading || error ? 0.6 : 1,
          },
        ]}
        onPress={checkout}>
        <Text style={styles.buttonText}>
          {loading ? 'Loading Session...' : 'Checkout'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.messageText}>{message}</Text>
      <Text style={styles.textView}>{error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width - 50,
    height: Dimensions.get('screen').height - 50,
    gap: 20,
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
  },
  messageText: {},
  textView: {
    color: '#f00',
    fontSize: 21,
  },
});
