import { firebase } from '@firebase/app'
import "@firebase/database"
import "@firebase/auth";


export const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

export function isInialized(firebaseConfig) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized
    }
}

export async function signInAnonymously() {
    firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
            // user signed in
            currentUser()
        } else {
            // new user
            await firebase.auth().signInAnonymously()
        }
    })

}

export function currentUser() {
    firebase.auth().onAuthStateChanged(function() {
        return firebase.auth().currentUser
    })
}