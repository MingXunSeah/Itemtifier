import React, { Component } from 'react';
import {View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList, Platform} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import firebaseApp from './firebaseApp.js';
import Dialog from 'react-native-dialog';
import Loader from './Loader.js';
import MyUploads from './MyUploads';

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

export default class Edit extends Component {
    constructor() {
      super();

      this.reply;
      this.state ={
       replyInput: "",
       Array: [],
       dpURL: "https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3",
       username: "default",
       newTitle: "",
       titleChgDialog: false,
       title: "",
       newComments: "",
       CmmtsChgDialog: false,
       comments: "",
      loading: false,
      name: "",
      url: "",
      currCategory: "",
      }
    }

  toggleTitleChgDialog() {
    this.setState({titleChgDialog: !this.state.titleChgDialog});
  }

  changeTitle(newTitle, params) {
    firebase.database().ref(params.category).child(params.uid).child(params.name).update({title: newTitle})
      .then(() => {this.toggleTitleChgDialog()
                    this.setState({title: newTitle})
                        alert("Title Changed")})
      .catch((error) => {alert("Error")});
  }

  toggleCmmtsChgDialog() {
    this.setState({CmmtsChgDialog: !this.state.CmmtsChgDialog});
  }

  changeComments(newComments, params) {
    firebase.database().ref(params.category).child(params.uid).child(params.name).update({comments: newComments})
      .then(() => {this.toggleCmmtsChgDialog()
                    this.setState({comments: newComments})
                        alert("Comments Changed")})
      .catch((error) => {alert("Error")});
  }

    componentDidMount() {
      const {params} = this.props.navigation.state
      this.state.title = params.title
      this.state.comments = params.comments
      this.state.name = params.name
      this.state.url = params.url
      const ref = firebase.database().ref(params.category).child(params.uid).child(params.name).child('/replies');
      ref.on('value', this.gotData.bind(this)); 
      var uid = firebase.auth().currentUser.uid;
      const profileRef = firebase.database().ref('ProfilePics').child(uid);
      profileRef.on('value', this.profileData.bind(this));
    }
   
    profileData = (data) => {      
      if(data.exists()) {
        var info = data.val();
        this.setState({dpURL: info.URL});
        this.setState({username: info.Username});
      }
    }    

    gotData = (data) => {
      if(data.exists()) {
          var info = data.val();
          var keys = Object.keys(info);
          var dataArray = [];
          for(var i=0;i<keys.length;i++) {
            var reply = info[keys[i]].replyObject.Reply;
            var URL = info[keys[i]].replyObject.URL;
            var username = info[keys[i]].replyObject.Username;
            var objectID = keys[i];
            var UID = info[keys[i]].replyObject.UID;
            var Entry = {
              reply: reply,
              URL: URL,
              username: username,
              objectID: objectID,
              UID: UID
            }
            dataArray.push(Entry)
          }
          this.setState({Array: dataArray});  
      }
    }

  async uploadImage(uri, mime = 'application/octet-stream') {
    this.setState({
      loading:true
    })
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    let uploadBlob = null
    var uid = firebase.auth().currentUser.uid;
    var category = this.state.currCategory;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    const imageRef = firebaseApp.storage().ref(uid).child(category).child(this.state.title + " " + date + "-" + month + "-" + year)
    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        console.log("exit4")
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        console.log("exit5")
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        console.log("exit6")
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        console.log("exit7")
        firebase.database().ref(category).child(uid).child(this.state.name).update({url: url})
        alert("Image changed!");
        resolve(url)
      })
      .catch((error) => {
        reject(error)
    })
  })
  }

  getImage(params){
    ImagePicker.showImagePicker(options, (response) => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        }
        else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        }
        else {
          this.setState({currCategory: params.category})
          this.uploadImage(response.uri)
              .then(url => { this.setState({url: url})})
              .then(() => {this.setState({loading: false})})
              .catch(error => console.log(error))
          };
      });
  }

    render() {
      const {params} = this.props.navigation.state
      return (
         <ImageBackground source={require('./images/bckgrd1.jpg')}                   
          style={styles.imgBackground}>   
          <Header
              backgroundColor= {'#d35400'}
              leftComponent={{icon:'chevron-left', onPress: () => {this.props.navigation.goBack()}}}
              centerComponent={{text: 'Itemtifier', style: {color: 'white', fontSize: 30,
                fontWeight: 'bold', fontFamily: 'serif'} }}
          />
          <Loader loading={this.state.loading} />
        <Image style={styles.img} source= {{uri: this.state.url}}></Image>
          <TouchableOpacity style={styles.editImg}
                            onPress = {() => this.getImage(params)}>
            <Text style={styles.editText}>Edit image</Text>
          </TouchableOpacity>
        <View style={{flexDirection:'row',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
          <Text style={styles.titleText}> {this.state.title} </Text>
          <TouchableOpacity style={styles.editButton}
                            onPress ={() => this.toggleTitleChgDialog()}>
            <Text style={styles.editText}>Edit title</Text>
          </TouchableOpacity>
          <Dialog.Container visible={this.state.titleChgDialog}>
            <Dialog.Title> New Title </Dialog.Title>
            <Dialog.Input placeholder="Enter title" onChangeText={(text)=>this.setState({newTitle: text})}/>
            <Dialog.Button label="Cancel" color = "#CD5C5C" onPress={()=>this.toggleTitleChgDialog()}/>
            <Dialog.Button label="Enter" onPress = {()=>this.changeTitle(this.state.newTitle, params)}/>
          </Dialog.Container>
        </View>
        <View style={{flexDirection:'row',
                      backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
          <Text style={styles.commentText}> {this.state.comments} </Text>
          <TouchableOpacity style={styles.editButton}
                            onPress ={() => this.toggleCmmtsChgDialog()}>
            <Text style={styles.editText}>Edit comments</Text>
          </TouchableOpacity>
          <Dialog.Container visible={this.state.CmmtsChgDialog}>
            <Dialog.Title> New Comments </Dialog.Title>
            <Dialog.Input placeholder="Enter comments" onChangeText={(text)=>this.setState({newComments: text})}/>
            <Dialog.Button label="Cancel" color = "#CD5C5C" onPress={()=>this.toggleCmmtsChgDialog()}/>
            <Dialog.Button label="Enter" onPress={()=>this.changeComments(this.state.newComments, params)}/> 
          </Dialog.Container>
        </View>
        <Text style={{fontWeight: 'bold',
                      color: 'black',
                      fontSize: 15,
                      paddingTop: 10,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)'}}> Replies: </Text>
          <FlatList
                  data={this.state.Array}
                  renderItem={({item}) =>
                  <View style={styles.reply}>
                    <View style = {{flex: 0.8 }}>
                      <Text style={styles.replyText}>{item.reply}</Text>
                    </View>
                    <View style={styles.userProfile}>
                      <Image style={styles.dpImage} source={{uri: item.URL}} />
                      <Text style={styles.usernameText}> {item.username} </Text>
                    </View>
                  </View> 
                  } />
      </ImageBackground>       
    );
  }
}

const styles = StyleSheet.create({
    imgBackground: {
     flex: 1
    },
    img: {
     flex: 0.8
    },
    titleText: {
     color: 'black',
     fontSize: 30,
     fontWeight: 'bold',
     padding: 10,
     flex: 1
    },
    commentText: {
     color: 'black',
     fontSize: 15,
     paddingLeft: 5,
     flex: 1
    },
    btnText: {
     textAlign: 'center',
     fontSize: 14,
     fontWeight: 'bold',
     color: 'white'
    },
    reply: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',      
      padding: 5,
      marginTop: 5,
      justifyContent: 'space-between'

    },
    replyText: {
      color: 'black',
      fontSize: 15,
      paddingLeft: 5,
    },
    userProfile: {
      flex: 0.2,
      justifyContent: 'center'
    },
    dpImage: {
      height: 30,
      width: 30,
      borderRadius: 200
    },
    usernameText: {
      fontSize: 14,
      fontWeight: 'bold'
    },
    editText: {
      fontSize: 12,
    },
    editButton: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 5
    },
    editImg: {
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
      paddingRight: 5
    }

});
