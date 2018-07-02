import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import firebase from 'firebase';

export default class Profile extends Component {
	onPressSignOut() {
		firebase.auth()
						.signOut()
						.then(() => this.props.navigation.navigate("Loading"))
						.catch(error => alert(error.toString()))
	}

	render() {
		return (
			<ImageBackground source={require('./images/bckgrd1.jpg')}
											style={styles.imgBackground}>				
   			 <Header 
   			 		backgroundColor= {'#d35400'}
   		      leftComponent={{icon: 'menu', onPress: () => this.props.navigation.toggleDrawer()}}
   		      centerComponent={{text: 'Profile', style: {color: 'white', fontSize: 30,
   		     	 fontWeight: 'bold', fontFamily: 'serif'} }} />
				<View style = {styles.container}>
					<TouchableOpacity
						style={styles.myUploadsContainer}
						onPress={() => this.props.navigation.navigate("Home")}>
						<Text style={styles.myUploadsText}>My Uploads</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.myUploadsContainer}
						onPress={() => this.onPressSignOut()}>
						<Text style={styles.myUploadsText}>Sign Out</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	myUploadsContainer: {
		width: '80%',
		height: 35,
		borderRadius: 100,
		backgroundColor: '#2c3e50',
		justifyContent: 'center',
		marginTop: 10,
	},
	myUploadsText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		fontWeight: '500',
		fontFamily: 'serif',
	},
	imgBackground: {
		flex: 1,
	},
})
