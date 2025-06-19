import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome'); 
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      {/* <Text style={styles.text}>Booking Lapangan</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FF', justifyContent: 'center', alignItems: 'center' },
  logo: { width: 250, height: 260, marginBottom: 10 },
  text: { color: '#FFC529', fontSize: 24, fontWeight: 'bold' },
});