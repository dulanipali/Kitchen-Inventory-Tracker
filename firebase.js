// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Hiding API key
require('dotenv').config();
console.log(process.env);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "pantryapp-f7a65.firebaseapp.com",
  projectId: "pantryapp-f7a65",
  storageBucket: "pantryapp-f7a65.appspot.com",
  messagingSenderId: "960119451310",
  appId: "1:960119451310:web:2426f83b7352da4bbfc73f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export { app, firestore }