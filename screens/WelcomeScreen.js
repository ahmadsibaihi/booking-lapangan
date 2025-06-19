import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoWrap}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
      </View>
      <View style={styles.bottomContent}>
        <Text style={styles.title}>Booking Lapangan</Text>
        <Text style={styles.subtitle}>
          Temukan & booking lapangan favoritmu untuk bermain bersama teman-teman.
        </Text>

        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.85}>
          <Ionicons name="logo-google" size={22} color="#fff" style={{ marginRight: 14 }} />
          <Text style={styles.googleBtnText}>Daftar dengan Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>atau</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.registerBtn}
          activeOpacity={0.85}
          onPress={() => navigation.replace('Main')}
        >
          <Text style={styles.registerBtnText}>Lanjutkan tanpa akun</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Masuk di sini</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 28,
  },
  logoWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 10,
  },
  logo: { width: 250, height: 250, resizeMode: 'contain' },
  bottomContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  title: {
    color: '#23225C',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: '#727272',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 38,
    lineHeight: 22,
    fontWeight: '500',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 15,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#4285F4',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  googleBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 1,
  },
  dividerText: {
    color: '#727272',
    marginHorizontal: 10,
    fontSize: 15,
    fontWeight: '500',
  },
  registerBtn: {
    backgroundColor: '#23225C',
    borderRadius: 12,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1.5,
    borderColor: '#23225C',
  },
  registerBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },
  loginText: { color: '#727272', fontSize: 15 },
  loginLink: {
    color: '#23225C',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});