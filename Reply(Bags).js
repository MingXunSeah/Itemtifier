import React, { Component } from 'react';
import {View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';

export default class ReplyBags extends Component {
    constructor() {
   	 super();
     this.reply;
   	 this.state ={
   		 replyInput: ""
   	 }
    }

    uploadReply(params) {
      firebase.database().ref('images/Bags & Shoes').child(params.name).push({Reply: this.state.replyInput});
      alert('Replied');
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
   			<TextInput
          style= {styles.reply}
   				placeholder= "Reply to this query"
          multiline={true}
          blurOnSubmit={true}
          onChangeText={(text)=>this.setState({replyInput: text})}
          ref={input => {this.reply = input}} />
   			<View style = {{alignItems: 'center'}}>
   				<TouchableOpacity style={styles.replyBtn}
                            onPress={() => {this.uploadReply(params)
                                            this.reply.clear()}}>
   					<Text style={styles.btnText}> Reply </Text>
   				</TouchableOpacity>
   			</View>
   		</ImageBackground>   		 
   	);
  }
}

const styles = StyleSheet.create({
    imgBackground: {
   	 flex: 1
    },
    img: {
   	 backgroundColor: 'skyblue',
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
    reply: {
      paddingLeft: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    replyBtn: {
      marginTop: 10,
   	 justifyContent: 'center',
   	 backgroundColor: '#2c3e50',
   	 height: 50,
   	 width: 150,
   	 borderRadius: 20

    },
    btnText: {
   	 textAlign: 'center',
   	 fontSize: 14,
   	 fontWeight: 'bold',
   	 color: 'white'
    }

});
