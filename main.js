import React, { useEffect, useState } from 'react';
import {StyleSheet,View,Text,LogBox} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Page/Home';
import Dashboard from './Page/Dashboard';
import Search from './Page/Search';
import Cart from './Page/Cart';
import SubProduct  from './Page/SubProduct';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TrackOrder from './Drawers/TrackOrder';
import HowTo from './Drawers/HowTo';
import Privicy from './Drawers/Privicy';
import OrderHistory from './Drawers/OrderHistory';
import CustomSidebarMenu from './Drawers/CustomSidebarMenu';
import Category from './Page/Category';
import Trending from './View/Trending';
import Suggestion from './View/Suggestion';
import Recent from './View/Recent';
import NewArrival from './View/NewArrival';
import Product from './Page/Product';
import ConfirmOrder from './Page/ConfirmOrder' 
import Voucher from './Page/Voucher';
import ViewImage from './Page/ViewImage';
import { Badge } from 'react-native-elements';
import PushNotification from 'react-native-push-notification';
import { RFPercentage } from 'react-native-responsive-fontsize';

function MyTabs() {
  const Tab = createBottomTabNavigator();
  const [cartData, setcartData]= useState(0);
  useEffect(() => {
    LogBox.ignoreLogs(['Require cycle:']);
    const intervalId = setInterval(() => {
      fetchcartdata();
    }, 300);
    return () => clearInterval(intervalId);
  }, []);

  const fetchcartdata=async()=>{
    var JSonParse = await AsyncStorage.getItem('cartdata');
    var NewDatatoAdd =  JSON.parse(JSonParse);
   if(NewDatatoAdd!=null)
   {
  setcartData(NewDatatoAdd.length); 
   }
   else{
    setcartData(0); 
   }
    
  }
  return (

    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: 'black',
        // activeBackgroundColor: '#45CE30',
        keyboardHidesTabBar: true,

        style: {
          height: hp('6%')
        },
      }}
    >

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel:({ focused }) =>  (
            focused
            ? <Text style={{color:'#45ce30',fontSize:RFPercentage(1.2)}}>Home</Text>
            :  <Text style={{color:'#090909',fontSize:RFPercentage(1.2)}}>Home</Text>
         ),
          tabBarIcon: ({ focused }) =>  (
            focused
            ?  <ResponsiveImage source={require('./assest/Image/Home1.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
            :  <ResponsiveImage source={require('./assest/Image/Home.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
         )
        }}
      />

      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel:({ focused }) =>  (
            focused
            ? <Text style={{color:'#45ce30',fontSize:RFPercentage(1.2)}}>Dashboard</Text>
            :  <Text style={{color:'#090909',fontSize:RFPercentage(1.2)}}>Dashboard</Text>
         ),
          tabBarIcon: ({ focused }) =>  (
            focused
            ?  <ResponsiveImage source={require('./assest/Image/Dashboard1.png')} initWidth="25" initHeight="25"  />
            :  <ResponsiveImage source={require('./assest/Image/Dashboard.png')} initWidth="25" initHeight="25"  />
         )
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel:({ focused }) =>  (
            focused
            ? <Text style={{color:'#45ce30',fontSize:RFPercentage(1.2)}}>Search</Text>
            :  <Text style={{color:'#090909',fontSize:RFPercentage(1.2)}}>Search</Text>
         ),
          tabBarIcon: ({ focused }) =>  (
            focused
            ?  <ResponsiveImage source={require('./assest/Image/Search1.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
            :  <ResponsiveImage source={require('./assest/Image/Search.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
         )
        }}
      />
       
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarLabel:({ focused }) =>  (
            focused
            ? <Text style={{color:'#45ce30',fontSize:RFPercentage(1.2)}}>Cart</Text>
            :  <Text style={{color:'#090909',fontSize:RFPercentage(1.2)}}>Cart</Text>
         ),
          tabBarIcon: ({ focused }) =>  (
          
            focused
            ? 
            <View>
             <ResponsiveImage source={require('./assest/Image/Cart1.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
             {cartData==0?
            null
               :(
                <Badge
                value={cartData}
                status="error"
                containerStyle={styles.badgeStyle}
              />
                  )}
                  </View>
            :  
            <View>
            <ResponsiveImage source={require('./assest/Image/Cart.png')} initWidth="25" initHeight="25" style={{ borderRadius: 100, }} />
            {cartData==0?
              null
                 :(
                  <Badge
                  value={cartData}
                  status="error"
                  containerStyle={styles.badgeStyle}
                />
                    )}
                    </View>
         )
        }}
      />


    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

const main =({navigation})=> {
 
  useEffect(() => {
   GetToken();

  }, []);
  const GetToken = () => {
  
    PushNotification.configure({
     
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {

        AsyncStorage.setItem('token',JSON.stringify(token));
         
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
   
     const clicked = notification.userInteraction;
    
        if (clicked || notification.foreground != true) {
    
        if(notification.data.click_action=='delivery')
        {
        navigation.navigate('TrackOrder',
        {
          orderID: '',
          pagename: 'Home'
        }
        
      );
        } 
      }

      },

    // Android only: GCM or FCM Sender ID
        senderID: '656149433945',
        popInitialNotification: true,
        requestPermissions: true,
       
    })
    return null;
  }
  
  
  return (
    <Drawer.Navigator drawerContent={props => <CustomSidebarMenu{...props} />} >
      <Drawer.Screen name="Home" component={MyTabs} />
      <Drawer.Screen name="main" component={main} />
      <Drawer.Screen name="Category" component={Category} />
      <Drawer.Screen name="SubProduct" component={SubProduct} />
      <Drawer.Screen name="Trending" component={Trending} />
      <Drawer.Screen name="Suggestion" component={Suggestion} />
      <Drawer.Screen name="Recent" component={Recent} />
      <Drawer.Screen name="NewArrival" component={NewArrival} />
      <Drawer.Screen name="Product" component={Product} />
      <Drawer.Screen name="TrackOrder" component={TrackOrder} />
      <Drawer.Screen name="OrderHistory" component={OrderHistory} />
      <Drawer.Screen name="HowTo" component={HowTo} />
      <Drawer.Screen name="Privicy" component={Privicy} />
      <Drawer.Screen name="ViewImage" component={ViewImage} />
      <Drawer.Screen name="ConfirmOrder" component={ConfirmOrder} />   
      <Drawer.Screen name="Voucher" component={Voucher} />  
      
    </Drawer.Navigator>

  );
}
const styles = StyleSheet.create({
  // code of notification badge
  badgeStyle: {
  
    position: 'absolute',
    marginLeft:wp('4%'),
  
  },
})
export default main;
