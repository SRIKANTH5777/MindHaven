// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Replace this config with your own from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBXuTrtpJchy_DyxZmXVxqq6mnT66FBNWw",
  authDomain: "bookstore-dab2e.firebaseapp.com",
  projectId: "bookstore-dab2e",
  storageBucket: "bookstore-dab2e.firebasestorage.app",
  messagingSenderId: "900886802861",
  appId: "1:900886802861:web:de2f7005e67be1adbcf124",
  measurementId: "G-CKVD67B0MC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db };
