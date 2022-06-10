import React, { useEffect } from 'react';
import { View, StyleSheet , ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveImage from 'react-native-responsive-image';
// import LottieView from 'lottie-react-native';
import RNRestart from 'react-native-restart';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const loading = ({navigation}) => {
  useEffect(() => {
    checkLogin();
  }, []);

  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  const checkLogin = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    
    if (mtsLogin) {
      if(mtsLogin!='')
      {
        fetch('https://www.buy4earn.com/React_App/MTS_Data_Check.php', {
          method: 'POST',
          body: dataToSend,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          }
          //Request Type 
        })
          .then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
            if(responseJson.status=='null')
          {
            loggout();
          }
          else
          {
            navigation.navigate('main');
          }
          }
          
          )
          //If response is not in json then in error
          .catch((error) => {
            //Error 
        toastWithDurationHandler('Please Try Again !');
          });
      
      }
      
      else
      {
        var local = await AsyncStorage.getItem('local');
        if(local)
        {
          navigation.navigate('main');
        }
        else{
          navigation.navigate('Login');
        }
     
      }
      
      }
    else {
      var local = await AsyncStorage.getItem('local');
        if( local)
        {
          navigation.navigate('main');
        }
        else{
          navigation.navigate('Login');
        }
     
    }
  }
  const loggout = async () =>{
    try {
      await AsyncStorage.removeItem('user_login');
      await AsyncStorage.removeItem('mts');
      RNRestart.Restart();
  }
  catch(exception) {
     toastWithDurationHandler('Please Try Again !');
  }
  }
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
      <ResponsiveImage source={require('../assest/Gif/animation.gif')} initWidth="300" initHeight="300" />
      {/* <LottieView source={require('../assest/Gif/animation1.json')} autoPlay loop /> */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width:wp('100%'),
    height:hp('100%'),
    alignItems:'center',
  }
});
export default loading;