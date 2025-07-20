import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const  config = {
  apiKey: "AIzaSyAd0K-Y8AnNXSJXQRZeQtphPZQPOkSAgmo",
  authDomain: "foodplanet-82388.firebaseapp.com",
  projectId: "foodplanet-82388",
  storageBucket: "foodplanet-82388.firebasestorage.app",
  messagingSenderId: "898880937459",
  appId: "1:898880937459:web:2c23717c73ffdf2eef8686",
  measurementId: "G-CPEP0M2EXG"
};
const app = initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);  // Initialize storage

export { app, db, storage };
