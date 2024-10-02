import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBnX3F_jEXU0zF7KVxzRQJCMYdHsgVq3Ss',
  authDomain: 'expo-book-radio.firebaseapp.com',
  projectId: 'expo-book-radio',
  storageBucket: 'expo-book-radio.appspot.com',
  messagingSenderId: '773425661403',
  appId: '1:773425661403:web:46be9988eac690173ad3fe',
  measurementId: 'G-P6HDXPPFGW',
}

const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const firebaseDB = getFirestore(firebaseApp)
export const firebaseStorage = getStorage(firebaseApp)
export default firebaseApp
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
