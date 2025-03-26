// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAkGnIEDt65IftyA7g5QJYyqEERqoHGjo",
  authDomain: "possystem-mobile.firebaseapp.com",
  projectId: "possystem-mobile",
  storageBucket: "possystem-mobile.firebasestorage.app",
  messagingSenderId: "780292225086",
  appId: "1:780292225086:web:bfca6c3f6ed5c48a76796f",
  measurementId: "G-0X8BB7GV6L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
