import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCv7q_JVj_kxqRiCsHYolNi-e8EKFNRT8",
  authDomain: "follow-project-d8710.firebaseapp.com",
  projectId: "follow-project-d8710",
  storageBucket: "follow-project-d8710.firebasestorage.app",
  messagingSenderId: "73784680995",
  appId: "1:73784680995:web:ad795dd2a2e9638ccc0796",
  measurementId: "G-3H2PFB0P6Z"
};

// Uygulamayı başlat
const app = initializeApp(firebaseConfig);

// Servisleri dışa aktar
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
