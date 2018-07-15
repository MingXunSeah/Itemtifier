import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyAOHA5aW1x-w8pp2ecGiVLdF7mky40GfRk",
	authDomain: "itemtifier.firebaseapp.com",
	databaseURL: "https://itemtifier.firebaseio.com",
	projectId: "itemtifier",
	storageBucket: "itemtifier.appspot.com",
	messagingSenderId: "995834719496"
}
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;