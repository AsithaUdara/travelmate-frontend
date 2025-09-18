// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC664m17JMNdkWnwKh3mWxVaerf1F3aD6w",
  authDomain: "travelmate-32feb.firebaseapp.com",
  projectId: "travelmate-32feb",
  storageBucket: "travelmate-32feb.firebasestorage.app",
  messagingSenderId: "95875593306",
  appId: "1:95875593306:web:9987b4741fe93439695463",
  measurementId: "G-Y6VR5HCK31"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Get the Auth instance
export const auth = getAuth(app);