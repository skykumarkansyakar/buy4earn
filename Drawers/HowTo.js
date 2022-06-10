//This is an example code for Navigation Drawer with Custom Side bar//
import React, { useEffect } from 'react';
//import react in our code.
import { StyleSheet, View, Text, StatusBar,BackHandler } from 'react-native';
// import all basic components
import { Container, Header } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ResponsiveImage from 'react-native-responsive-image';
import { WebView } from 'react-native-webview';
import { RFPercentage } from "react-native-responsive-fontsize";

const HowTo = ({ navigation,route }) => {
  const { pagename } = route.params;
   //HowTo Component
  useEffect(() => {

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };

  }, [])
  const backAction = () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
    navigation.navigate(pagename)
    return true;
  };
  return (
    <Container>

      <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
      <TouchableOpacity style={{flexDirection:'row'}}
            onPress={() => navigation.navigate('Home')}
          >
        <View style={{ color: 'white', marginLeft: wp('1%'), }}>
         
            <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />
         
        </View>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3), marginLeft: wp('2%') }}>How To</Text>
        </TouchableOpacity>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
      </Header>

        <WebView style={{ width: wp('99%'), height: hp('92%') }} source={{ uri: 'https://www.buy4earn.com/youtube_play' }} />
     
    </Container>
  );
}



export default HowTo;