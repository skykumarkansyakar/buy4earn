import React from 'react';
import {View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import LottieView from 'lottie-react-native';
const conifrm = () => {
 
    return (
        <View style={{flex:1,alignItems:'center',backgroundColor:'#fff'}}>
 <LottieView source={require('../assest/Gif/confrim.json')} autoPlay loop />
      </View>
    );
};
export default conifrm;
 