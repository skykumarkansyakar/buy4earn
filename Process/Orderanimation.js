import React from 'react';
import {View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
// import LottieView from 'lottie-react-native';
const conifrm = () => {
 
    return (
        <View style={{flex:1,alignItems:'center',backgroundColor:'#fff'}}>
      <ResponsiveImage source={require('../assest/Gif/animation.gif')} initWidth="400" initHeight="600" />
      {/* <LottieView source={require('../assest/Gif/confrim.json')} autoPlay loop /> */}
      </View>
    );
};
export default conifrm;
 