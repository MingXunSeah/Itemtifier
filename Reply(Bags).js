import React, { Component } from 'react';
import {View, Image, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, FlatList} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';

export default class ReplyBags extends Component {
    constructor() {
   	  super();
      this.reply;
   	  this.state ={
   		 replyInput: "",
       Array: [],
   	  }
    }

    componentDidMount() {
      const {params} = this.props.navigation.state
      const ref = firebase.database().ref('images/Bags & Shoes').child(params.name).child('/replies');
      ref.on('value', this.gotData.bind(this)); 
    }
    uploadReply(params) {
      firebase.database().ref('images/Bags & Shoes').child(params.name).child('/replies').push({Reply: this.state.replyInput});
      alert('Replied');     
    }

    gotData = (data) => {
      if(data.exists()) {
          var info = data.val();
          var keys = Object.keys(info);
          var dataArray = [];
          for(var i=0;i<keys.length;i++) {
            var reply = info[keys[i]].Reply
            var Entry = {
              reply: reply
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
        <FlatList
          contentContainerStyle={styles.flatList}
          data={this.state.Array}
          renderItem={({item}) =>
          <View style={styles.reply}>
            <Text style={styles.replyText}>{item.reply}</Text>
          </View> 
          } />
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
    },
    flatList: {
     //flex: 1,
      //backgroundColor: 'rgba(255, 255, 255, 0.5)',     
      //alignItems: 'center'
      //justifyContent: 'center'
    },
    reply: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',      
      padding: 10,
      marginTop: 5
    },
    replyText: {
      color: 'black',
      fontSize: 18,
      paddingLeft: 5,
      fontWeight: 'bold',
    }

});
