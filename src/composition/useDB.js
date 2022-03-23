// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5_UgA0JEDayMCgCCbMfOM3ngHUkDAL1c",
  authDomain: "can-i-be-called.firebaseapp.com",
  databaseURL:
    "https://can-i-be-called-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "can-i-be-called",
  storageBucket: "can-i-be-called.appspot.com",
  messagingSenderId: "784590767148",
  appId: "1:784590767148:web:063021c9ee27736a077d89",
  measurementId: "G-X1Y1F6RX0H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
