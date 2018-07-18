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

export default class Settings extends Component {
	changeUsername = () => {
		var uid = firebase.auth().currentUser.uid;

	}
	render() {
		return (
			<ImageBackground 
				source={require('./images/bckgrd1.jpg')}
				style={styles.imgBackground}>	
				<Header 
					backgroundColor = {'#d35400'}
					leftComponent = {{
						icon: 'menu',
						onPress: ()=>this.props.navigation.toggleDrawer()}}
						centerComponent={{text: 'Settings', style: {color: 'white', fontSize: 30,
  		 		      fontWeight: 'bold', fontFamily: 'serif'} }}>
				</Header>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	imgBackground: {
		flex: 1,
	},
	settingsTitle: {
		fontWeight: 'bold',
		fontSize: 20
	},
	btn: {
		backgroundColor: '#e6e8fa',
		flex: 0.1
	},
	changenameText: {
		color: 'black',
		fontWeight: 'bold',
		fontSize: 25
	}
})
