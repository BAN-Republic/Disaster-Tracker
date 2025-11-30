// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDl7GWUJ18T2xekeJhzTdCd1EvZya5Fn2Y",
  authDomain: "relief-tracker-b8d40.firebaseapp.com",
  databaseURL: "https://relief-tracker-b8d40-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "relief-tracker-b8d40",
  storageBucket: "relief-tracker-b8d40.firebasestorage.app",
  messagingSenderId: "561391296776",
  appId: "1:561391296776:web:6893946644a350a996ccbd",
  measurementId: "G-22NC48PB02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
// const analytics = getAnalytics(app);
export const auth = getAuth(app);