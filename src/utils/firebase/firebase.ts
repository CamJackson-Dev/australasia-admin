import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/functions";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let firebaseApp;

// Initialize Firebase only on the client side
firebaseApp = firebase.initializeApp(firebaseConfig);
// firebase.analytics();

firebase.auth().languageCode = "it";
firebase.auth().useDeviceLanguage();

// firebase.analytics().logEvent("notification_received");

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const functions = firebase.functions();

export const provider =
    typeof window !== "undefined"
        ? new firebase.auth.GoogleAuthProvider()
        : null;
if (provider) {
    provider.setCustomParameters({ prompt: "select_account" });
}

export const facebookProvider =
    typeof window !== "undefined"
        ? new firebase.auth.FacebookAuthProvider()
        : null;
if (facebookProvider) {
    facebookProvider.setCustomParameters({ prompt: "select_account" });
}

// This useEffect hook ensures that Firebase is initialized only on the client side
export const useFirebaseInitialization = () => {
    useEffect(() => {
        if (!firebase.apps.length && typeof window !== "undefined") {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            firebase.analytics();
            firebase.auth().languageCode = "it";
            firebase.auth().useDeviceLanguage();
            firebase.analytics().logEvent("notification_received");
        }
    }, []);
};

export default firebase;
