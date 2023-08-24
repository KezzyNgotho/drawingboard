import firebase from'@react-native-firebase/app';
import '@react-native-firebase/auth';;
import '@react-native-firebase/firestore' ;// Import other Firebase services as needed

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCRu9N733KvoeiD5rYG64t_s9ntlCW_Lts",
  authDomain: "zooo-ea61e.firebaseapp.com",
  databaseURL: "https://zooo-ea61e-default-rtdb.firebaseio.com",
  projectId: "zooo-ea61e",
  storageBucket: "zooo-ea61e.appspot.com",
  messagingSenderId: "444192997236",
  appId: "1:444192997236:web:cb3170a07fa6b3714bb621",
  measurementId: "G-7ESRWWLHP0"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase;
