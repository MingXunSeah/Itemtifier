firebase/dbase
/**
 * Database API for firebase to data related operations - fetching, pushing, updating, etc.
 *
 * This is an interface between the official Firebase API and the foodaway app.
 */

import {firestore} from './firebase';
import {getCurrentUserUid} from "./auth";


/* -----------------    User Extension Table     ------------------ */

export const addUserToMailingList = (user) =>
    firestore.collection("users").doc(user.uid).set({displayName: user.displayName, email: user.email, sendMarketingEmails: true});

export const removeUserFromMailingList = (user) =>
    firestore.collection("users").doc(user.uid).set({sendMarketingEmails: false});


/* -----------------    Orders     ------------------ */

/**
 * Adds a new
 * @param order
 * object to the current user's table
 */
export const pushCurrentUserOrder = (order) =>
    firestore.collection("users").doc(getCurrentUserUid()).collection("orders").doc().set(order);

export const getCurrentUserOrder = () =>
    firestore.collection("users").doc(getCurrentUserUid()).collection("orders");
