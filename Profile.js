import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	ImageBackground,
	Image,
	Platform,
	TextInput
} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import firebaseApp from './firebaseApp.js';
import Dialog from 'react-native-dialog';
import Loader from './Loader.js';

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
			signoutDialog: false,
			usernameDialog: false,
			loading: false,
			nameInput: "Default",
			name: "",
			dpURL:
			"https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3"
		}
	}
	componentDidMount() {
		var user = firebase.auth().currentUser;
		if(user != null) {
			var uid = user.uid;
			const ref = firebase.database().ref('/ProfilePics').child(uid);
			ref.on('value', this.gotData.bind(this));
		}
	}

	gotData = (data) => {
		if(data.exists()) {
			var info = data.val();
			this.setState({dpURL: info.URL});
			this.setState({name: info.Username});
			console.log(this.state.nameInput);
			console.log(info.URL);
		}
	}

	onPressSignOut() {
		firebase.auth()
		.signOut()
		.then(() => this.props.navigation.navigate("Loading"))
		.then(() => this.toggleSignout())
		.catch(error => alert(error.toString()))
	}

	updateProfile = (url) => {
		var Username = this.state.nameInput;
		var uid = firebase.auth().currentUser.uid;
		var userProfile = {
			URL: url,
			Username: Username
		}

		firebase.database().ref('/ProfilePics').child(uid).set(userProfile)
		.then(()=> {this.setState({name: Username})
			this.togglenameDialog()});
		alert("Name changed!");
	}

	updateProfilePic = (url) => {
		if (this.state.name != "") {
			var Username = this.state.name;
		} else {
			var Username = "Default";
		}
		var uid = firebase.auth().currentUser.uid;
		var userProfile = {
			URL: url,
			Username: Username
		}

		firebase.database().ref('/ProfilePics').child(uid).set(userProfile)
		.then(()=> {this.setState({name: Username})});
		alert("Profile picture changed!");
	}

	async uploadImage(uri, mime = 'application/octet-stream') {
		this.setState({
			loading:true
		})

		return new Promise((resolve, reject) => {
			const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
			let uploadBlob = null
			var uid = firebase.auth().currentUser.uid;

			const imageRef = firebaseApp.storage().ref("/ProfilePic").child(uid);
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
				this.updateProfilePic(url)
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
				.then(url => { this.setState({loading: false})})
				.catch(error => console.log(error))
			};
		});
	}

	togglenameDialog = () => {
		this.setState({usernameDialog: !this.state.usernameDialog});
	}
	toggleSignout = () => {
		this.setState({signoutDialog: !this.state.signoutDialog});
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
			<Loader loading={this.state.loading} />
			<View style = {styles.container}>
				<TouchableOpacity style = {styles.profileImage} onPress = {() => this.getImage()}>
					<Image style = {styles.profileImage} source={{uri: this.state.dpURL}} />
				</TouchableOpacity>
				{this.state.name != "" ? 
					<Text style = {{fontWeight: 'bold',
													fontSize: 20,
													color: 'black',
													marginTop: 8}}> {this.state.name} 
					</Text> :
					<Text style = {{fontWeight: 'bold',
													fontSize: 20,
													color: 'black',
													marginTop: 8}}> {this.state.nameInput} 
					</Text> 
				}
				<TouchableOpacity style = {styles.usernameBtn} 
													onPress = {() => this.togglenameDialog()}> 
				<Text style = {styles.changenameText}> Change username </Text>
				</TouchableOpacity>		
				<Dialog.Container visible = {this.state.usernameDialog}>
					<Dialog.Title> Enter new name </Dialog.Title>
					<Dialog.Input placeholder={"New username"} onChangeText={(text) =>this.setState({nameInput: text})} />
					<Dialog.Button label="Cancel" color="#CD5C5C" onPress={()=>this.togglenameDialog()}/>
					<Dialog.Button label="Enter" onPress={()=>this.updateProfile(this.state.dpURL)}/>
				</Dialog.Container>			
				<TouchableOpacity style={styles.myUploadsContainer}
													onPress={() => this.props.navigation.navigate("MyUploads")}>
					<Text style={styles.myUploadsText}>My Uploads</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.myUploadsContainer}
													onPress={() => this.toggleSignout()}>
					<Text style={styles.myUploadsText}>Sign Out</Text>
				</TouchableOpacity>
				<Dialog.Container visible = {this.state.signoutDialog}>
					<Dialog.Title> Are you sure you want to sign out? </Dialog.Title>
					<Dialog.Button label="Cancel" color="#CD5C5C" onPress={()=>this.toggleSignout()}/>
					<Dialog.Button label="Confirm" onPress={()=>this.onPressSignOut()}/>
				</Dialog.Container>
			</View>
			</ImageBackground>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	myUploadsContainer: {
		width: '80%',
		height: 50,
		borderRadius: 20,
		backgroundColor: '#2c3e50',
		justifyContent: 'center',
		marginTop: 10,
	},
	myUploadsText: {
		textAlign: 'center',
		color: 'white',
		fontSize: 15,
		fontWeight: 'bold'
		//fontFamily: 'serif',
	},
	imgBackground: {
		flex: 1,
	},
	profileImage: {
		height: 150,
		width: 150,
		borderRadius: 200
	},
	usernameBtn: {
		alignItems: 'center',
		justifyContent: 'center',
		width: '50%',
		height: 45,
		borderRadius: 20,
		marginTop: 10,
		backgroundColor: '#e6e8fb'		
	},
	changenameText: {
		fontSize: 15,
	}
});
