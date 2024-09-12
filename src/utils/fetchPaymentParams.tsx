import {Platform} from 'react-native';

async function fetchPaymentParams() {
  const response = await fetch(
    Platform.OS == 'ios'
      ? 'http://localhost:4242/create-payment'
      : 'http://10.0.2.2:4242/create-payment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const key = await response.json();
  console.log(key);
  return key;
}
export default fetchPaymentParams;
