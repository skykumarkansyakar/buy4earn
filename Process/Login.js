//import react in our code. 
import React, { Component } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ToastAndroid,TouchableWithoutFeedback, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import OtpAnimation from './OtpAnimation';
import SmsRetriever from 'react-native-sms-retriever'
import firebase from 'react-native-firebase';
import GlobalFont from 'react-native-global-font'
export default class Login extends Component {
  constructor() {
    super();

    this.state = {
      textInputData: '',
      //to get the value from the TextInput
      getValue: '',
      //to set the value on Text
      isLoading: '',
      backbuttonpresse: 0,
      ipAddress: '',
      ReferalID:'',

    };
  }

  // Read Sms & BackHandler Function Call
  componentDidMount = () => {
    this.fetchIp();
    this.checkLink();
    // this._onPhoneNumberPressed();
    let fontName ='RobotoCondensed-Regular'
    GlobalFont.applyGlobal(fontName)
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
  }
  
  //  End Read Sms & BackHandler Function Call
fetchIp =()=>{
    fetch('https://api.ipify.org/?format=json')
      .then((response) => response.json())
      .then((json) => this.setState({ipAddress:json.ip}))
      .catch((error) => console.error(error))
}
// Link
async checkLink() {
  let url = await firebase.links().getInitialLink();
  if (url) {
    console.log(url);
    const ID = this.getParameterFromUrl(url, 'c');
    
     var res = url.split("/");
     if(res[4]==undefined||res[5]==undefined||res[4]==''||res[5]==''||res[4]==null||res[5]==null)
     {
      this.setState({ReferalID:ID});
     }
     else{
       console.log(this.state.ReferalID)
      this.setState({ReferalID:res[5]});
      this.savesrid(res[4]);
     }
  }
}
savesrid=async(srid)=>{
  AsyncStorage.setItem('srid',srid);
}
getParameterFromUrl(url, parm) {
  var re = new RegExp('.*[?&]' + parm + '=([^&]+)(&|$)');
  var match = url.match(re);
  return (match ? match[1] : '');
}
  // BackHandler Function
  backAction = () => {
    this.setState({ backbuttonpresse: this.state.backbuttonpresse + 1 });
    setTimeout(() => {
      this.setState({ backbuttonpresse: 0 });
    }, 2000);
    if (this.state.backbuttonpresse == 2) {
      BackHandler.exitApp()
      this.setState({ backbuttonpresse: 0 });
    }
    else {
      this._toastWithDurationHandler('Please click BACK againt to exit');
    }
    return true;
  };
  // Get the phone number (first gif)
 _onPhoneNumberPressed = async () => {
  try {
    const phoneNumber = await SmsRetriever.requestPhoneNumber();
    this.setState({ textInputData:phoneNumber.split('+91')[1]});
  } catch (error) {
    console.log(JSON.stringify(error));
  }
 };

  // End BackHandler Function


  //toast code
  _toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  //  SaveData Function
  saveData(responsedata) {
    AsyncStorage.setItem('user_login', JSON.stringify(responsedata));
  }
 
  // check validation function
  checkValueFunction = async () => {
    var mobileNumber = this.state.textInputData;
    if (!/^\d{10}$/.test(mobileNumber)) {
      this._toastWithDurationHandler('Invalid Mobile Number !');
    }
    else {
      this.setState({ isLoading: 'on' })
      var dataToSend = new FormData();
      var otp = Math.floor(1000 + Math.random() * 9000);
      dataToSend.append('UserMobile', mobileNumber);
      dataToSend.append('otp', otp);
      dataToSend.append('intid', this.state.ReferalID);
      fetch('https://www.buy4earn.com/React_App/login_process.php', {
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
            this.setState({ isLoading: '' });
            this._toastWithDurationHandler('Your ID is blocked please contact at care@buy4earn.com or call us 8448444943 !');
            
          }
          else
          {
          this.saveData(responseJson);
          console.log(responseJson);
          this.props.navigation.navigate('OTP');
          this.setState({ isLoading: '' });
          }
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error 
          this._toastWithDurationHandler('Please Try Again !');
        });
    }

  };
  gopage = () => {
    this.props.navigation.navigate('main');
    };
  // End check validation function

  render() {
    return (
      //main conatiner
      
      <View style={styles.container}>
        {this.state.isLoading != '' ? <OtpAnimation /> : (
          <View>
            <View style={{ justifyContent: 'flex-end',marginTop:hp('5%')}}>
          <TouchableWithoutFeedback onPress={() => this.gopage()}>
              
                <Text style={{textAlign: 'right', color: '#45ce30', fontWeight:'bold', fontSize:RFPercentage(2.8)}}>Skip Now</Text>
              
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container}>
   
          
            {/* image code */}
           
            <ResponsiveImage source={require('../assest/Image/mobile.jpeg')} initWidth="350" initHeight="350"  />
            {/* card code */}
            <View style={styles.card}>
            <TouchableOpacity onPress={() => this._onPhoneNumberPressed()}>
              <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('2%'), flexDirection: 'row' }}>
                {/* text code of +91 */}
                <View><Text style={{ fontSize: RFPercentage(2.8) }}>+91</Text></View>
                {/* code of text field */}
               
                <View style={styles.inputView} >
                  <View style={{ borderBottomWidth: 2 }}>
                    <TextInput
                      placeholder="Enter Your Mobile No"
                      value={this.state.textInputData}
                      onChangeText={data => this.setState({ textInputData: data.replace(/[^0-9]/g, '') })}

                      style={styles.inputText}
                      keyboardType='numeric'
                      maxLength={10}
                      autoCompleteType="off"

                    />
                  </View>
                </View>
              
              </View>
              </TouchableOpacity>
              {/* code of submit buttom */}
              <TouchableOpacity onPress={() => this.checkValueFunction()}>
                <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', }}>
                  <View style={styles.loginBtn}
                  >
                    <Text style={styles.loginText}
                    >SUBMIT</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

          </View>
          </View>
        )}

      </View>
    );
  }
}
// code of Stylesheet
const styles = StyleSheet.create({
  // main conatiner
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  //  text input view 
  inputView: {
    width: wp('70%'),
    backgroundColor: "white",
    borderRadius: 25,
    height: hp('7%'),
    justifyContent: "center",
    alignItems: 'center',
    alignItems: 'center',
    
    
  },
  // text input 
  inputText: {
    width: wp('60%'),
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: RFPercentage(2.8)
  },
  //  login btn code
  loginBtn: {
    width: "80%",
    backgroundColor: "#45CE30",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    height: hp('7%'),
    marginTop: hp('1.5%')

  },
  // login text code
  loginText: {
    color: "white",
    fontSize: RFPercentage(2.8),
    justifyContent: 'center'
  },
  // cart code
  card: {
    height: hp('20%'),
    width: wp('95%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    flexDirection: 'column'
  },
})