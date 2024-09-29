import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyBJVxsWnoNJJHWIPddPBCkgZMAOMZ89RXE",
    authDomain: "clarifin-30cbe.firebaseapp.com",
    projectId: "clarifin-30cbe",
    storageBucket: "clarifin-30cbe.appspot.com",
    messagingSenderId: "475555622672",
    appId: "1:475555622672:web:79d4baa228be798d15ff95",
    measurementId: "G-Q69SLQELK6"
}
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export {auth, db, storage};
