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
    apiKey: "AIzaSyArXWZyHkjvAFvKkCzEPAQhTcuQC4eQF0E",
    authDomain: "triden-workout-app.firebaseapp.com",
    projectId: "triden-workout-app",
    storageBucket: "triden-workout-app.appspot.com",
    messagingSenderId: "112246491597",
    appId: "1:112246491597:web:3e8ecd1d7d16bc25559c84",
    measurementId: "G-N8TFNVM0CM",
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
