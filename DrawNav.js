import {DrawerNavigator, StackNavigator} from 'react-navigation';
import Login from './Login';
import Settings from './Settings';
import Main from './Main';
import Upload from './Upload';
import Profile from './Profile';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default DrawNav = DrawerNavigator({
  Home: {screen: Main,
		navigationOptions: {
  		drawerIcon: () => (
    		<Icon
      		name= 'home'
      		size= {25}
      		color= 'black'
    		/>
  		)
		}
  },
  Upload: {screen: Upload,
		navigationOptions: {
  		drawerIcon: () => (
    		<Icon
      		name= 'upload'
      		size= {25}
      		color= 'black'
    		/>
  		)
		}
  },
  Profile: {screen: Profile,
		navigationOptions: {
  		drawerIcon: () => (
    		<Icon
      		name= 'child'
      		size= {30}
      		color= 'black'
    		/>
  		)
		}
  },
  Settings: {screen: Settings,
		navigationOptions: {
  		drawerIcon: () => (
    		<Icon
      		name= 'gear'
      		size= {28}
      		color= 'black'
    		/>
  		)
		}
  },
});
