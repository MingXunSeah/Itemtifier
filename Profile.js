import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import firebaseApp from './firebaseApp.js';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

var options = {
  title: 'Select Photo',
  storageOptions: {
	skipBackup: true,
	path: 'images'
  }
};

export default class Profile extends Component {
	constructor() {
		super();
		this.getImage = this.getImage.bind(this);

		this.state = {
			dpURL:
			"https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3"
		}
	}
	componentDidMount() {
		var user = firebase.auth().currentUser;
		var uid = user.uid;
		console.log(uid)
    	const ref = firebase.database().ref('/ProfilePics').child(uid);
    	ref.on('value', this.gotData.bind(this));
    }
    gotData = (data) => {
    	if(data.exists()) {
    		var info = data.val();
    		this.setState({dpURL: info});
    	}
    }

	onPressSignOut() {
		firebase.auth()
						.signOut()
						.then(() => this.props.navigation.navigate("Loading"))
						.catch(error => alert(error.toString()))
	}

	uploadImage(uri, mime = 'application/octet-stream') {
	return new Promise((resolve, reject) => {
  	const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
  	let uploadBlob = null
  	var user = firebase.auth().currentUser;
  	var uid = user.uid;

  	const imageRef = firebaseApp.storage().ref("/DefaultProfilePic").child(uid);
  	fs.readFile(uploadUri, 'base64')
    	.then((data) => {
      	return Blob.build(data, { type: `${mime};BASE64` })
    	})
    	.then((blob) => {
      	uploadBlob = blob
      	return imageRef.put(blob, { contentType: mime })
    	})
    	.then(() => {
      	uploadBlob.close()
      	return imageRef.getDownloadURL()
    	})
    	.then((url) => {
      	firebase.database().ref('/ProfilePics').child(uid).set(url)
      	resolve(url)
    	})
    	.catch((error) => {
      	reject(error)
  	})
	})
  }
	getImage(){
		ImagePicker.showImagePicker(options, (response) => {
  			console.log('Response = ', response);

  			if (response.didCancel) {
    			console.log('User cancelled image picker');
  			}
  			else if (response.error) {
    			console.log('ImagePicker Error: ', response.error);
  			}
  			else {
  				this.uploadImage(response.uri)
    				.then(url => { alert('Uploaded!')
    				.catch(error => console.log(error))
					});
			}
		});
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
					<TouchableOpacity style = {styles.profileImage} onPress = {() => this.getImage()}>
						<Image style = {styles.profileImage} source={{uri: this.state.dpURL}} />
					</TouchableOpacity>
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
	profileImage: {
		height: 200,
		width: 200,
		borderRadius: 200
	}
});
