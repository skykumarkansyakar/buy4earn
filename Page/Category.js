
import React, { useEffect } from 'react';
import { Container, Header } from 'native-base';
import { Text, View, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GroceryAndStaples from '../Cateogry/GroceryAndStaples'
import HouseholdAndNeeds from '../Cateogry/HouseholdAndNeeds';
import PersonalCare from '../Cateogry/PersonalCare';
import BabyAndKids from '../Cateogry/BabyAndKids';
import Beverages from '../Cateogry/Beverages';
import NoodlesSaucesAndInstantfood from '../Cateogry/NoodlesSaucesAndInstantfood';
import BiscuitSnacksAndChocolate from '../Cateogry/BiscuitSnacksAndChocolate';
import BreakfastAndDiary from '../Cateogry/BreakfastAndDiary';
import DisposableItems from '../Cateogry/DisposableItems';
import LifeStyle from '../Cateogry/LifeStyle';
import CosmeticItems from '../Cateogry/CosmeticItems';


const Tab = createMaterialTopTabNavigator();

const Category = ({ navigation, route }) => {
  const { category_name } = route.params;
 
  useEffect(() => {

    category1(category_name);
  
    
  }, [category_name]);

  function category1(category_name) {
    navigation.navigate(category_name)
  }


 
  return (
    <Container>
      <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
        <TouchableOpacity style={{ flexDirection: 'row' }}
          onPress={() => navigation.navigate('Home')}
        >
          <View style={{ color: 'white', marginLeft: wp('1%'), }}>

            <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />

          </View>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginLeft: wp('2%') }}>Category
        </Text>
        </TouchableOpacity>
      </Header>
      {/* <StatusBar style="auto" /> */}
      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
      <Tab.Navigator

        initialRouteName={category_name}
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
          name="GroceryAndStaples"
          component={GroceryAndStaples}
          options={{
            tabBarLabel: 'Grocery And Staples',

          }} />
        <Tab.Screen
          name="HouseholdAndNeeds"
          component={HouseholdAndNeeds}
          options={{
            tabBarLabel: 'Household And Needs',

          }} />
        <Tab.Screen
          name="PersonalCare"
          component={PersonalCare}
          options={{
            tabBarLabel: 'Personal Care',

          }} />
        <Tab.Screen
          name="BabyAndKids"
          component={BabyAndKids}
          options={{
            tabBarLabel: 'Baby And Kids',

          }} />
        <Tab.Screen
          name="Beverages"
          component={Beverages}
          options={{
            tabBarLabel: 'Beverages',

          }} />

        <Tab.Screen
          name="BiscuitSnacksAndChocolate"
          component={BiscuitSnacksAndChocolate}
          options={{
            tabBarLabel: 'Biscuit,Snacks And Chocolate',

          }} />
        <Tab.Screen
          name="NoodlesSaucesAndInstantfood"
          component={NoodlesSaucesAndInstantfood}
          options={{
            tabBarLabel: 'Noodles ,Sauces and instantfood',

          }} />
        <Tab.Screen
          name="BreakfastAndDiary"
          component={BreakfastAndDiary}
          options={{
            tabBarLabel: 'Breakfast And Dairy',

          }} />
        <Tab.Screen
          name="DisposableItems"
          component={DisposableItems}
          options={{
            tabBarLabel: 'Disposable itam',

          }} />
        <Tab.Screen
          name="LifeStyle"
          component={LifeStyle}
          options={{
            tabBarLabel: 'Life Style',

          }} />
        <Tab.Screen
          name="CosmeticItems"
          component={CosmeticItems}
          options={{
            tabBarLabel: 'Cosmetic Items',

          }} />


      </Tab.Navigator>
    </Container>

  );
};

export default Category;
