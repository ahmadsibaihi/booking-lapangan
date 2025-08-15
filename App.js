import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import AuthScreen from './screens/AuthScreen';
import BookingHistory from './screens/BookingHistory';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';
import PaymentScreen from './screens/PaymentScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFC529',
        tabBarInactiveTintColor: '#858585',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          height: 75,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Beranda') iconName = 'home';
          else if (route.name === 'History') iconName = 'time-outline';
          else if (route.name === 'Payment') iconName = 'card-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="History" component={BookingHistory} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const checkToken = async () => {
    const t = await AsyncStorage.getItem('token');
    setHasToken(!!t);
  };

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      setHasToken(!!t);
      setLoading(false);
    })();
  }, []);
  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasToken ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Detail" component={DetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Auth">
              {(props) => <AuthScreen {...props} onLoginSuccess={checkToken} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}