import React, { Component } from 'react';
import {View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';

export default class ReplyBags extends Component {
    constructor() {
   	  super();

      this.reply;
   	  this.state ={
       // tempURL: "",
       // tempUsername: "",
   		 replyInput: "",
       Array: [],
       dpURL: "https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3",
       username: "default"
   	  }
    }

    componentDidMount() {
      const {params} = this.props.navigation.state
      const ref = firebase.database().ref('images/Bags & Shoes').child(params.uid).child(params.name).child('/replies');
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

    uploadReply(params) {
      var Reply = this.state.replyInput;
      var uid = firebase.auth().currentUser.uid;
      var URL = this.state.dpURL;
      var Username = this.state.username;
      var replyObject = {
        Reply: Reply,
        UID: uid,       
        URL: URL,
        Username: Username 
      }
      firebase.database().ref('images/Bags & Shoes').child(params.uid).child(params.name).child('/replies').push({replyObject});
      alert('Replied');     
    }

      deleteReply(params, objectID) {
        firebase.database().ref('images/Bags & Shoes').child(params.uid).child(params.name).child('/replies').child(objectID).remove();   
        var uid = firebase.auth().currentUser.uid;
        const profileRef = firebase.database().ref('ProfilePics').child(uid);
        profileRef.on('value', this.profileData.bind(this));
      }

    // editReply(params, objectID) {
    //   var Reply = this.state.replyInput;
    //   var uid = firebase.auth().currentUser.uid;
    //   var URL = this.state.dpURL;
    //   var Username = this.state.username;
    //   var replyObject = {
    //     Reply: Reply,
    //     UID: uid,       
    //     URL: URL,
    //     Username: Username 
    //   }
    //   firebase.database().ref('images/Bags & Shoes').child(params.name).child('/replies').child(objectID).set({replyObject});   
    // }


    // THE COMMENTED SECTIONS OF THIS CODE ARE FOR FUTURE IMPROVEMENT, ASK ME FOR MORE DETAILS
    // infoRetrieval = (uid) => {
    //   const replyProfileRef = firebase.database().ref('ProfilePics').child(uid);
    //   replyProfileRef.on('value', this.replyProfileData.bind(this));
    // }
    // replyProfileData = (data) => {
    //   if(data.exists()) {
    //     var info = data.val();
    //     this.setState({tempURL: info.URL});
    //     this.setState({tempUsername: info.Username});
    //     console.log('hello');
    //     console.log(this.state.tempUsername);
    //   }
    // }

    gotData = (data) => {
      if(data.exists()) {
          var info = data.val();
          var keys = Object.keys(info);
          var dataArray = [];
          for(var i=0;i<keys.length;i++) {
           // THE COMMENTED SECTIONS OF THIS CODE ARE FOR FUTURE IMPROVEMENT, ASK ME FOR MORE DETAILS            
           // this.setState({tempURL: ""});
           //var UID = info[keys[i]].replyObject.UID;
           //this.infoRetrieval(UID);
            // while(this.state.tempURL === "");
            // var URL = this.state.tempURL;
            // var username = this.state.tempUsername;
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


    render() {
      const {params} = this.props.navigation.state
   	  return (
   		   <ImageBackground source={require('./images/bckgrd1.jpg')}                   
          style={styles.imgBackground}>   
   			  <Header
  			     	backgroundColor= {'#d35400'}
  		  			leftComponent={{icon:'chevron-left', onPress: () => this.props.navigation.goBack()}}
  		  			centerComponent={{text: 'Itemtifier', style: {color: 'white', fontSize: 30,
  		 		      fontWeight: 'bold', fontFamily: 'serif'} }}
  		 		/>
        <Image style={styles.img} source= {{uri: params.url}}></Image>
   			<Text style={styles.titleText}> {params.title} </Text>
   			<Text style={styles.commentText}> {params.comments} </Text>
        <View style = {{flexDirection: 'row',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
        <TextInput
          style= {styles.userReply}
          placeholder= "Reply to this query"
          multiline={true}
          blurOnSubmit={true}
          onChangeText={(text)=>this.setState({replyInput: text})}
          ref={input => {this.reply = input}} />
          <TouchableOpacity style={styles.replyBtn}
                            onPress={() => {this.uploadReply(params)
                                            this.reply.clear()}}>
            <Text style={styles.btnText}> Reply </Text>
          </TouchableOpacity>
        </View>
        <Text style={{fontWeight: 'bold',
                      fontSize: 15,
                      paddingTop: 10,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)'}}> Replies: </Text>
          <FlatList
                  data={this.state.Array}
                  // contentContainerStyle={styles.flatList}
                  renderItem={({item}) =>
                  <View style={styles.reply}>
                    <View style = {{flex: 0.8 }}>
                      <Text style={styles.replyText}>{item.reply}</Text>
                      {
                        item.UID === firebase.auth().currentUser.uid ?             
                          <TouchableOpacity
                                          onPress={() => this.deleteReply(params,item.objectID)}>
                            <Text> Delete reply </Text>
                          </TouchableOpacity>
                        : <View></View>
                      }
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
   	 //backgroundColor: 'skyblue',
   	 flex: 0.7
    },
    titleText: {
   	 color: 'black',
     fontSize: 30,
     fontWeight: 'bold',
     padding: 10,
     backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    commentText: {
   	 color: 'black',
     paddingLeft: 5,
     backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    userReply: {
      paddingLeft: 5,
      flex: 1
    },
    replyBtn: {
     marginTop: 10,
   	 justifyContent: 'center',
   	 backgroundColor: '#2c3e50',
   	 height: 30,
   	 width: 80,
   	 borderRadius: 20

    },
    btnText: {
   	 textAlign: 'center',
   	 fontSize: 14,
   	 fontWeight: 'bold',
   	 color: 'white'
    },
    // flatList: {
    //  //flex: 1,
    //   backgroundColor: 'rgba(255, 255, 255, 0.8)',     
    //   //alignItems: 'center'
    //   //justifyContent: 'center'
    // },
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
    }

});
