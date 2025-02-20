// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6lpO2thLQuMfwr8-OVDFBPxKMd6gzUuA",
  authDomain: "portfolio-8d3d7.firebaseapp.com",
  databaseURL:
    "https://portfolio-8d3d7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "portfolio-8d3d7",
  storageBucket: "portfolio-8d3d7.appspot.com",
  messagingSenderId: "11212169547",
  appId: "1:11212169547:web:a378cf76492fcb1d56c8ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
