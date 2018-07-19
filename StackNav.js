import {StackNavigator} from 'react-navigation'
import Register from './Register';
import Login from './Login';
import Loading from './Loading';
import DrawNav from './DrawNav';
import Bags from './Bags';
// import Books from './Books';
import Electronics from './Electronics';
// import Healthcare from './Healthcare';
// import Jewels from './Jewels';
// import Fashion from './Fashion';
// import Music from './Music';
// import Food from './Food';
import ReplyBags from './Reply(Bags)';
import ReplyElec from './ReplyElec';
import MyUploads from './MyUploads';

export default StackNav = StackNavigator({
  Loading: {screen: Loading, navigationOptions: {header: null}},
  Login: {screen: Login, navigationOptions: {header: null}},
  Signup: {screen: Register, navigationOptions: {header: null}},
  Homepage: {screen: DrawNav, navigationOptions: {header: null}},
  Bags: {screen: Bags, navigationOptions: {header:null}},
  // Books: {screen: Books, navigationOptions: {header:null}},
  Electronics: {screen: Electronics, navigationOptions: {header:null}},
  // Healthcare: {screen: Healthcare, navigationOptions: {header:null}},
  // Jewels: {screen: Jewels, navigationOptions: {header:null}},
  // Fashion: {screen: Fashion, navigationOptions: {header:null}},
  // Music: {screen: Music, navigationOptions: {header:null}},
  // Food: {screen: Food, navigationOptions: {header:null}}
  ReplyBags: {screen: ReplyBags, navigationOptions: {header:null}},
  ReplyElec: {screen: ReplyElec, navigationOptions: {header:null}},
  MyUploads: {screen: MyUploads, navigationOptions: {header:null}}
});
