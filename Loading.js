import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';

export default class Loading extends Component {
	componentDidMount() {
		firebase.auth().onAuthStateChanged(User => {
			var user = firebase.auth().currentUser;
			this.props.navigation.navigate(User && user.emailVerified ? 'Homepage' : 'Login')
		})

	}
	render() {
		return (
			<View style={styles.container}>
				<Text>Loading</Text>
				<ActivityIndicator size="large" />
			</View>
		);
	}
}

const styles=StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	}
})