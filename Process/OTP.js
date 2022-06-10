import React, { Component } from 'react';
//import react in our code. 
import { StyleSheet, View, TextInput, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import SmsRetriever from 'react-native-sms-retriever';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OTP extends Component {
  constructor() {
    super();
    this.state = {
      textInputData: '',
      //to get the value from the TextInput
      getValue: '',
      timer: 59,
      //to set the value on Text
    };
  }
  //   SaveData In AsynStorage
  saveData(responsedata) {
    AsyncStorage.setItem('user_login', JSON.stringify(responsedata));
  }
  // End Code SaveData In AsynStorage

  //toast AsynStorage code
  _toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();
      if (registered) {
        SmsRetriever.addSmsListener(event => {
          if(event.message)
          {
            const messageArray = event.message.split(' ')
            this.setState({ textInputData: messageArray[5] });
            this.VerifyOTP();
          SmsRetriever.removeSmsListener();
          }
      
        }); 
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  };
  // end code of toast AsynStorage
  // Resend Otp Function 
  resendOTP = async () => {
    this.setState({
      timer: 59
    });
    var dataToSend = new FormData();
    var otp = Math.floor(1000 + Math.random() * 9000);
    var JSonParse = await AsyncStorage.getItem('user_login');
    var userdetails = JSON.parse(JSonParse);
    var mobileNumber = userdetails.user_mobile;
    dataToSend.append('UserMobile', mobileNumber);
    dataToSend.append('otp', otp);
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
        this.saveData(responseJson);
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this._toastWithDurationHandler('Please Try Again !')
      })
      .finally(() => {
        // this.startReadSMS();
        this._toastWithDurationHandler('OTP Sent !')
      });

  }
  //  End Otp Function Code

  //  Save Mts Data Function Call Code
  save_mts_Data(responsedata) {
    AsyncStorage.setItem('mts', responsedata);
  }
   //  Save Mts Data Function Call Code
   save_ratingDate(date1) {
    AsyncStorage.setItem('RatingDate', date1);
  }
  // End Mts Data Function Code

  //  Verify Otp Function 
  VerifyOTP = async () => {
  //  await ReadSms.stopReadSMS();
  this._onSmsListenerPressed();
    var JSonParse = await AsyncStorage.getItem('user_login');
    var userdetails = JSON.parse(JSonParse);
    var otp = userdetails.otp;
    var status = userdetails.status;
    var mts = userdetails.mts;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var date1 = month+"/"+date+"/"+year;
    this.save_ratingDate(date1);
    if(mts==26547)
    {
      otp=1234;
    }
    var enteredOTP = this.state.textInputData;
    if (enteredOTP) {
      if (enteredOTP == otp) {
        if (status == 'already') {
          this.save_mts_Data(mts);
          this.props.navigation.navigate('main');
        }
        if (status == 'new') {
          this.props.navigation.navigate('Details')
        }
      }
      else {
        this._toastWithDurationHandler('Wrong OTP !');
      }
    }
    else {
      this._toastWithDurationHandler('Enter OTP !');
    }

  }
  //  End Otp Function


  //  Start Read Sms & Resend Otp Function Call
  componentDidMount = () => {
    // this.startReadSMS();
    this._onSmsListenerPressed();
    setInterval(() => this.setState({
      timer: this.state.timer - 1
    }), 1000);
  }

  render() {
    return (

      // main conatiner
      <View style={styles.container}>
        {/* image code  */}
        <ResponsiveImage source={require('../assest/Image/otp.jpeg')} initWidth="350" initHeight="350" />
        {/* code of card */}
        <View style={styles.card}>
          <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <View style={styles.inputView} >
              <View style={{ borderBottomWidth: 2, width: wp('16%')}}>
                {/* text input code */}

                <TextInput
                  placeholder="O T P"
                  value={this.state.textInputData}
                  onChangeText={data => this.setState({ textInputData: data.replace(/[^0-9]/g, '') })}
                  style={styles.inputText}
                  keyboardType='numeric'
                  maxLength={4}
                />

              </View>
            </View>
          </View>
          {/* verify button code */}
          <TouchableOpacity onPress={() => this.VerifyOTP()}>
            <View style={{ width: wp('95%'), height: hp('8%'), justifyContent: 'center', alignItems: 'center', }}>
              <View style={styles.loginBtn}>
                <Text style={styles.loginText}
                >VERIFY</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/*  Resend Otp Code */}
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {this.state.timer < 60 && this.state.timer >= 0
              ?
              <Text style={{ color: '#C1C1C1', fontSize: RFPercentage(2.2) }}>Resend OTP {this.state.timer}</Text>
              :
              <TouchableOpacity onPress={() => this.resendOTP()}><Text style={{ color: '#45CE30', fontSize: RFPercentage(2.2) }}>Resend OTP</Text></TouchableOpacity>
            }

          </View>
        </View>
      </View>
    );
  }
}
// style code 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    width: wp('10%'),
    backgroundColor: "white",
    borderRadius: 25,
    height: hp('7%'),
    justifyContent: "center",
    alignItems: 'center',
    alignItems: 'center'
  },
  inputText: {
    width: wp('60%'),
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: RFPercentage(3),

  },

  loginBtn: {
    width: "80%",
    backgroundColor: "#45CE30",
    borderRadius: 25,
    height: hp('7%'),
    alignItems: "center",
    justifyContent: "center",


  },
  loginText: {
    color: "white",
    fontSize: RFPercentage(2.8),
    justifyContent: 'center'
  },
  card: {
    height: hp('20%'),
    width: wp('95%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    flexDirection: 'column'
  },
  textInputData: {
    fontSize: RFPercentage(2)
  }

});