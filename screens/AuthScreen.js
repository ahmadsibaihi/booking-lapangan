import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../backend-api/api';
import { auth } from '../firebaseConfig';


WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen({ navigation, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const BASE_URL =
    Platform.OS === 'web'
      ? 'http://localhost:3000'
      : 'http://10.0.2.2:3000';

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Platform.select({
      ios: '754579541340-kr3oq27g8n1t1ot7b1bbaj3s8h71eocp.apps.googleusercontent.com',
      web: '754579541340-dets7agig6b8h9lfp8f35nsi0cq7rqu0.apps.googleusercontent.com',
    }),
    redirectUri: AuthSession.makeRedirectUri({
      native: 'com.syibaihi.bookinglapangan:/oauth2redirect/google',
      useProxy: true,
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const credential = GoogleAuthProvider.credential(authentication.idToken);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await api.post('/api/users/google', {
            email: user.email,
            name: user.displayName,
            uid: user.uid,
          });
          navigation.replace('Main');
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Login gagal');
        });
    }
  }, [response]);

  const handleManualAuth = async () => {
    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const payload = isLogin 
        ? { email, password }
        : { name, email, password, photo_url: '' };

      const response = await api.post(endpoint, payload);

      if (isLogin) {
        if (response.data.token) {
          await AsyncStorage.setItem('token', response.data.token);
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        }
        Alert.alert(response.data.message);
        navigation.replace('Main'); 
      } else {
        Alert.alert('Registrasi Berhasil', 'Silakan login menggunakan akun Anda.');
        setIsLogin(true); 
      }

    } catch (err) {
      console.error('AUTH ERROR:', err.response?.data || err.message);
      Alert.alert(
        'Gagal',
        err.response?.data?.error || 'Terjadi kesalahan, coba lagi.'
      );
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.formContainer}>
        <Image source={require('../assets/logo1.png')} style={styles.logo} />
        <Text style={styles.title}>{isLogin ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}</Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          textContentType="none"
          importantForAutofill="no"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            textContentType="none"
            importantForAutofill="no"
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="gray" />
          </Pressable>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleManualAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Masuk' : 'Daftar'}</Text>
        </TouchableOpacity>

        {/* Google Login (optional) */}
        {/* 
        <View style={styles.socialButtons}>
          <TouchableOpacity onPress={() => promptAsync()} style={styles.googleButton}>
            <Ionicons name="logo-google" size={24} color="#DB4437" />
          </TouchableOpacity>
        </View>
        */}

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    backgroundColor: '#F1F3F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 14,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    width: '100%',
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  switchText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
});
