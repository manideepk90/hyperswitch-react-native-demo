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
import { sessionParams, useHyper } from 'hyperswitch-sdk-react-native/src';

export default function PaymentScreen() {
  const {initPaymentSession,presentPaymentSheet} = useHyper();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSheetParams, setPaymentSheetParams] = useState({});
  const isDarkMode = useColorScheme() === 'dark';

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
  
    const params : sessionParams = {
      ...paymentSheetParams as sessionParams,
      configuration : {
        appearance : {
          themes : isDarkMode ? "dark" : "light",
          primaryButton : {
            colors : {
              light : {
                primary : "#3680ef",
                placeholderText : "grey"
              },
              dark : {
                placeholderText : "white"
              }
            },
            shapes : {
              borderRadius : 10,
              borderWidth : 2
            }
          }
        },
        // googlePay : {
        //   countryCode : "+91",
        //   currencyCode : "INR",
        //   environment : ""
        // }
      }
    }
    const paymentSheetResponse = await presentPaymentSheet(params);
    console.log(paymentSheetResponse);
    switch(paymentSheetResponse?.status ){
        case "cancelled":
          setMessage("Payment cancelled by user.");
          setup();
          break;
        case "succeded":
          setMessage("Payment Success..");
          break;
        default:
          setMessage("Something went wrong...");
          
        
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
        style={styles.button}
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
  messageText : {
    color : "#fff"
  },
  textView: {
    color: '#f00',
  },
});
