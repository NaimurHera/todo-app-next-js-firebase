import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAPltEUSwiDfbSeyfb2b4jCWiFP18V2eKA",
  authDomain: "todo-app-next-js.firebaseapp.com",
  projectId: "todo-app-next-js",
  storageBucket: "todo-app-next-js.appspot.com",
  messagingSenderId: "846202361860",
  appId: "1:846202361860:web:7e81aa2b8e677df9f43d51",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
