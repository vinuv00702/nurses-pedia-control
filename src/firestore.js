// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyBOgLSZcPe4Um5lU-zqNYIHDI4midZVr1c",
  authDomain: "nursespedia-a9530.firebaseapp.com",
  projectId: "nursespedia-a9530",
  storageBucket: "nursespedia-a9530.appspot.com",
  messagingSenderId: "93565406681",
  appId: "1:93565406681:web:6eecab9c378fa9c8979dc8",
  measurementId: "G-X97DY3RGWB",
});

const db = getFirestore();

export default db;
