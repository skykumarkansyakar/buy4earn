//This is an example code for Navigation Drawer with Custom Side bar//
import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking, TouchableOpacity, } from 'react-native';
import ResponsiveImage from 'react-native-responsive-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView, } from 'react-native-gesture-handler';
import { RFPercentage } from "react-native-responsive-fontsize";
import RNRestart from 'react-native-restart';
import Share from 'react-native-share'
import AsyncStorage from '@react-native-async-storage/async-storage';
import filebase64 from '../Process/filebase64';
import LinearGradient from 'react-native-linear-gradient';
export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    this.state = {

      profile_picture: null,
      user_name: null,
      kyc_status: 'KYC Done',
      total_points: null,
      share_link: null,
      order1: '',
      mts:''
    };

  }
  async buildLink() {
    var SENDER_UID = await AsyncStorage.getItem('mts');
    //build the link
   const link=` https://www.by4n.in/invite?c=${SENDER_UID}`
    //see the output
    this.setState({share_link:link})
 
    
  }
  // Read Sms & BackHandler Function Call
  componentDidMount = async () => {
    this.FetchProfile();
    this.buildLink();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.FetchProfile();;
    });
  }
  // function again call 
  open_buy4earn = () => {

    Linking.openURL("https://play.google.com/store/apps/details?id=com.buy4earn.www");
  }

  FetchProfile = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    var order = await AsyncStorage.getItem('Ordernumber');
    this.setState({ order1: order, mts:mtsLogin })
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
      this.buildLink();
    fetch('https://www.buy4earn.com/React_App/user_details.php', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
    })
      .then((response) => response.json())
      .then((responseJson) =>{
        this.setState({
          user_name: responseJson.user_name,
          profile_picture: responseJson.profile_picture,
          kyc_status: responseJson.kyc_status,
          total_points: responseJson.total_points,
      

        })
      })
      .catch((error) => console.error(error));

  }
  componentWillUnmount() {

    this._unsubscribe();
  }

  // call function code
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  logout_button = async () => {
    try {
      await AsyncStorage.removeItem('user_login');
      await AsyncStorage.removeItem('cartdata')
      await AsyncStorage.removeItem('mts');
      RNRestart.Restart();
    }
    catch (exception) {
      this.toastWithDurationHandler('Please Try Again !');
    }
  }
   logIn_button=async()=>{
     this.props.navigation.navigate('Login');
   }
  render() {

    const onShare = async () => {
      const shareOptions = {
        title: 'Share file',
        message: `${this.state.share_link}`,
        url:filebase64.imgae,

      };

      try {
        await Share.open(shareOptions);
      } catch (error) {
        console.log('Error =>', error);
      }
    };
    return (
      <LinearGradient colors={['#b3ffb3','#ccffcc','#e6ffe6',  ]} style={styles.linearGradient}>
      <ScrollView
        showsVerticalScrollIndicator={false} 
      >

        <View style={styles.sideMenuContainer}>
          
        {this.state.mts == '' || this.state.mts == null ?
          <TouchableOpacity onPress={() => {

            this.props.navigation.navigate('Login');
          }}>
            <View style={{ borderRadius: 100, borderColor: '#45CE30', height: hp('19%') }}>
        <ResponsiveImage source={require('../assest/Image/male.jpeg')} initWidth="150" initHeight="150"/>
         </View>
            </TouchableOpacity>
        :(
          <TouchableOpacity onPress={() => {

this.props.navigation.navigate('Dashboard');
}}>
<View style={{ borderRadius: 100, borderColor: '#45CE30', height: hp('19%') }}>
  {this.state.profile_picture != null ?
    <ResponsiveImage source={{ uri: this.state.profile_picture }} initWidth="150" initHeight="150" style={{ borderRadius: 100, }} />
    :
    <ResponsiveImage source={require('../assest/Image/male.jpeg')} initWidth="150" initHeight="150" style={{ borderRadius: 100, }} />

  }
  {this.state.kyc_status == 'KYC Done' ?
    <ResponsiveImage source={require('../assest/Image/check.jpeg')} initWidth="40" initHeight="40" style={{ marginLeft: wp('25%'), marginTop: hp('-5%') }} />
    : null}

</View>
</TouchableOpacity>
        )}
          {/* Divider between Top Image and Sidebar Option */}
          <View style={{ marginTop: hp('1%'), justifyContent: 'center', alignItems: 'center', marginBottom: hp('1%') }}>
            <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5), textAlign: 'center', }}>{this.state.user_name}</Text>
          </View>
          {/* Line Code */}
          <View
            style={{
              width: '100%',
              height: hp('0.15'),
              backgroundColor: 'black',
              marginTop: hp('2%'),

            }}
          />

          {/*Setting up Navigation Options from option */}
          {/* Track Order */}
          {this.state.mts == '' || this.state.mts == null ?
          null
          :(
          <View style={{ width: '100%' }}>

            <TouchableOpacity onPress={() => {

              this.props.navigation.navigate('TrackOrder',
                {
                  orderID: '',
                  pagename: 'Home'
                }
              )
            }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/trackorder.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
                </View>

                <Text
                  style={{
                    fontSize: RFPercentage(2.5),
                  }}
                >
                  Track Order
              </Text>


              </View>
            </TouchableOpacity>

          </View>
          )}

          {/* Order History */}
          {this.state.mts == '' || this.state.mts == null ?
          null
          :(
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => {

              this.props.navigation.navigate('OrderHistory',
              {
                pagename: 'Home'
              });
            }}>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/orderhistory.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),
                  }}
                >
                  Order History
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          )}

          {/* Invite Friends */}
          {this.state.mts == '' || this.state.mts == null || this.state.mts == 'null'?
        null
          :(
          <View style={{ width: '100%' }}>

            <TouchableOpacity onPress={onShare}>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/invitefriends.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),
                  }}
                >
                  Invite Friends
          </Text>

              </View>
            </TouchableOpacity>

            <View
            style={{
              width: '100%',
              height: hp('0.15%'),
              backgroundColor: 'black',
              marginTop: hp('2%'),

            }}
          />
          </View>


          )}
          {/* Call us */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => { Linking.openURL(`tel:8448444943`) }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/callus.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),
                  }}
                >
                  Call us
          </Text>

              </View>
            </TouchableOpacity>

          </View>
          {/* Feedback */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity

              onPress={() => Linking.openURL('mailto:care@buy4earn.com?subject=Feedback')}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/feedback.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),
                  }}
                >
                  Feedback
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          {/*   How to */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => {

              this.props.navigation.navigate('HowTo',
              {
                pagename: 'Home'
              });
            }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/howto.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />

                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),

                  }}
                >
                  How To
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          {/* line */}
          <View
            style={{
              width: '100%',
              height: hp('0.15%'),
              backgroundColor: 'black',
              marginTop: hp('2%'),

            }}
          />
          {/* Rate us */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.buy4earn.www")}>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/ratting.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />


                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),

                  }}
                >
                  Rate us
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          {/* Privacy Policy */}
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => {

              this.props.navigation.navigate('Privicy',
              {
                pagename: 'Home'
              });
            }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),

                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/privacy.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />


                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),

                  }}
                >
                  Privacy Policy
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          {/* line */}
          <View
            style={{
              width: '100%',
              height: hp('0.15%'),
              backgroundColor: 'black',
              marginTop: hp('2%'),
            }}
          />

          {/* Logout */}
          {this.state.mts==''|| this.state.mts==null?

          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => {
              this.logIn_button();
            }}>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/logout.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />


                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),

                  }}
                >
                  LogIn
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          :(
          <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={() => {
              this.logout_button();
            }}>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: hp('2%'),
                  paddingBottom: hp('1%'),
                }}
              >
                <View style={{ marginRight: wp('2.5%'), marginLeft: wp('5%') }}>
                  <ResponsiveImage source={require('../assest/Image/logout.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />


                </View>
                <Text
                  style={{
                    fontSize: RFPercentage(2.5),

                  }}
                >
                  Logout
          </Text>

              </View>
            </TouchableOpacity>
          </View>
          )}

        </View>
        {/* </LinearGradient> */}
      </ScrollView>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: wp('70%'),
    height: '100%',
    // backgroundColor: '#f2f2f2',
    alignItems: 'center',
    paddingTop: hp('5%'),

  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 1
  },
});