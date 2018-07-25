import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default class Register extends Component {

    state = {
      email: '',
      password: '',
      username: "Default",
      dpURL:
        "https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3"
    }

  onPressSignUp() {
    try {
        const firebase = require("firebase")
        firebase.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(() => {
                  console.log("exit1")
                  var user = firebase.auth().currentUser;
                  var userProfile = {
                    URL: this.state.dpURL,
                    Username: this.state.username
                  }
                  firebase.database().ref('/ProfilePics').child(user.uid).set(userProfile)
                          .then(() => {
                            var user = firebase.auth().currentUser;
                            user.sendEmailVerification()
                                .then(() => firebase.auth().signOut());
                            alert("A verification email has been sent to your email!")
                          })
                })
                .catch(error => alert(error.toString()))                
    } catch (error) {
      console.log(error.toString())
    }
  }

  render() {
    return (
      <ImageBackground source={require('./images/bckgrd.jpg')}
                      style={styles.imgBackground}>
        <View style={styles.container}>
          <TextInput 
            placeholder="Enter email"
            ref={input => this._username = input}
            style={styles.credentials}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={email => this.setState({ email })}
            value={this.state.email}
          />
          <TextInput 
            placeholder="Enter password"
            ref={input => this._password = input}
            secureTextEntry
            style={styles.credentials}
            onChangeText={password => this.setState({ password })}
            value={this.state.password}
          />
          <TouchableOpacity 
            style={styles.signUpContainer}
            onPress={() => this.onPressSignUp()}>
            <Text style={styles.signUpText}>SIGN UP</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backContainer}
            onPress={() => this.props.navigation.navigate("Login")}>
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20
  },
  credentials: {
    height: 50,
    fontSize: 15,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  signUpContainer: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    opacity: 0.9
  },
  signUpText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '500'
  },
  backContainer: {
    backgroundColor: '#f1c40f',
    paddingVertical: 12,
    opacity: 0.9,
    marginTop: 10,
  },
  backText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 15,
    fontWeight: '500'
  },
});