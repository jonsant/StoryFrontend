import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from './src/environments/environment';

const firebaseConfig = {
    "projectId": "storyfrontend-pwa",
    "appId": "1:582938887093:web:d05ac52729d89f6a774ffc",
    "storageBucket": "storyfrontend-pwa.firebasestorage.app",
    "apiKey": "AIzaSyAoyYKjh2Mvr2BZ9PlVASMfz4k0Pffxr9I",
    "authDomain": "storyfrontend-pwa.firebaseapp.com",
    "messagingSenderId": "582938887093",
    "measurementId": "G-1621V7KCKC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get service worker registration
navigator.serviceWorker.getRegistration("./ngsw-worker.js")
    .then((registration) => {
        getToken(messaging,
            {
                vapidKey: environment.vapidKey,
                serviceWorkerRegistration: registration
            }).then((currentToken) => {
                if (currentToken) {
                    // Send token to server and associate with user, and update UI if necessary
                    console.log("currentToken for push notifications: ", currentToken);
                    return;
                }
                // Show UI permission request dialog
                console.log('No registration token available. Request permission to generate one.');

            }).catch((err) => {
                console.log('An error occurred retrieving the token. ', err);
            });
    });