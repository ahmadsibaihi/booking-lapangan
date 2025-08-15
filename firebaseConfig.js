import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth
} from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyA5XsEtlcdRDiXL3zMtp-6F66mvDLtUq48",
  authDomain: "booking-lapangan-baf7f.firebaseapp.com",
  projectId: "booking-lapangan-baf7f",
  storageBucket: "booking-lapangan-baf7f.appspot.com",
  messagingSenderId: "342157170055",
  appId: "1:342157170055:web:0d395ad21b5fbd996caf22",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (e) {
    auth = getAuth(app);
  }
}

export { auth };

