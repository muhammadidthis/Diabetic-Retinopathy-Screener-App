import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0TQ40fYZJXAe0ciZSxdFF7AnlJMl0vuE",
  authDomain: "dr-screener.firebaseapp.com",
  projectId: "dr-screener",
  storageBucket: "dr-screener.firebasestorage.app",
  messagingSenderId: "478582494264",
  appId: "1:478582494264:web:d9cf447402fa9d132bc2cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence for React Native
// Use getAuth if already initialized (hot reload), otherwise initializeAuth
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} catch (error: any) {
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
  } else {
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

export { app, auth, db, storage };
