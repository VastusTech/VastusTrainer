import firebase from "firebase";

export default function configFirebase() {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyBqng9IIgG21Od6-M7hQorsXvuXvsOQIIM",
        authDomain: "vastus-fit.firebaseapp.com",
        databaseURL: "https://vastus-fit.firebaseio.com",
        projectId: "vastus-fit",
        storageBucket: "vastus-fit.appspot.com",
        messagingSenderId: "308108761903"
    };
    firebase.initializeApp(config);
}