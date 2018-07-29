import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import * as firebase from 'firebase';
import Dialog from 'react-native-dialog';

export default class Settings extends Component {
	constructor() {
		super();
		this.state = {
			currPassword: "",
			newPassword: "",
			newEmail: "",
			PwdChgDialog: false,
			EmailChgDialog: false
		};
	}
	togglePwdChgDialog = () => {
		this.setState({PwdChgDialog: !this.state.PwdChgDialog});
	};
	toggleEmailChgDialog = () => {
		this.setState({EmailChgDialog: !this.state.EmailChgDialog});
	}

	reauthenticate = (currPassword) => {
		var user = firebase.auth().currentUser;
		// this creates a credential using email and password
		var cred = firebase.auth.EmailAuthProvider.credential(user.email, currPassword);
		// the following function returns a Promise
		return user.reauthenticateWithCredential(cred);
	}
	changePassword = (currPassword, newPassword) => {
		this.reauthenticate(currPassword)
			.then(() => {
				var user = firebase.auth().currentUser;
				user.updatePassword(newPassword)})
			.then(() => alert("Password Changed"))
			.catch((error) => {alert("Error")});
	}
	changeEmail = (currPassword, newEmail) => {
		this.reauthenticate(currPassword)
			.then(() => {
				var user = firebase.auth().currentUser;
				user.updateEmail(newEmail)})
			.then(() => alert("Email Changed"))
			.then(() => {
				var user = firebase.auth().currentUser;
				user.sendEmailVerification();
                alert("A verification email has been sent to your new email!")})
			.catch((error) => {alert("Error")});
	}
	render() {
		return (
			<ImageBackground 
				source={require('./images/bckgrd1.jpg')}
				style={styles.imgBackground}>	
            	<Header
               	backgroundColor= {'#4b0082'}
                 	leftComponent={{icon: 'menu', color: 'white', onPress: () => this.props.navigation.toggleDrawer()}}
                 	centerComponent={{text: 'Settings', style: {color: 'white', fontSize: 23,
                	fontWeight: 'bold', fontFamily: 'helvetica'}}}>
				</Header>
				<View style ={{alignItems: 'center'}}>
					<TouchableOpacity 
						style = {styles.settingsBtn}
						onPress={()=>this.togglePwdChgDialog()}>
						<Text style={styles.settingsText}>Change Password</Text>
					</TouchableOpacity>
					<Dialog.Container visible={this.state.PwdChgDialog}>
						<Dialog.Title> Please enter your current password and new password</Dialog.Title>
						<Dialog.Input placeholder="Current Password" onChangeText={(text)=>this.setState({currPassword: text})}/> 
						<Dialog.Input placeholder="New Password" onChangeText={(text)=>this.setState({newPassword: text})}/>
						<Dialog.Button label="Cancel" color = "#CD5C5C" onPress={()=>this.togglePwdChgDialog()}/>
						<Dialog.Button label="Enter" onPress={()=>this.changePassword(this.state.currPassword,this.state.newPassword)}/> 
					</Dialog.Container>
					<TouchableOpacity
						style = {styles.settingsBtn} 
						onPress={()=>this.toggleEmailChgDialog()}>
						<Text style={styles.settingsText}>Change Email</Text>
					</TouchableOpacity>
					<Dialog.Container visible={this.state.EmailChgDialog}>
						<Dialog.Title> Please enter your current password and new email</Dialog.Title>
						<Dialog.Description> A verification email will be sent shortly after to your new email </Dialog.Description>
						<Dialog.Input placeholder="Current Password" onChangeText={(text)=>this.setState({currPassword: text})}/> 
						<Dialog.Input placeholder="New Email" onChangeText={(text)=>this.setState({newEmail: text})}/>
						<Dialog.Button label="Cancel" color = "#CD5C5C" onPress={()=>this.toggleEmailChgDialog()}/>
						<Dialog.Button label="Enter" onPress={()=>this.changeEmail(this.state.currPassword,this.state.newEmail)}/> 
					</Dialog.Container>		
				</View>					
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	imgBackground: {
		flex: 1,
	},
	settingsBtn: {
		width: '80%',
		height: 50,
		borderRadius: 20,
		backgroundColor: '#2c3e50',
		justifyContent: 'center',
		marginTop: 10,
	},
	settingsText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold'
	}
})
