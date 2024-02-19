import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1pJPheB4tk7KGjpG6eLGXjbDUIWDlZOc",
  authDomain: "house-marketplace-app-21487.firebaseapp.com",
  projectId: "house-marketplace-app-21487",
  storageBucket: "house-marketplace-app-21487.appspot.com",
  messagingSenderId: "1049445343922",
  appId: "1:1049445343922:web:85ac9f676f258adfcc1fab",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
