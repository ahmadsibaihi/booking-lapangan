import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "expo-router/entry";
import BookingHistory from './screens/BookingHistory';
import DetailScreen from './screens/DetailScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="History" component={BookingHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
