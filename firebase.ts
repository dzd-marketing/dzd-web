
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration for DzD Marketing
// Replace these placeholders with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyC28aF8yv5f0jEOP2XnnYbQkkdj8ehUpxo",
  authDomain: "dzd-marketing.firebaseapp.com",
  projectId: "dzd-marketing",
  storageBucket: "dzd-marketing.firebasestorage.app",
  messagingSenderId: "784291112534",
  appId: "1:784291112534:web:1c499259b8bcb82faafdf7",
  measurementId: "G-46S7J6JFP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
