// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-ef684.firebaseapp.com",
  projectId: "mern-auth-ef684",
  storageBucket: "mern-auth-ef684.appspot.com",
  messagingSenderId: "472110318085",
  appId: "1:472110318085:web:193eb6f03cce4e01a2126c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
