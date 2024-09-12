import {sessionParams, useHyper} from 'hyperswitch-sdk-react-native/src';
import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import fetchPaymentParams from './utils/fetchPaymentParams';
import Button from './Components/Button';
type Option<T> = T | null;
export default function HeadlessScreen() {
  const {
    initPaymentSession,
    getCustomerSavedPaymentMethods,
    getCustomerDefaultSavedPaymentMethodData,
    getCustomerLastUsedPaymentMethodData,
    getCustomerSavedPaymentMethodData,
    confirmWithCustomerDefaultPaymentMethod,
    confirmWithCustomerLastUsedPaymentMethod,
    confirmWithCustomerPaymentToken,
  } = useHyper();
  const [savedPaymentSession, setPaymentSession] =
    React.useState<Option<sessionParams>>(null);
  const [showLoader, setShowLoader] = React.useState(false);
  const [response, setResponse] = React.useState('');
  const [paymentToken, setPaymentToken] = React.useState('');
  let initialisePaymentSession = async () => {
    setShowLoader(true);
    const {clientSecret} = await fetchPaymentParams();

    const params = await initPaymentSession({
      clientSecret: clientSecret,
    });
    const savedPaymentSession = await getCustomerSavedPaymentMethods(params);
    setPaymentSession(savedPaymentSession);
    setShowLoader(false);
    setResponse('');
  };

  let getDefaultCustomerPaymentMethod = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const pmObj = await getCustomerDefaultSavedPaymentMethodData(
        savedPaymentSession,
      );
      if (pmObj?.paymentToken) {
        setPaymentToken(pmObj?.paymentToken);
      }
      setResponse(JSON.stringify(pmObj));
    }
    setShowLoader(false);
  };

  let getCustomerLastUsedPaymentMethod = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const pmObj = await getCustomerLastUsedPaymentMethodData(
        savedPaymentSession,
      );

      setResponse(JSON.stringify(pmObj));
    }
    setShowLoader(false);
  };

  let getAllSavedPaymentMethodData = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const savedPaymentMethodsArray = await getCustomerSavedPaymentMethodData(
        savedPaymentSession,
      );

      setResponse(`{${JSON.stringify(savedPaymentMethodsArray[0])}....}`);
    }
    setShowLoader(false);
  };

  let confirmWithCustomerDefaultPM = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const response = await confirmWithCustomerDefaultPaymentMethod({
        sessionParams: savedPaymentSession,
        cvc: '124',
      });

      setResponse(JSON.stringify(response));
      setShowLoader(false);
      if (response.type_ !== 'failed') setPaymentSession(null);
    }
  };

  let confirmWithLastUsedPM = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const response = await confirmWithCustomerLastUsedPaymentMethod({
        sessionParams: savedPaymentSession,
      });

      setResponse(JSON.stringify(response));
      setShowLoader(false);
      if (response.type_ !== 'failed') setPaymentSession(null);
    }
  };

  let confirmWithPaymentToken = async () => {
    setShowLoader(true);

    if (savedPaymentSession != null) {
      const response = await confirmWithCustomerPaymentToken({
        sessionParams: savedPaymentSession,
        cvc: '424',
        paymentToken: paymentToken,
      });

      setResponse(JSON.stringify(response));
      setShowLoader(false);
      if (response.type_ !== 'failed') setPaymentSession(null);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        buttonText={'Init Session'}
        disabled={showLoader}
        callback={initialisePaymentSession}
      />
      <Text style={styles.text}>{response}</Text>
      <ScrollView>
        <Text style={styles.text}>Load Customer Payment Data Using</Text>
        <Button
          loading={showLoader}
          disabled={!savedPaymentSession}
          buttonText="Default Saved Data"
          callback={getDefaultCustomerPaymentMethod}
        />
        <Button
          loading={showLoader}
          disabled={!savedPaymentSession}
          buttonText="Last Used Saved Data"
          callback={getCustomerLastUsedPaymentMethod}
        />
        <Button
          buttonText="Get All Saved Payments Data"
          loading={showLoader}
          disabled={!savedPaymentSession}
          callback={getAllSavedPaymentMethodData}
        />
        <Text style={styles.text}>Confirm Customers Data</Text>
        <Button
          loading={showLoader}
          disabled={!savedPaymentSession}
          buttonText="Default Saved Method"
          callback={confirmWithCustomerDefaultPM}
        />
        <Button
          loading={showLoader}
          disabled={!savedPaymentSession}
          buttonText="Last Used Saved Method"
          callback={confirmWithLastUsedPM}
        />
        <Button
          buttonText="Payment Token Method"
          loading={showLoader}
          disabled={!savedPaymentSession}
          callback={confirmWithPaymentToken}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
  },
  wrapper: {
    alignItems: 'center',
    gap: 10,
  },
  text: {
    fontSize: 18,
    paddingVertical: 10,
  },
});
