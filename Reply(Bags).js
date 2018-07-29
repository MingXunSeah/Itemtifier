import React, { Component } from 'react';
import {View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';

export default class ReplyBags extends Component {
    constructor() {
      super();

      this.reply;
      this.state ={
       URL: "",
       Username: "",
       replyInput: "",
       Array: [],
       dpURL: "https://firebasestorage.googleapis.com/v0/b/itemtifier.appspot.com/o/DefaultProfilePic%2Fprofilepic.png?alt=media&token=0cc0161c-edcf-41d3-aa22-bd3e959676e3",
       username: "default",
       delete: false
      }
    }

    componentDidMount() {
      const {params} = this.props.navigation.state
      this.setState({Array: []});
      const ref = firebase.database().ref('images/' + params.category).child(params.uid).child(params.name).child('/replies');
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
      var replyObject = {
        Reply: Reply,
        UID: uid
      }
      firebase.database().ref('images/' + params.category).child(params.uid).child(params.name).child('/replies').push({replyObject});
      alert('Replied');     
    }

      deleteReply(params, objectID) {
        firebase.database().ref('images/' + params.category).child(params.uid).child(params.name).child('/replies').child(objectID).remove().then(() => {this.setState({delete: true})
                                                                                                                                                          this.componentDidMount()})
      }

    gotData = async (data) => {
      if(data.exists()) {
          var info = data.val();
          var keys = Object.keys(info);
          var dataArray = [];
          for(var i=0;i<keys.length;i++) {
            var reply = info[keys[i]].replyObject.Reply;
            var objectID = keys[i];
            var UID = info[keys[i]].replyObject.UID;
            var URLref = firebase.database().ref('/ProfilePics').child(UID)
            // await for the Promise 
            await URLref.once('value', this.gotDp.bind(this))         
            var URL = this.state.URL
            var Username = this.state.Username    
            var Entry = {
              reply: reply,
              URL: URL,
              Username: Username,
              objectID: objectID,
              UID: UID
            }
            dataArray.push(Entry)
          }
          this.setState({Array: dataArray});  
        //   this.setState( (state) => {
        //     state.Array = state.Array.concat(dataArray);
        //     return state;
        // });
      }
    }
    gotDp(data) {
      if(data.exists()) {
          var info = data.val();
          var URL = info.URL;
          var Username = info.Username;
        this.setState( (state) => {
          state.URL = URL;
          state.Username = Username
          return state;
        });
      }
    }

    render() {
      const {params} = this.props.navigation.state
      return (
         <ImageBackground source={require('./images/bckgrd1.jpg')}                   
          style={styles.imgBackground}>   
              <Header
                backgroundColor= {'#4b0082'}
                  leftComponent={{icon: 'chevron-left', color: 'white', onPress: () => this.props.navigation.goBack()}}
                  centerComponent={{text: 'Reply', style: {color: 'white', fontSize: 23,
                  fontWeight: 'bold', fontFamily: 'helvetica'} }} />
        <Image style={styles.img} source= {{uri: params.url}}></Image>
        <Text style={styles.titleText}> {params.title} </Text>
        <Text style={styles.commentText}> {params.comments} </Text>
        <View style = {{flexDirection: 'row',
                        backgroundColor: '#E6E6FA'}}>
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
                      backgroundColor: '#E6E6FA'}}> Replies: </Text>
          <FlatList
                  data={this.state.Array}
                  // contentContainerStyle={styles.flatList}
                  renderItem={({item}) =>
                  <View style={styles.reply}>
                    <View style = {{flex: 0.8 }}>
                      <Text style={styles.replyText}>{item.reply}</Text>
                      {
                        item.UID === firebase.auth().currentUser.uid ?             
                          <TouchableOpacity onPress={() => this.deleteReply(params,item.objectID)}>
                            <Text> Delete reply </Text>
                          </TouchableOpacity>
                        : <View></View>
                      }
                    </View>
                    <View style={styles.userProfile}>
                      <Image style={styles.dpImage} source={{uri: item.URL}} />
                      <Text style={styles.usernameText}> {item.Username} </Text>
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
     backgroundColor: '#E6E6FA',
    },
    commentText: {
     color: 'black',
     paddingLeft: 5,
     backgroundColor: '#E6E6FA',
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
      backgroundColor: '#E6E6FA',      
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
      flex: 0.3,
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
