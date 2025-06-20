// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyArHejjNM3PKeOkFJ8NHJiT17OvkjKdfw0",
  authDomain: "acebase-c32e7.firebaseapp.com",
  projectId: "acebase-c32e7",
  storageBucket: "acebase-c32e7.firebasestorage.app",
  messagingSenderId: "290723910526",
  appId: "1:290723910526:web:07743ff524fe971542d92f",
  measurementId: "G-VYKHXT41LD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
export const db = getFirestore(app);