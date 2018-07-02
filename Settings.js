import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import {Header, Icon} from 'react-native-elements';

export default class Settings extends Component {
	render() {
		return (
			<ImageBackground source={require('./images/bckgrd1.jpg')}
											style={styles.imgBackground}>	
				<Header 
					backgroundColor = {'#d35400'}
					leftComponent = {{
						icon: 'menu',
						onPress: ()=>this.props.navigation.toggleDrawer()}}>
				</Header>
				<Text> This is the settings page. </Text>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	imgBackground: {
		flex: 1,
	},
})
