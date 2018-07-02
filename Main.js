import React, { Component } from 'react';
import {
	Text, 
	View, 
	StyleSheet, 
	TouchableOpacity, 
	ScrollView,
	Image,
	ImageBackground } from 'react-native';
import GridView from 'react-native-super-grid';
import { Header } from 'react-native-elements';

export default class Main extends Component {
  render() {
   	const items = [
      { name: 'Bags & Shoes', source: require('./images/bags.png'), key: "Bags"},
      { name: 'Books & Stationery', source: require('./images/books.png'), key: "Books"},
      { name: 'Electronics', source: require('./images/electronics.png'), key: "Electronics"},
      { name: 'Fashion Wear', source: require('./images/fashion.png'), key: "Fashion"},
      { name: 'Food', source: require('./images/food.png'), key: "Food"},
      { name: 'Jewellery & Watches', source: require('./images/watch.png'), key: "Jewels"},
      { name: 'Music & Audio', source: require('./images/music.png'), key: "Music"},
      { name: 'Healthcare', source: require('./images/healthcare.png'), key: "Healthcare"}
   	];
   	 return (
			<ImageBackground source={require('./images/bckgrd1.jpg')}										
          style={styles.imgBackground}>			
   			 <Header 
   			 		backgroundColor= {'#d35400'}
   		      leftComponent={{icon: 'menu', onPress: () => this.props.navigation.toggleDrawer()}}
   		      centerComponent={{text: 'Home', style: {color: 'white', fontSize: 30,
   		     	 fontWeight: 'bold', fontFamily: 'serif'} }} />
   		     	 <ScrollView style= {{flex: 1}}>
   				 <GridView
   					 itemDimension={130}
   					 spacing={10}
   					 items={items}
   					 style={styles.gridView}
   					 renderItem={item => (
   					 <TouchableOpacity style={styles.Container}
                              onPress={() => this.props.navigation.navigate(item.key)}>
   					 	<Image 
   					 		style={styles.img}
   					 		source={item.source}/>
   						 <Text style={styles.Name}>
   							 {item.name}
   						 </Text>
   					 </TouchableOpacity>
   					 )}
   				 />
   				 </ScrollView>
   		  </ImageBackground>
   	 );    
    }
}

const styles = StyleSheet.create({
    gridView: {
    },
    Container: {
   	 justifyContent: 'center',
   	 alignItems: 'center',
   	 height: 160
    },
    Name: {
   	 fontSize: 14,
   	 color: 'black',
   	 fontWeight: 'bold'
    },
    img: {
    	height: 130,
    	width: 130,
    	borderRadius: 30,
    	marginLeft: 5
    },
		imgBackground: {
			flex: 1,
		},
});
