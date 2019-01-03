import firebase from "firebase";

export default function configFirebase() {
    const config = {
        apiKey: "AIzaSyC6jSlO2wclwzmMJbTmUz2iGjzGg6IkQfM",
        authDomain: "testfirebaseproject-3c457.firebaseapp.com",
        databaseURL: "https://testfirebaseproject-3c457.firebaseio.com",
        projectId: "testfirebaseproject-3c457",
        storageBucket: "testfirebaseproject-3c457.appspot.com",
        messagingSenderId: "716504991782"
    };
    firebase.initializeApp(config);
}