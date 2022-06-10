import React from 'react';
import {View} from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const Detailsanimation = () => {
 
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center',backgroundColor: '#fff',height:heightPercentageToDP('100%') }}>
        <ResponsiveImage source={require('../assest/Gif/animation.gif')} initWidth="300" initHeight="300" />
      </View>
    );
};
export default Detailsanimation;