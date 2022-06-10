//  Import Packages
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Import Files 
import Login from './Process/Login';
import OTP from './Process/OTP';
import Details from './Process/Details';
import Animation_login from './Process/Animation_login';
import main from './main';
import Product from './Page/Product';
import Cart from './Page/Cart';
import ViewImage from './Page/ViewImage';
// import Banner from './Banner';


const Stack = createStackNavigator();

function App() {
  const deeplinking = {
    prefixes: ['https://www.buy4earn.com', 'https://buy4earn.com', 'http://www.buy4earn.com', 'http://buy4earn.com', '//buy4earn'],
    config: {
      Login:
      {
        path: 'Login/:intId',
        params: {
          intId: null,

          
        }

      },
      OTP: 'OTPPath',
      Details: 'Details',
      main: 'Home',
      Product: {
        path: 'Product/:itemid',
        params: {
          itemid: null,

        }

      }
    }
  }
  return (
    <NavigationContainer linking={deeplinking}>
      <Stack.Navigator initialRouteName="Animation_login"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Animation_login" component={Animation_login} />
        <Stack.Screen name="main" component={main}/>
        <Stack.Screen name="Product" component={Product} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="ViewImage" component={ViewImage} />
        {/* <Stack.Screen name="Banner" component={Banner}/> */}
      </Stack.Navigator>
    </NavigationContainer>

  );
}

export default App;