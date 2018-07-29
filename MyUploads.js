import React, { Component } from 'react';
import {View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native';
import {Header} from 'react-native-elements';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';

const categories = [
        "Bags & Shoes", "Books & Stationery", "Electronics", "Fashion Wear",
        "Food", "Jewellery & Watches", "Music & Audio", "Healthcare" ];
export default class MyUploads extends Component {
    constructor() {
      super();
      this.state = {
        titleText: "",
        commentText: "",
        Array: [],
        DeleteDialog: false,
        currName: "",
        category: "",
        back: false
      }
    }
    componentDidMount = () =>{
      console.log("exit1 ")
      this.setState({Array: []});
      var uid = firebase.auth().currentUser.uid;
      for(var i=0;i<8;i++) {
        this.setState({flag: false})
        var ref = firebase.database().ref('images/' + categories[i] ).child(uid);
        ref.on('value', this.gotData.bind(this));
      }
    }
    reloadButton = (back) => {
      console.log("reloaded")
      this.setState(back)
      this.componentDidMount()
    }
    gotData = (data) => {
      if(data.exists()) {
          var info = data.val();
          var keys = Object.keys(info);
          var dataArray = [];
          console.log("EXIT")
          for(var i=0;i<keys.length;i++) {
            var name = keys[i];
            var url = info[keys[i]].url;
            var title = info[keys[i]].title;
            var comments = info[keys[i]].comments;
            var uid = firebase.auth().currentUser.uid;
            var category = info[keys[i]].category;
            var Entry = {
              name: name,
              url: url,
              title: title,
              comments: comments,
              uid: uid,
              category: category
            }
        dataArray.push(Entry);
        }
        this.setState( (state) => {
          state.Array = state.Array.concat(dataArray);
          console.log("exit3 ")
          return state;
        });
    }
  }
    deletePhoto = (name, category) => {
      var uid = firebase.auth().currentUser.uid;
      firebase.database().ref(category).child(uid).child(name).remove();
      console.log(category + "HERE")
      this.setState({DeleteDialog: false});
      this.componentDidMount();
      alert("Photo Deleted");
    }
    toggleDeleteDialog = (name, category) => {
      this.setState({DeleteDialog: !this.state.DeleteDialog});
      this.setState({currName: name})
      this.setState({category: category})
    }
    render() {
     return (
       <ImageBackground source={require('./images/bckgrd1.jpg')}                   
          style={styles.imgBackground}>   
        <Header
          backgroundColor= {'#d35400'}
            leftComponent={{icon:'chevron-left', onPress: () => this.props.navigation.goBack()}}
            centerComponent={{text: 'My Uploads', style: {color: 'white', fontSize: 30,
          fontWeight: 'bold', fontFamily: 'serif'} }} /> 

        <ScrollView style={styles.containerScroll}>
           {this.state.Array.length != 0 ?
             this.state.Array.map((item, key) =>
               {
               return (
                <View style={styles.containerImg} >      
                   <View style={{flexDirection: 'row'}}>
                    <Text style={styles.titleText}> {item.title} </Text>
                    <TouchableOpacity style={styles.updateBtn}
                      onPress ={() => this.props.navigation.navigate('Edit',
                                  {uid: item.uid, name: item.name, title: item.title, 
                                    comments: item.comments, url: item.url, category: item.category,
                                    reload: this.reloadButton.bind(this)})}>
                      <Icon 
                        name = 'edit' 
                        size = {30} 
                        color = 'black' />
                    </TouchableOpacity>                    
                    <TouchableOpacity style={styles.deleteBtn}
                      onPress ={() => this.toggleDeleteDialog(item.name, item.category)}>
                      <Icon 
                        name = 'ban' 
                        size = {30} 
                        color = 'red' />
                    </TouchableOpacity>
                    <Dialog.Container visible = {this.state.DeleteDialog}>
                      <Dialog.Title> Delete Post </Dialog.Title>
                      <Dialog.Description> Do you want to delete this post? You cannot undo this action. </Dialog.Description>
                      <Dialog.Button label="Cancel" color= "#CD5C5C" onPress={() => this.toggleDeleteDialog(this.state.currName,this.state.category)}/>
                      <Dialog.Button label="Delete" onPress={() => this.deletePhoto(this.state.currName,this.state.category)}/>
                    </Dialog.Container>
                   </View>
                   <Image style={styles.img} source= {{uri: item.url }}></Image>
                   <Text style={styles.commentText}> {item.comments} </Text>
                   </View>
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
     flex: 0.6,
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
    deleteBtn: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
      justifyContent: 'center',
      alignItems: 'center', 
      flex: 0.22,
    },
    updateBtn: {
      flexDirection: 'row',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', 
      justifyContent: 'flex-end', 
      alignItems: 'center',
      flex: 0.18
    }
});
  