// PaymentScreen.ts

import React from 'react';
import {Dimensions, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {sessionParams, useHyper} from 'hyperswitch-sdk-react-native/src';
import fetchPaymentParams from './utils/fetchPaymentParams';
import Button from './Components/Button';

export default function PaymentScreen() {
  const {initPaymentSession, presentPaymentSheet} = useHyper();
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [paymentSheetParams, setPaymentSheetParams] = React.useState({});
  const isDarkMode = useColorScheme() === 'dark';
  const reloadButtonText = loading ? 'Loading Session' : 'Reload Client';
  const checkOutButtonText = loading ? 'Loading...' : 'Checkout';
  const styles = isDarkMode ? darkStyles : lightStyles;

  const fetchPaymentSession = React.useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const key = await fetchPaymentParams();
      const paymentSheetParamsResult = await initPaymentSession(key);
      setPaymentSheetParams(paymentSheetParamsResult);
    } catch (err) {
      setError('Failed to load Client Secret');
    }
    setError('');
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchPaymentSession();
  }, []);

  const checkout = async () => {
    setMessage('');
    const params: sessionParams = {
      ...(paymentSheetParams as sessionParams),
      configuration: {
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
    };
    const paymentSheetResponse = await presentPaymentSheet(params);
    switch (paymentSheetResponse?.status) {
      case 'cancelled':
        fetchPaymentSession();
        setError('Payment cancelled by user. 😧');
        break;
      case 'succeeded':
        setMessage('Payment Success. 😎');
        break;
      case 'failed':
        setError('Payment failed. 🙁 : \n' + paymentSheetResponse?.message);
        break;
      default:
        setError(paymentSheetResponse?.message);
        setMessage('');
    }
  };

  return (
    <View style={defaultStyles.wrapper}>
      <Button
        disabled={loading}
        callback={fetchPaymentSession}
        buttonText={reloadButtonText}
      />
      <Button
        disabled={loading || error ? true : false}
        style={{
          opacity: loading || error ? 0.6 : 1,
        }}
        callback={checkout}
        buttonText={checkOutButtonText}
      />

      <Text style={styles.messageText}>{message}</Text>
      <Text style={styles.textView}>{error}</Text>
    </View>
  );
}
const defaultStyles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('screen').width - 50,
    height: Dimensions.get('screen').height - 50,
    gap: 20,
    alignItems: 'center',
    gap: 10,
  },
});

const darkStyles = StyleSheet.create({
  messageText: {
    fontSize: 24,
    color: '#0f0',
  },
  textView: {
    color: '#FF7C7C',
    fontSize: 21,
  },
});
const lightStyles = StyleSheet.create({
  messageText: {
    fontSize: 24,
    color: '#284A2C',
  },
  textView: {
    color: '#7A4949',
    fontSize: 21,
  },
});
