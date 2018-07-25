import React, { Component } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Jewels extends Component {
    constructor() {
           super();

            this.state = {
                titleText: "",
                commentText: "",
                Array: [],
                URL: "",
                Username: ""
            }
    }
    componentDidMount() {
        const ref = firebase.database().ref('images/Jewellery & Watches');
        ref.on('value', this.uidData.bind(this));
    }

    uidData =  (data) => {
      // do not delete the following line, it's here to stop a recursive bug
      console.log("hello")
      this.setState({Array: []});
      if(data.exists()) {
        var info = data.val();
        var keys = Object.keys(info);
        for(var i=0; i<keys.length;i++) {     
          const ref = firebase.database().ref('images/Jewellery & Watches').child(keys[i]);
          ref.once('value',this.gotData.bind(this));
        }
      }
    }

      gotData = async (data) => {
           if(data.exists()) {
          var info = data.val();
                 var keys = Object.keys(info);
                 var dataArray = [];
                 for(var i=0;i<keys.length;i++) {
                     var name = keys[i];
                     var url = info[keys[i]].url;
                     var title = info[keys[i]].title;
                     var comments = info[keys[i]].comments;
                     var uid = info[keys[i]].uid;  
                     var URLref = firebase.database().ref('/ProfilePics').child(uid)
                     // await for the Promise 
                     await URLref.once('value', this.gotDp.bind(this)) 
                     var URL = this.state.URL
                     var Username = this.state.Username
                     var Entry = {
                         name: name,
                         url: url,
                         title: title,
                         comments: comments,
                         uid: uid,
                         URL: URL,
                         Username: Username,
                     }
               dataArray.push(Entry);

        }
        this.setState( (state) => {
          console.log("exit2")
          state.Array = state.Array.concat(dataArray);
          return state;
        });
        }
    }

    gotDp = (data) => {
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
        return (
            <ImageBackground source={require('./images/bckgrd1.jpg')}                   
          style={styles.imgBackground}>   
               <Header
                  backgroundColor= {'#d35400'}
                    leftComponent={{icon:'chevron-left', onPress: () => this.props.navigation.goBack()}}
                    centerComponent={{text: 'Itemtifier', style: {color: 'white', fontSize: 30,
                   fontWeight: 'bold', fontFamily: 'serif'} }} /> 
           
               <ScrollView style={styles.containerScroll}>
                    {this.state.Array.length != 0 ?
                        this.state.Array.map((item, key) =>
                            {
                            return (
                                <TouchableOpacity style={styles.containerImg}
                                  onPress={() => this.props.navigation.navigate('ReplyBags',
                                   {uid: item.uid, name: item.name, title: item.title, comments: item.comments, url: item.url, category: "Jewellery & Watches"})}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={styles.titleText}> {item.title} </Text>
                    <View style={{flex: 0.3, backgroundColor: 'rgba(255, 255, 255, 0.5)', }}>
                      <Image style={styles.dpImage} source={{uri: item.URL}} />
                      <Text style={styles.usernameText}> {item.Username} </Text>
                    </View>
                  </View>
                                    <Image style={styles.img} source= {{uri: item.url }}></Image>
                                    <Text style={styles.commentText}> {item.comments} </Text>
                                </TouchableOpacity>
                            )
                        })
                        :
                           <View style = {styles.empty}>
                               <Icon
                                   name = 'camera-retro'
                                   size = {30}
                                   color = 'black' />
                               <Text style={styles.emptyText}> There are no requests at the moment! </Text>
                           </View>
                    }
                </ScrollView> 
            </ImageBackground>
        );    
    }
}

const styles = StyleSheet.create({
    imgBackground: {
        flex: 1,
    },
    containerScroll: {
        flex: 1
    },
    containerImg: {
        height: 300,
        width: 413,
     justifyContent: 'center'
    },
    titleText: {
     flex: 0.7,
     fontSize: 30,
     fontWeight: 'bold',
     color: 'black',
     backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    commentText: {
      fontSize: 15,
      color: 'black',
      paddingTop: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      paddingBottom: 10
    },
    img: {
        flex: 1
    },
    empty: {
        alignItems: 'center',
     justifyContent: 'center',
     marginTop: 200

    },
    emptyText: {
        color: 'black',
        fontSize: 20,
     textAlign: 'center'
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
