import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ImageBackground,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import * as firebase from 'firebase';
import Dialog from 'react-native-dialog';

export default class Login extends Component {
	state = {
		email: '',
		password: '',
		dialog: false
	}
  onPressSignIn() {
  		try {
  			firebase.auth()
  							.signInWithEmailAndPassword(this.state.email, this.state.password)
  							.then(() => {
                  				var user = firebase.auth().currentUser;
                  				if(!user.emailVerified) {
                  					alert("Your email is not yet verified!");             					
                  				}
                  				else {
                  					this.props.navigation.navigate("Loading");
                  				}


                  			}).then(() => {
                  				this.username.clear();
                  				this.password.clear();
                  			})
  							.catch(error => alert(error.toString()))
  							.then(() => {
  								this.username.clear();
                  				this.password.clear();
  							})

  			console.log("Logged In!")
  		} catch (error) {
  			alert("Authentication failed. Invalid email or password.")
  		}
  }
  onPressForget() {
  	firebase.auth().sendPasswordResetEmail(this.state.email)
  	.then(()=>{
  		alert("An email has been sent to reset the password");
  		this.username.clear();
  		this.password.clear();
  		this.toggleDialog();
  	})
  	.catch(error => alert(error.toString()))
  	.then(() => {
  		this.username.clear();
  		this.password.clear();
  		this.toggleDialog();
  	})
  }

  toggleDialog() {
  	this.setState({Dialog: !this.state.Dialog})
  	this.username.clear();
  	this.password.clear();
  } 

	render() {
		return (
			<ImageBackground source={require('./images/bckgrd.jpg')}
											style={styles.imgBackground}>
				<Text style={styles.title}>Itemtifier</Text>
				<View style={styles.container}>
					<TextInput 
						placeholder="Email"
						ref={input => this.username = input}
						style={styles.credentials}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						onChangeText={email => this.setState({ email })}
						value={this.state.email}
					/>
					<TextInput 
						placeholder="Password"
						ref={input => this.password = input}
						secureTextEntry
						style={styles.credentials}
						onChangeText={password => this.setState({ password })}
						value={this.state.password}
					/>
					<TouchableOpacity 
						style={styles.loginContainer}
						onPress={() => this.onPressSignIn()}>
						<Text style={styles.loginText}>LOGIN</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.registerContainer}
						onPress={() => this.props.navigation.navigate("Signup")}>
						<Text style={styles.registerText}>REGISTER</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.forgetpw}
						onPress={() => this.toggleDialog()}>
						<Text style={styles.forgetText}>Forgot your password?</Text>
					</TouchableOpacity>
					<Dialog.Container visible={this.state.Dialog}>
						<Dialog.Title>Enter your email</Dialog.Title>
						<Dialog.Input placeholder="Email" onChangeText={text=>this.setState({email: text})}/>
						<Dialog.Button label="Cancel" color="#CD5C5C" onPress={()=>this.toggleDialog()}/>
						<Dialog.Button label="Submit" onPress={()=>this.onPressForget()}/>
					</Dialog.Container>
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
	title: {
		fontSize: 65,
		textAlign: 'center',
		color: 'white',
		fontWeight: 'bold',
		fontFamily: 'helvetica',
		paddingBottom: 80
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
	loginContainer: {
		backgroundColor: '#f1c40f',
		paddingVertical: 12,
		opacity: 0.9,
		marginBottom: 10,
	},
	loginText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		fontWeight: '500'
	},
	registerContainer: {
		backgroundColor: '#2980b9',
		paddingVertical: 12,
		opacity: 0.9
	},
	registerText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		fontWeight: '500'
	},
	forgetpw: {
		opacity: 1
	},
	forgetText: {
		fontSize: 15,
		textAlign: "center",
		color: "white"
	}
});