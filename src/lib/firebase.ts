
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBCSw3eHDk7EPjK4b7XmMUO3W01hfAY1Qc",
  authDomain: "visagetime-dbcdb.firebaseapp.com",
  databaseURL: "https://visagetime-dbcdb-default-rtdb.firebaseio.com",
  projectId: "visagetime-dbcdb",
  storageBucket: "visagetime-dbcdb.firebasestorage.app",
  messagingSenderId: "806138883610",
  appId: "1:806138883610:web:2b638b6c7ab2fac5582ba3",
  measurementId: "G-ZZRW6EFLJQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

