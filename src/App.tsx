import {StatusBar, useColorScheme, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {HyperProvider} from 'hyperswitch-sdk-react-native/src';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Section from './Section';
import PaymentScreen from './PaymentScreen';
import HeadlessScreen from './HeadlessScreen';
import {useEffect, useMemo, useState} from 'react';
import getPublishableKey from './utils/getPublishableKey';

const navOptions = ['Payment', 'Headless'];

const HomeScreen = ({navigation}: any) => (
  <Section title="Payment" navigation={navigation} options={navOptions}>
    <PaymentScreen />
  </Section>
);

const Headless = ({navigation}: any) => (
  <Section title="Headless" navigation={navigation} options={navOptions}>
    <HeadlessScreen />
  </Section>
);

const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [publishableKey, setPublishableKey] = useState<string | null>(null);

  // Memoize the backgroundStyle
  const backgroundStyle = useMemo(
    () => ({
      backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }),
    [isDarkMode],
  );

  useEffect(() => {
    const getKey = async () => {
      const key = await getPublishableKey();
      setPublishableKey(key);
    };

    // Fetch publishable key if not already set
    if (!publishableKey) {
      getKey();
    }
  }, [publishableKey]);

  return (
    <HyperProvider publishableKey={publishableKey}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Payment"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Payment" component={HomeScreen} />
          <Stack.Screen name="Headless" component={Headless} />
        </Stack.Navigator>
      </NavigationContainer>
    </HyperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
