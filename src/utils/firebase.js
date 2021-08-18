import firebase from "firebase";

if (!firebase.apps.length) {
  const firebaseApp = firebase.initializeApp({
    // apiKey: "AIzaSyAJx0wV0LzkdSCOKdEfsh7h7W7D4NsQIq4",
    // authDomain: "workout-app-348d3.firebaseapp.com",
    // projectId: "workout-app-348d3",
    // storageBucket: "workout-app-348d3.appspot.com",
    // messagingSenderId: "802693289796",
    // appId: "1:802693289796:web:b9155b444af6d47375a911",
    // measurementId: "G-TQ3DQYH4GN",

    apiKey: "AIzaSyAecztLDJbsGrd47BLfKsP0DSMHCTKCI9E",
    authDomain: "wellzap-22b06.firebaseapp.com",
    projectId: "wellzap-22b06",
    storageBucket: "wellzap-22b06.appspot.com",
    messagingSenderId: "270026129611",
    appId: "1:270026129611:web:90f59d9c8e86c5c5c51b4e",
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
