import React, { Fragment, Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import Detailsanimation from './Detailsanimation';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import RNFS from 'react-native-fs';
import { Alert } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      textInputData: '',
      getValue: '',
      selectedButton: '',
      isloading: false,
      isLoadingLogin: false,
      referal:true,
      RefferalID:'',
      filepath: {
        data: '',
        uri: ''
      },
      fileData: '',
      fileUri: ''
    }
  }

  state = {
    DATA: [
      {
        id: "1",
        profile_pic: require('../assest/Image/male.jpeg'),
        gender: 'male',

      },
      {
        id: "2",
        profile_pic: require('../assest/Image/female.jpeg'),
        gender: 'female'
      },

    ],
    colors: '#45CE30',
    buttonColor: 'white',


  }
  //  Choose Image Pick Function Code
  chooseImage = () => {
    let options = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      cropping: true,
      maxHeight: 800, //speeds up compressImage to almost no time
      maxWidth: 800, //speeds up compressImage to almost no time
      compressImageQuality: 0.4,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      {
        this.setState({
          filePath: response,
          fileData: response.data,
          fileUri: response.uri,
        });
        this.converBase64();
      }
    });
  }
  // End Choose Image Pick Function Code

  //Converting Image into base64 encode string
  converBase64 = async () => {
   
    RNFS.readFile(this.state.fileUri, 'base64')
      .then(res => {
        this.setState({
          isloading:true
        });
        this.ImageUpload(res);
      });
  }
  // end of base64 function

  //Upload Image to server
  ImageUpload = async (base64Image) => {
    var dataToSend = new FormData();
    var JSonParse = await AsyncStorage.getItem('user_login');
    var userdetails = JSON.parse(JSonParse);
    var mts = userdetails.mts;
    dataToSend.append('mts', mts);
    dataToSend.append('image', base64Image);
    fetch('https://www.buy4earn.com/checking/image_upload_profile.php', {
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
        if (responseJson.Status == 'OK') {
          this._toastWithDurationHandler('Image Uploaded !');
          this.setState({
            isloading: false,
          });
        }
        else {
          this._toastWithDurationHandler('Please Try Again !');
          this.setState({
            isloading: false,
          });
        }
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        console.log(error);
        this._toastWithDurationHandler('Please Try Again !')
      });
  }
  // End of Image Upload Function


  //  Selection on press Gender function
  selectionOnPress(userType) {
    this.setState({ selectedButton: userType });
  }
  //  End Selection on press Gender function
  //toast code
  _toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  //Login Function
  loginProcess = async () => {
   
    if(this.state.textInputData!=''&&this.state.selectedButton!='')
    { 
      this.setState({
      isLoadingLogin:true
    });
      var dataToSend = new FormData();
      var JSonParse = await AsyncStorage.getItem('user_login');
      var userdetails = JSON.parse(JSonParse);
      var mts = userdetails.mts;
      var UserMobile = userdetails.user_mobile;
      dataToSend.append('mts', mts);
      dataToSend.append('UserMobile', UserMobile);
      dataToSend.append('name', this.state.textInputData);
      dataToSend.append('gender', this.state.selectedButton);
      dataToSend.append('initid', this.state.RefferalID);
      console.log(this.state.RefferalID);
      fetch('https://www.buy4earn.com/React_App/New_User_Details_Update.php', {
        method: 'POST',
        body: dataToSend,
        headers: {
          'Content-Type': 'multipart/form-data; ',
        }
        //Request Type 
      })
        .then((response) => response.json())
        //If response is in json then in success
        .then(async(responseJson) => {
          if (responseJson.status == 'yes') {
            this.setState({
              isLoadingLogin: false,
            });
            this.save_mts_Data(mts);
            
            var srid=await AsyncStorage.getItem('srid');
            if(srid)
            {
              this.props.navigation.navigate('Product',{itemid:srid});
            }
            else
            {
            this.props.navigation.navigate('main');  
            }
          }
          else {
            this._toastWithDurationHandler('Please Try Again !');
            this.setState({
              isLoadingLogin: false,
            });
          }
        })
        //If response is not in json then in error
        .catch((error) => {
          //Error 
          console.log(error);
          this._toastWithDurationHandler('Please Try Again22 !')
        });
    }
    else
    {
      this._toastWithDurationHandler('Invalid Details !');
    }
    
  }
  //End Login Funtion
  // Image Picker Code 

  //  End Image Picker Code
  save_mts_Data(responsedata) {
    AsyncStorage.setItem('mts', responsedata);
  }
  render() {
    return (
      <Fragment>
        
        <StatusBar barStyle="dark-content" />
        
        {/*  Main Container Code */}
        <SafeAreaView style={styles.container}>
        {this.state.isLoadingLogin != '' ? <Detailsanimation /> : (
        <View>
          {/* Profile Image Code */}
          <View style={{ height: hp('25%'), justifyContent: 'center', alignItems: 'center', }}>
          
            <View>
              <TouchableOpacity onPress={this.chooseImage}  >
                {this.state.fileData ?
                  [
                    (this.state.isloading
                      ?
                      <View style={{width:170, height:170, borderRadius:100, borderWidth:6, borderColor:'#45CE30', justifyContent:'center', alignItems:'center' }}>
                      <ActivityIndicator size="large" color="#00ff00" />
                      </View>
                      :
                      <ResponsiveImage source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }} initWidth="170" initHeight="170"
                        style={{ borderRadius: 100, borderWidth:6, borderColor:'#45CE30' }}
                      />

                    )
                  ]
                  :
                  <ResponsiveImage source={require('../assest/Image/male.jpeg')} initWidth="170" initHeight="170"
                    style={{ borderRadius: 100, borderWidth:6, borderColor:'#45CE30' }}
                  />}
                  {this.state.isloading?null:
                <ResponsiveImage source={require('../assest/Image/EditCamera.jpeg')} initWidth="50" initHeight="50" style={{ marginLeft: wp('25%'), marginTop: hp('-7%') }} />
              }
              </TouchableOpacity>
            </View>
          </View>
          {/* End Profile Image Code */}

          {/* Card Code  */}
          <View style={styles.card}>
            {/* code of input field */}
            <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('2%'), }}>
              <View style={styles.inputView} >
                <View style={{ borderBottomWidth: 2 }}>
                  <TextInput
                    placeholder="Enter Your Full Name"
                    value={this.state.textInputData}
                    onChangeText={data => this.setState({ textInputData: data })}
                    style={styles.inputText}
                    maxLength={40}
                  /></View>
              </View>
            </View>
            {/* code of gender text */}
            <View style={{ marginLeft: wp('7%') }}>
              <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold', color: "#45CE30" }}>
                GENDER
             </Text>
            </View>
            {/* code of selected genders */}
            <View style={{ flexDirection: 'row', width: wp('95%'), justifyContent: 'center', alignItems: 'center', }}>
              {/* code of male gender */}
              <View style={{ width: wp('35%'), height: hp('20%'), justifyContent: 'center', alignItems: 'center',}}>
                <TouchableOpacity
                  onPress={() => this.selectionOnPress("male")}   >

                  <View style={{
                    width: wp('35%'), height: hp('18%'), borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor:
                      this.state.selectedButton === "male"
                        ? "#45CE30"
                        : "white", borderRadius: 100
                  }}>
                    <ResponsiveImage source={require('../assest/Image/male.jpeg')} initWidth="100" initHeight="100"style={{marginTop:hp('2%')}} />
                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2) }}>MALE</Text>
                  </View>

                </TouchableOpacity>

              </View>
              {/* code of female gender */}
              <View style={{ width: wp('35%'), height: hp('20%'), justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => this.selectionOnPress("female")}  >


                  <View style={{
                    width: wp('35%'), height: hp('18%'), borderRadius: 100, justifyContent: 'center', alignItems: 'center', backgroundColor:
                      this.state.selectedButton === "female"
                        ? "#45CE30"
                        : "white", borderRadius: 100
                  }}>
                    <ResponsiveImage source={require('../assest/Image/female.jpeg')} initWidth="100" initHeight="100"style={{marginTop:hp('2%')}} />
                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2) }}>FEMALE</Text>
                  </View>

                </TouchableOpacity>

              </View>
            </View>
           {this.state.referal==true?   <View>
          <Text style={{textAlign:"center",color:'#45ce30'}}
           onPress={() => {
              this.setState({referal:false})
          }}
          >
            Have a Refral Code?
          </Text>
          </View>:
         <View style={{justifyContent:'center',alignItems:'center'}}>
         <TextInput
                   placeholder="Enter Referal Code"
                   value={this.state.RefferalID}
                   
                   onChangeText={data => this.setState({ RefferalID: data.replace(/[^0-9]/g, '')})}
                   style={styles.inputText1}
                   maxLength={10}
                   keyboardType='numeric'
                 />
         </View>
          }
         
        
            {/* code of login button */}
            <TouchableOpacity onPress={() => this.loginProcess()}>
              <View style={{ width: wp('95%'), justifyContent: 'center', alignItems: 'center', }}>
                <View style={styles.loginBtn}>
                  <Text style={styles.loginText}
                  >LOGIN</Text>

                </View>
              </View>
            </TouchableOpacity>
          </View>
      
          </View>
        )}
        </SafeAreaView>
      </Fragment>
    );
  }
};
// Styling Code 
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },

  container: {
    
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('100%')
  },

  inputView: {
    width: wp('80%'),
    backgroundColor: "white",
    height: hp('7%'),
    justifyContent: "center",
    alignItems: 'center',
    alignItems: 'center',

  },
  inputText: {
    width: wp('80%'),
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: RFPercentage(3)

  },
  inputText1: {
    width: wp('80%'),
    color: "black",
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: RFPercentage(2),
    alignSelf:'center',
    borderWidth:1,
    borderColor:'#ebebe0',
    borderRadius:10

  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#45CE30",
    borderRadius: 10,
    height: hp('7%'),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp('2%')
  },
  loginText: {
    color: "white",
    fontSize: RFPercentage(2.8),
    justifyContent: 'center'
  },
  card: {
    height: hp('50%'),
    width: wp('95%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',
    flexDirection: 'column',
    marginTop: hp('2%')
  },

});
