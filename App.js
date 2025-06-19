import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import BookingHistory from './screens/BookingHistory';
import PaymentScreen from './screens/PaymentScreen'; // Buat file ini
import ProfileScreen from './screens/ProfileScreen'; // Buat file ini
import DetailScreen from './screens/DetailScreen';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#FFC529',
        tabBarInactiveTintColor: '#858585',
        tabBarStyle: { backgroundColor: '#fff', borderTopLeftRadius: 22, borderTopRightRadius: 22, height: 75 },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Beranda') iconName = 'home';
          else if (route.name === 'History') iconName = 'time-outline';
          else if (route.name === 'Payment') iconName = 'card-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="History" component={BookingHistory} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}