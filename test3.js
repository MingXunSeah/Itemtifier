firebase/firebase
/**
 * Configuration for firebase and firebase instantiation.
 */

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

/** 1. Config parameters retrieved from firebase console */
const config = {
    apiKey: "AIzaSyC3734ztKM_iO0woHPO-rqmMb0ZEIMWEHg",
    authDomain: "fooodtastic.firebaseapp.com",
    databaseURL: "https://fooodtastic.firebaseio.com",
    projectId: "fooodtastic",
    messagingSenderId: "959054096696"
};

/** 2. Initialize application using the provided {@see config} */
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

/** 3. Retrieve and make available
 * {@code firebase.auth()} module,
 * {@code firebase.database()} module,
 * {@code firebase.auth} namespace,
 * {@code firebase.database} namespace,
 *  to other modules in application */
const auth = firebase.auth();
const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});
const authServices = firebase.auth;

export {
    auth,
    firestore,
    authServices
};
