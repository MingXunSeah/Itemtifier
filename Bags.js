import React, { Component } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Bags extends Component {
    constructor() {
   	 super();
   	 const ref = firebase.database().ref('images/Bags & Shoes');
   	 ref.on('value', this.gotData.bind(this));

   	 this.state = {
   		 titleText: "",
   		 commentText: "",
   		 Array: []
   	 }
    }

  gotData(data) {
   	if(data.exists()) {
   	  var info = data.val();
   	  var keys = Object.keys(info);
   	  for(var i=0;i<keys.length;i++) {
        var name = keys[i]
   	  	var url = info[keys[i]].url
   		  var title = info[keys[i]].title
   	  	var comments = info[keys[i]].comments
   		  var Entry = {
          name: name,
   			  url: url,
   			  title: title,
   			  comments: comments
   		  }
   		  var newArray = this.state.Array.concat(Entry);
   		  this.setState({Array: newArray});   	 
   	  }
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
  		 		      fontWeight: 'bold', fontFamily: 'serif'} }}
  		 		 />
   			 <ScrollView style={styles.containerScroll}>
   				 {this.state.Array.length != 0 ?
   					 this.state.Array.map((item, key) =>
   						 {
   						 return (
   							 <TouchableOpacity style={styles.containerImg}
                                  onPress={() => this.props.navigation.navigate('ReplyBags',
                                   {name: item.name, title: item.title, comments: item.comments, url: item.url})}>
   								 <Text style={styles.titleText}> {item.title} </Text>
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
   							<Text style={styles.emptyText}> There are no pictures at the moment! </Text>
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
    }
});
