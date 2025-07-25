// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import dotenv from "dotenv";
// dotenv.config();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexus-43eee.firebaseapp.com",
  projectId: "nexus-43eee",
  storageBucket: "nexus-43eee.appspot.com",
  messagingSenderId: "466591261027",
  appId: "1:466591261027:web:21c6cc81b7795c10aaf356",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
