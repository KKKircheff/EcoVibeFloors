import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCNQGrPu0ZNN6DM22smsFyWlb9qgLWQsz4",
  authDomain: "ecovibe-floors.firebaseapp.com",
  projectId: "ecovibe-floors",
  storageBucket: "ecovibe-floors.firebasestorage.app",
  messagingSenderId: "351521479122",
  appId: "1:351521479122:web:284498e8c3444b2366100b"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const FIREBASE_STORAGE_BUCKET = "ecovibe-floors.firebasestorage.app";

export default app;