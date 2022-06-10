import { View } from 'native-base';
import React, { useEffect,} from 'react';
import { BackHandler} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import Swiper from 'react-native-swiper'

const ViewImage=({route,navigation})=> {
  const {ImagePath} = route.params;
  const imagerecieve = JSON.parse(ImagePath);
  var SendImageData = [];
  for (let i = 0; i < imagerecieve.length; i++) {
    var TempArray = { id: i + 1, url: imagerecieve[i] };
    SendImageData.push(TempArray);
  }

const backAction = () => {
  BackHandler.removeEventListener("hardwareBackPress", backAction);
    navigation.navigate('Product')
     return true;
};


useEffect(() => {
  
  BackHandler.addEventListener("hardwareBackPress", backAction);
  return () => {
    BackHandler.removeEventListener("hardwareBackPress", backAction);
  };
  
}, [])

        return (
            <View style={{width:wp('100%'),height:hp('100%'),backgroundColor:'#fff'}}> 
          
            <View style={{width:wp('100%'),height:hp('8%'),flexDirection:'row-reverse',backgroundColor:'#fff',marginRight:wp('-2%'),marginTop:hp('1%')}}>
            <TouchableOpacity onPress={() =>backAction()} >
            <ResponsiveImage source={require('../assest/Image/cross1.jpeg')} initWidth="50" initHeight="50" style={{marginTop:hp('2%')}}/>
            </TouchableOpacity>
            </View>
        
              {/* </ImageZoom> */}
              <View style={{width:wp('100%'),height:hp('80%')}}>
              <Swiper showsButtons={true} 
              >
        {SendImageData.map((item, id) => {
          return (
            <View id={id} style={{width:wp('100%'),justifyContent:'center',alignItems:'center',flex:1}}>
              <ImageZoom cropWidth={500}
                       cropHeight={500}
                       imageWidth={380}
                       imageHeight={260}
                       resetScale={true}
                       
                       >
             <ResponsiveImage source={{ uri: item.url }} initWidth="400" initHeight="280" />
             </ImageZoom>
             
            </View>
            
          )
          
        })}
      </Swiper>
      </View>
          
            </View>
        )
    }
    
export default ViewImage;