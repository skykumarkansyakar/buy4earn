import React from 'react';
import {View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
// import LottieView from 'lottie-react-native';
const loader1 = () => {
 
    return (
        // <View style={{justifyContent:'center',alignItems:'center'}}>
      // <LottieView source={require('../assest/Gif/otp.json')} autoPlay loop />
      <ResponsiveImage source={require('../assest/Gif/animation.gif')} initWidth="300" initHeight="300" />
      // </View>
    );
};
export default loader1;
