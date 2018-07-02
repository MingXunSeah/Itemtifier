import React, { Component } from 'react';
import StackNav from './StackNav';
import * as firebase from 'firebase';

export default class App extends Component {
  componentWillMount() {
    const firebaseConfig = {
      apiKey: "AIzaSyAOHA5aW1x-w8pp2ecGiVLdF7mky40GfRk",
      authDomain: "itemtifier.firebaseapp.com",
      databaseURL: "https://itemtifier.firebaseio.com",
      projectId: "itemtifier",
      storageBucket: "itemtifier.appspot.com",
      messagingSenderId: "995834719496"
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  render() {
    return (
        <StackNav />
    );
  }
} 