import {Platform} from 'react-native';

export default async function getPublishableKey() {
  const response = await fetch(
    Platform.OS == 'ios'
      ? 'http://localhost:4242/get-config'
      : 'http://10.0.2.2:4242/get-config',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  const key = await response.json();
  //   console.log(key);
  return key?.publishableKey;
}
