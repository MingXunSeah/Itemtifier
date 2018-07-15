import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Platform,
} from 'react-native';
import GridView from 'react-native-super-grid';
import {Header, Icon, CheckBox} from 'react-native-elements';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import firebaseApp from './firebaseApp.js';

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

// const firebaseConfig = {
//   apiKey: "AIzaSyAOHA5aW1x-w8pp2ecGiVLdF7mky40GfRk",
// 	authDomain: "itemtifier.firebaseapp.com",
// 	databaseURL: "https://itemtifier.firebaseio.com",
// 	projectId: "itemtifier",
// 	storageBucket: "itemtifier.appspot.com",
// 	messagingSenderId: "995834719496"
// }
// const firebaseApp = firebase.initializeApp(firebaseConfig);

var options = {
  title: 'Select Photo',
  storageOptions: {
	skipBackup: true,
	path: 'images'
  }
};

export default class Upload extends Component {
    constructor() {
   	 super();
   	 this.getImage = this.getImage.bind(this);
   	 this.commentInput;
   	 this.titleInput;
   	 this.state={
   		 Title: "",
   		 Comments: "",
   		 image_uri: "",
   		 Bags: false,
   		 Books: false,
   		 Electronics: false,
   		 Fashion: false,
   		 Food: false,
   		 Healthcare: false,
   		 Jewels: false,
   		 Music: false
   	 }
    
    }
  initialiseState() {
		if (this.state.Bags) {this.setState({Bags: false})}
  	if (this.state.Books) {this.setState({Books: false})}
  	if (this.state.Electronics) {this.setState({Electronics: false})}
  	if (this.state.Fashion) {this.setState({Fashion: false})}
  	if (this.state.Food) {this.setState({Food: false})}
  	if (this.state.Healthcare) {this.setState({Healthcare: false})}
  	if (this.state.Jewels) {this.setState({Jewels: false})}
  	if (this.state.Music) {this.setState({Music: false})}
  }

  onPressCheckBox(item) {
  	this.initialiseState()
  	this.setState({[item.key]: !item.boolean})
  }

  getDirectory() {
		if (this.state.Bags) {return 'images/Bags & Shoes/'}
  	if (this.state.Books) {return 'images/Books & Stationery/'}
  	if (this.state.Electronics) {return 'images/Electronics/'}
  	if (this.state.Fashion) {return 'images/Fashion Wear/'}
  	if (this.state.Food) {return 'images/Food/'}
  	if (this.state.Healthcare) {return 'images/Healthcare/'}
  	if (this.state.Jewels) {return 'images/Jewellery & Watches/'}
  	if (this.state.Music) {return 'images/Music & Audio/'}
  }

	checkedCategory() {
		return (this.state.Bags || this.state.Books || this.state.Electronics ||
						this.state.Fashion || this.state.Food || this.state.Healthcare ||
						this.state.Jewels || this.state.Music)
	}

  uploadImage(uri, mime = 'application/octet-stream') {
	return new Promise((resolve, reject) => {
  	const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
  	let uploadBlob = null
  	const directories = this.getDirectory()
  	const storeRef = (Url) => {
 		 let image = {
  			 title: this.state.Title,
  			 url: Url,
  			 comments: this.state.Comments,
         replies: ""
  		 }
  		 firebase.database().ref(directories).push(image);
  	}
  	var date = new Date().getDate();
  	var month = new Date().getMonth() + 1;
  	var year = new Date().getFullYear();
  	const imageRef = firebaseApp.storage().ref(directories).child(this.state.Title + " " + date + "-" + month + "-" + year)
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
      	resolve(url)
      	storeRef(url)
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
    else if (!this.checkedCategory()) {
    	alert("Please select one category.")
    }
  	else if (response.error) {
    	console.log('ImagePicker Error: ', response.error);
  	}
    
  	else {

  	this.uploadImage(response.uri)
    	.then(url => { alert('Uploaded!')
                                	this.setState({image_uri: url})
                                	this.initialiseState()
                                	this.setState({Comments: " "})
                                	this.commentInput.clear()
                           		 		this.titleInput.clear() })
    	.catch(error => console.log(error))

  	}
	});

}

	render() {
    	const categories = [
        	{ title: 'Bags & Shoes', key: 'Bags', boolean: this.state.Bags},
        	{ title: 'Books & Stationery', key: 'Books', boolean: this.state.Books},
        	{ title: 'Electronics', key: 'Electronics', boolean: this.state.Electronics},
        	{ title: 'Fashion Wear', key: 'Fashion', boolean: this.state.Fashion},
        	{ title: 'Food', key: 'Food', boolean: this.state.Food},
        	{ title: 'Healthcare', key: 'Healthcare', boolean: this.state.Healthcare},
        	{ title: 'Jewellery & Watches', key: 'Jewels', boolean: this.state.Jewels},
        	{ title: 'Music & Audio', key: 'Music', boolean: this.state.Music}
    	];
    	return (
        	<ImageBackground source={require('./images/bckgrd1.jpg')}
                                        	style={styles.imgBackground}>
            	<Header
               	backgroundColor= {'#d35400'}
                 	leftComponent={{icon: 'menu', onPress: () => this.props.navigation.toggleDrawer()}}
                 	centerComponent={{text: 'Upload', style: {color: 'white', fontSize: 30,
                	fontWeight: 'bold', fontFamily: 'serif'} }} />
                	<Text style={styles.catTitle}> Choose a category </Text>
            	<GridView
                	itemDimension={130}
                	spacing={10}
                	items={categories}
                	renderItem={item => (
               	 
                	<CheckBox
                    	containerStyle={{
                        	backgroundColor: 'skyblue',
                        	borderRadius: 20
                    	}}
                    	title={item.title}
                    	checked={item.boolean}
                    	onPress={()=> this.onPressCheckBox(item)}
                	/> )}
           	>
           	</GridView>
           	<TextInput
          			 style={styles.commentsText}
          			 placeholder={'Insert title'}
          			 onChangeText={(text)=> this.setState({Title: text})}
          			 ref={input => {this.titleInput = input}} />
           	<TextInput
                style={styles.commentsText}
               	placeholder={'Comments'}
               	onChangeText={(text)=>this.setState({Comments: text})}
               	multiline={true}
          			blurOnSubmit={true}
               	ref={input => {this.commentInput = input}}/>
           	<View style={styles.container}>
                	<TouchableOpacity style={styles.uploadBtn} onPress={this.getImage}>
                    	<Text style={styles.uploadText}> Upload an image </Text>
                	</TouchableOpacity>
            	</View>
        	</ImageBackground>
    	);
	}

}

const styles = StyleSheet.create({
	container: {
    	alignItems: 'center'
	},
	catTitle: {
    	textAlign: 'center',
    	fontWeight: 'bold',
    	fontSize: 20
	},
	uploadBtn: {
    	justifyContent: 'center',
    	backgroundColor: '#232358',
    	alignItems: 'center',
    	width: 200,
    	height: 50,
    	borderRadius: 20,
    	marginBottom: 20

	},
	uploadText: {
    	textAlign: 'center',
    	color: 'white'
	},
	imgBackground: {
    	flex: 1,
	},
	commentsText: {
    	fontSize: 15,
    	fontWeight: '100',
    	backgroundColor: 'rgba(255, 255, 255, 0.5)',
    	marginTop: 5,
    	marginBottom: 5,
    	marginLeft: 10,
    	marginRight: 10,
    	borderRadius: 10
	}
})
