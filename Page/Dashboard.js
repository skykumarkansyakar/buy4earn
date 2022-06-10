
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text, StatusBar, BackHandler } from 'react-native';
import DashboardDetails from '../DashBoard/DashboardDetails';
import Friends from '../DashBoard/Friends';
import SelfPoint from '../DashBoard/SelfPoint';
import BuddyPoint from '../DashBoard/BuddyPoint';
import BonusPoint from '../DashBoard/BonusPoint';
import ReedemPoint from '../DashBoard/ReddemPoint';
import OfferPoint from '../DashBoard/OfferPoint';
import Voucher from '../DashBoard/Voucher';
import { Container, Header } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
const page = 'DashboardDetails'
const dashboard = ({ navigation }) => {
  useEffect(() => {
    reaload();

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };

  }, [])
  const reaload = navigation.addListener('focus', () => {
    navigation.navigate(page);
  });
  const backAction = () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
    navigation.navigate('Home')

    return true;
  };
  return (

    <Container>
      <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>

        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: wp('2%') }}>Dashboard</Text>

      </Header>

      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
      {/* total tab of dashboard */}
      <Tab.Navigator

        initialRouteName="DashboardDetails"
        tabBarOptions={{
          activeTintColor: '#45CE30',
          inactiveTintColor: 'black',
          scrollEnabled: true,
          style: {
            width: 'auto',
          },
          labelStyle: {
            textAlign: 'center',
            fontWeight: 'bold',
          },
          indicatorStyle: {
            borderBottomColor: '#45CE30',
            borderBottomWidth: 2,
          },
        }}>

        <Tab.Screen
          name="DashboardDetails"
          component={DashboardDetails}
          options={{
            tabBarLabel: 'DETAILS',

          }}
        />
        <Tab.Screen
          name="Friends"
          component={Friends}
          options={{
            tabBarLabel: 'FRIENDS',

          }} />
        <Tab.Screen
          name="SelfPoint"
          component={SelfPoint}
          options={{
            tabBarLabel: 'SELF POINTS',
          }} />
        <Tab.Screen
          name="BuddyPoint"
          component={BuddyPoint}
          options={{
            tabBarLabel: 'BUDDY POINTS',

          }} />
        <Tab.Screen
          name="BonusPoint"
          component={BonusPoint}
          options={{
            tabBarLabel: 'BONUS POINTS',

          }} />

        <Tab.Screen
          name="OfferPoint"
          component={OfferPoint}
          options={{
            tabBarLabel: 'Offer POINTS',

          }} />
        <Tab.Screen
          name="ReedemPoint"
          component={ReedemPoint}
          options={{
            tabBarLabel: 'REDEEM POINTS',

          }} />

        <Tab.Screen
          name="Voucher"
          component={Voucher}
          options={{
            tabBarLabel: 'Voucher Coupon',

          }} />

      </Tab.Navigator>


    </Container>
  );
}


export default dashboard;
