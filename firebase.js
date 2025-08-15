import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA5XsEtlcdRDiXL3zMtp-6F66mvDLtUq48",
  authDomain: "booking-lapangan-baf7f.firebaseapp.com",
  projectId: "booking-lapangan-baf7f",
  storageBucket: "booking-lapangan-baf7f.appspot.com",
  messagingSenderId: "342157170055",
  appId: "1:342157170055:web:0d395ad21b5fbd996caf22",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
