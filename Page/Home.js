//import react in our code
import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, ToastAndroid, ActivityIndicator, BackHandler, Modal, TouchableOpacity, Linking,Vibration,Dimensions,Image,LogBox} from 'react-native';
import { Button, Content, Container, Header, } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PlaceHolderImage from 'react-native-placeholderimage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LIfeStyle from './LIfeStyle';
import DailyNeeds from './DailyNeeds'
import InAppReview from 'react-native-in-app-review';
import VersionNumber from 'react-native-version-number';
import Carousel from 'react-native-banner-carousel';
// import View from 'react-native-View';
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = hp('25%');
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CategoryData: '',
      TotalPoints: '',
      Trending: '',
      Suggestion: '',
      isLoading: true,
      images: '',
      maxlimit: 35,
      onRegister: false,
      backbuttonpresse: 0,
      pagename: '',
      AlternateNumber: '',
      AddressName: '',
      Address: '',
      RecentViewCount: '',
      modalVisible: true,
      modalVisible1: true,
      notificationImage: null,
      cart: [],
      selectedId: null,
      selectedId1:null,
      version:null,
      FlashImage: '',
      FlashData: [],  
      catpage:'',
      FlashSale:'',
      mts: '',
    }
  }

  // auto call function page load
  componentDidMount = async () => {
    this.HomeApi();
    InAppReview.isAvailable();
    this.onReview();
    this.sendtoken();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.HomeApi();
    });
  
  }

  // function again call 
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
    
  }
    // backaction function code
    backAction = () => {
      
      this.state.backbuttonpresse = this.state.backbuttonpresse + 1;
      setTimeout(() => {
        this.state.backbuttonpresse = 0;
      }, 2000);
      if (this.state.backbuttonpresse == 2) {
        BackHandler.exitApp()
        this.state.backbuttonpresse = 0;
      }
      else {
        this.toastWithDurationHandler('Please click BACK againt to exit');
      }
      return true;
    };
    save_ratingDate(date1) {
      AsyncStorage.setItem('RatingDate', date1);
    }
    onReview = async () => {
      var date = new Date().getDate();
      var month = new Date().getMonth() + 1;
      var year = new Date().getFullYear();
      var date1 = new Date(await AsyncStorage.getItem('RatingDate'));
      var date2 = new Date(month+"/"+date+"/"+year);
      var diffInMs = Math.abs(date2 - date1);
      var diffDays = diffInMs / (1000 * 60 * 60 * 24);

      if(diffDays>15)
      {
       
      var date3 = month+"/"+date+"/"+year;
      this.save_ratingDate(date3);
      InAppReview.RequestInAppReview()
    .then((hasFlowFinishedSuccessfully) => {
      // when return true in android it means user finished or close review flow
      console.log('InAppReview in android', hasFlowFinishedSuccessfully);
  
      // when return true in ios it means review flow lanuched to user.
      console.log(
        'InAppReview in ios has lanuched successfully',
        hasFlowFinishedSuccessfully,
      );
  
      // 1- you have option to do something ex: (navigate Home page) (in android).
      // 2- you have option to do something,
      // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).
  
      // 3- another option:
      if (hasFlowFinishedSuccessfully) {
        // do something for ios
        // do something for android

      }
  
      // for android:
      // The flow has finished. The API does not indicate whether the user
      // reviewed or not, or even whether the review dialog was shown. Thus, no
      // matter the result, we continue our app flow.
  
      // for ios
      // the flow lanuched successfully, The API does not indicate whether the user
      // reviewed or not, or he/she closed flow yet as android, Thus, no
      // matter the result, we continue our app flow.
    })
    .catch((error) => {
      //we continue our app flow.
      // we have some error could happen while lanuching InAppReview,
      // Check table for errors and code number that can return in catch.
      console.log(error);
    });
    
    };
    }
  // Home Api calling function
  toggleModal(visible) {
    this.setState({ modalVisible: visible })
  }
toggleModal1(visible) {
   this.setState({modalVisible1: visible})
 }
  HomeApi = async () => {
    this.setState({ isLoading: true })
    var local = '1';
    AsyncStorage.setItem('local', local);
    var mtsLogin = await AsyncStorage.getItem('mts');
    this.setState({mts:mtsLogin})
    console.log(mtsLogin);
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    await fetch('https://www.buy4earn.com/React_App/HomeApi.php', {
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
        this.setState({
          CategoryData: responseJson.HomeApi.Category,
          TotalPoints: responseJson.HomeApi.UserDetails.total_points,
          images: responseJson.HomeApi.Banner,
          Trending: responseJson.HomeApi.Trending,
          Suggestion: responseJson.HomeApi.Suggestion,
          pagename: responseJson.HomeApi.HomeProducts,
          AlternateNumber: responseJson.HomeApi.Address.AlternateNumber,
          AddressName: responseJson.HomeApi.Address.AddressName,
          Address: responseJson.HomeApi.Address.Address,
          RecentViewCount: responseJson.HomeApi.RecentViewCount,
          notificationImage: responseJson.HomeApi.notification.image,
          version:responseJson.HomeApi.Version,
          FlashImage: responseJson.HomeApi.falshimage,
          FlashData: responseJson.HomeApi.flashproduct,
          catpage:responseJson.HomeApi.catpage,
          FlashSale:responseJson.HomeApi.flashsale,
        })
        this.LoadCartData();
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {
        this.setState({ isLoading: false });
        
      });
  }
  // toast message code function

  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }

  // Send Token

  sendtoken=async()=>{
    var mtsLogin = await AsyncStorage.getItem('mts');
    var JSonParse =await AsyncStorage.getItem('token');
    var token = JSON.parse(JSonParse);
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('Token', token.token);
    dataToSend.append('OS', token.os);
    dataToSend.append('AppVersion', VersionNumber.appVersion);
    // console.log(mtsLogin, token.token, token.os, VersionNumber.appVersion);
    await fetch('https://www.buy4earn.com/React_App/SaveToken.php', {
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
        // SetSearchData(responseJson);
        console.log(responseJson)

      })
      //If response is not in json then in error
    
      
  }

// Start Of Cart System
  // add cart data fucntion
  addItemToCart = (srid, AddedQty) => {
    for (var i in this.state.cart) {
      if (this.state.cart[i].srid === srid) {
        this.state.cart[i].AddedQty = AddedQty;
        this.SaveCartData();
        return;
      }
    };
    var itemsNew = {
      srid: srid,
      AddedQty: AddedQty
    };
    this.state.cart.push(itemsNew);
    this.SaveCartData();
  };
  // Remove Item From Cart
  removeItemFromCart = (srid) => {
    for (var i in this.state.cart) {
      if (this.state.cart[i].srid === srid) {
        this.state.cart.splice(i, 1);
        break;
      }
    }
    this.SaveCartData();
  };
  // SaveCart Data function

  SaveCartData = async () => {
    await AsyncStorage.setItem('cartdata', JSON.stringify(this.state.cart));
  };
  // loadcart data function

  LoadCartData = async () => {

    this.setState({cart:JSON.parse(await AsyncStorage.getItem('cartdata'))});
    if(this.state.cart==null)
    {
      this.setState({cart:[]});
    }
    if(this.state.cart!=null)
    {
    var DataArray = [...this.state.Trending];
    var DataArraySuggestion = [...this.state.Suggestion];
    for (var i in this.state.cart) 
    {
      var elementsIndex='';
      elementsIndex = DataArray.findIndex(element => element.srid == this.state.cart[i].srid);
      if(elementsIndex!=-1)
      {
      DataArray[elementsIndex]['AddedQty'] = this.state.cart[i].AddedQty.toString();
      DataArray[elementsIndex]['AddButton'] = false;
      }
      var elementsIndexSuggestion='';
      elementsIndexSuggestion = DataArraySuggestion.findIndex(element => element.srid == this.state.cart[i].srid);
      if(elementsIndexSuggestion!=-1)
      {
      DataArraySuggestion[elementsIndexSuggestion]['AddedQty'] = this.state.cart[i].AddedQty.toString();
      DataArraySuggestion[elementsIndexSuggestion]['AddButton'] = false;
      }
    }
    this.setState({ Trending: DataArray});
    this.setState({ Suggestion: DataArraySuggestion});
    }
    
  };

  // add button
  addbutton = (index, srid, AddedQty) => {
    let DATAArray = [ ...this.state.Trending ];
    AddedQty = Number(AddedQty) + 1;
    if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
      AddedQty = Number(DATAArray[index]['available_quantity']);
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({Trending:DATAArray});
  };
  //  Minus To Cart
  MinusButton = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty) - 1;
    let DATAArray = [ ...this.state.Trending ];
    if (AddedQty <= 0) {
      AddedQty=0;
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=true;
      this.removeItemFromCart(srid);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    
  }
  //  Cart qty change
  CartQuantityChange = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty);
    let DATAArray = [ ...this.state.Trending ];
    if (AddedQty <= 0) {
      AddedQty = 1;
      DATAArray[index].AddedQty='';
      this.addItemToCart(srid, AddedQty);
    }
    else {
      if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
        AddedQty = Number(DATAArray[index]['available_quantity']);
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }
      else {
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }

    }
    this.setState({Trending:DATAArray});
  };
   // dailyneeds
   
   // Start Suggestion Buttons
// Suggestion add button
addbuttonSuggestion = (index, srid, AddedQty) => {
  let DATAArray = [ ...this.state.Suggestion ];
    AddedQty = Number(AddedQty) + 1;
    if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
      AddedQty = Number(DATAArray[index]['available_quantity']);
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({Suggestion:DATAArray});
};
  //  Suggestion Minus To Cart
  MinusButtonSuggestion =(index, srid, AddedQty)=>{
    AddedQty = Number(AddedQty) - 1;
    let DATAArray = [ ...this.state.Suggestion ];
    if (AddedQty <= 0) {
      AddedQty=0;
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=true;
      this.removeItemFromCart(srid);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    
  }
  //  Suggestion Cart qty change
  CartQuantityChangeSuggestion =(index, srid, AddedQty)=>{

    AddedQty = Number(AddedQty);
    let DATAArray = [ ...this.state.Suggestion ];
    if (AddedQty <= 0) {
      AddedQty = 1;
      DATAArray[index].AddedQty='';
      this.addItemToCart(srid, AddedQty);
    }
    else {
      if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
        AddedQty = Number(DATAArray[index]['available_quantity']);
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }
      else {
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }

    }
    this.setState({Suggestion:DATAArray});
  };
// End Suggestion Buttons
  // End of cart System


  // render item of trending data &suggetsion data
  renderItem = ({ item, index }) => (
    <LIfeStyle
      index={index}
      item={item}
      addbutton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.addbutton(index, item.srid, item.AddedQty); }}
      MinusButton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.MinusButton(index, item.srid, item.AddedQty); }}
      CartQuantityChange={(value) => { this.setState({ selectedId: item.srid }); this.CartQuantityChange(index, item.srid, value.replace(/[^0-9]/g, '')); }}
      navigationpage={()=>{this.props.navigation.navigate('Product',{itemid:item.srid,page:'page1'})}}
      selectedId={this.state.selectedId}
    />
  );
  renderItem2= ({ item, index }) => (
    <DailyNeeds
      index={index}
      item={item}
      addbuttonSuggestion={() => { this.setState({ selectedId1: item.srid }); Vibration.vibrate(10); this.addbuttonSuggestion(index, item.srid, item.AddedQty); }}
      MinusButtonSuggestion={() => { this.setState({ selectedId1: item.srid }); Vibration.vibrate(10); this.MinusButtonSuggestion(index, item.srid, item.AddedQty); }}
      CartQuantityChangeSuggestion={(value) => { this.setState({ selectedId1: item.srid }); this.CartQuantityChangeSuggestion(index, item.srid, value.replace(/[^0-9]/g, ''));}}
      navigationpageDailyNedds={()=>{this.props.navigation.navigate('Product',{itemid:item.srid,page:'page1'})}}
      selectedId1={this.state.selectedId1}
    />
  );


 
  // this is the code of render item categories
  renderItem1 = ({item}) => (
    <View style={styles.Card3}>
      <TouchableWithoutFeedback
        onPress={() =>
          this.props.navigation.navigate('Category', {
            category_name: item.pageName,
          })
        }>
        <View style={styles.card1}>
          <View
            style={{
              width: wp('30%'),
              height: hp('13%'),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item.colour,
              borderRadius: 6,
            }}>
            <PlaceHolderImage
              style={{
                height: hp('10%'),
                width: wp('22%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={{uri: `${item.image}`}}
              placeHolderURI={require('../assest/Image/AvtarImage.png')}
              placeHolderStyle={{height: 70, width: 70}}
              resizeMethod="resize"
            />
          </View>
          <View
            style={{
              width: wp('30%'),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: item.textcolour,
              height: hp('5%'),
              borderRadius: 6,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: RFPercentage(1.8),
                color: '#fff',
              }}>
              {item.category_name}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
  renderItem5 = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() =>
        this.props.navigation.navigate('Product', {
          itemid: item.srid,
          page: 'page1',
        })
      }>
        <View style={styles.card5}>
          <View
            style={{
              width: wp('17%'),
              height: hp('8%'),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <PlaceHolderImage
              style={{
                height: hp('7%'),
                width: wp('16%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={{uri: `${item.image_path}`}}
              placeHolderURI={require('../assest/Image/AvtarImage.png')}
              placeHolderStyle={{height: 20, width: 20}}
              resizeMethod="resize"
            />
          </View>
        </View>
    </TouchableWithoutFeedback>
  );
  renderPage(image, index) {
    return (
        <View  style={{width:wp('100%'),justifyContent:'center',alignItems:'center',}}key={index}>
            <Image style={{ width: wp('95%'),borderRadius:10, height: BannerHeight }} source={{ uri: image }} />
        </View>
    );
}
  render() {
    return (
      //full container code
      <Container>
        {/* Header code */}
        <Header style={{ height: hp('14%'), width: wp('100%'), backgroundColor: '#45CE30', }}>
          <View style={{ flexDirection: 'column', width: wp('100%') }}>
            {/* code for 1st row of heading */}
            <View style={{ flexDirection: 'row', marginTop: hp('1%'), height: hp('5%'), }}>
              <View style={{ width: wp('12%'), justifyContent: "center", alignContent: "center", }}>
                <TouchableWithoutFeedback
                  onPress={() => this.props.navigation.openDrawer()}
                >
                  <Button transparent>
                    <ResponsiveImage source={require('../assest/Image/drawers.jpeg')} initWidth="30" initHeight="30" />
                  </Button>
                </TouchableWithoutFeedback>
              </View>
              {/* Delivery code */}
              <View style={{ width: wp('80%'), justifyContent: 'flex-start', }}>
                <Text style={{ color: '#fff' }}>Delivery Location</Text>
                {this.state.Address ?

                  <Text style={{ color: 'white', fontSize: RFPercentage(2.2) }}>{((this.state.Address).length > this.state.maxlimit) ?
                    (((this.state.Address).substring(0, this.state.maxlimit - 3)) + '...') :
                    this.state.Address}</Text> :
                  (
                    <Text style={{ color: '#fff' }}>Delivery Address Not Found!!</Text>
                  )
                }
              </View>
            </View>
            {/* second row code */}
            <View style={{ flexDirection: 'row', height: hp('7%'), width: wp('95%'), marginTop: hp('1.5%') }}>
                  {/* code of SearchPage */}
                  <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Search')}>
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'white',
                    width: wp('95%'),
                    height: hp('5%'),
                    borderRadius: 6,
                    marginLeft: wp('2%'),
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <ResponsiveImage
                    source={require('../assest/Image/Search.png')}
                    initWidth="25"
                    initHeight="25"
                    style={{marginLeft: wp('2%')}}
                  />
                  <Text style={{color: 'grey', fontSize: RFPercentage(2.5)}}>
                    Search products....
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Header>
        {/* Header code end */}

        <Content>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
          <View>
            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('80%'), justifyContent: 'center', alignItems: 'center' }} /> : (
              <View style={{ flexDirection: 'column', }}>
                {/* code of slider box of banner */}
                <View style={{ flexDirection: 'row', width: wp('100%'), height: hp('25%'), alignItems: 'center', marginTop: hp('1%'), justifyContent: 'space-between'}}>
                  <Carousel
                    autoplay
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageSize={BannerWidth}
                >
                    {this.state.images.map((image, index) => this.renderPage(image, index))}
                </Carousel>
                </View>
   {/* Banner Code */}
                <View
                  style={{
                    flexDirection: 'row',
                    width: wp('100%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <TouchableWithoutFeedback
                   onPress={() => this.props.navigation.navigate('Category', { category_name: 'GroceryAndStaples', })}>
                    <View
                      style={{
                        width: wp('48%'),
                        height: hp('18%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <ResponsiveImage
                        source={require('../assest/Image/CategoryBy.jpeg')}
                        initWidth="190"
                        initHeight="125"
                        style={{borderRadius: 10}}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('NewArrival')}>
                  <View
                    style={{
                      width: wp('48%'),
                      height: hp('18%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ResponsiveImage
                      source={require('../assest/Image/Recent.jpeg')}
                      initWidth="190"
                      initHeight="125"
                      style={{borderRadius: 10}}
                    />
                  </View>
                  </TouchableWithoutFeedback>
                </View>
                {/* End Banner Code */}
                {/* Trending code */}
                <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Trending', { pagename: this.state.pagename[0], })} >
                    <View style={{ width: wp('90%'), marginLeft: wp('2%'), }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.pagename[0]}</Text>
                    </View>
                  </TouchableOpacity>
                  {/* trending arrow code */}
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Trending', { pagename: this.state.pagename[0], })} >
                    <View style={{ width: wp('6%'), marginRight: wp('2%') }}>
                      <ResponsiveImage source={require('../assest/Image/RightArrow.jpeg')} initWidth="20" initHeight="20" /></View>
                  </TouchableOpacity>
                </View>
                {/* Trending flatlist */}
                <FlatList
                  data={this.state.Trending}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.srid}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state.selectedId}
                />
 {/* modal code notification for update */}
                {this.state.version > VersionNumber.appVersion ?
                  <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                      this.toggleModal(!this.state.modalVisible)
                    }}>
                    <View style={styles.centeredView}>

                      <View style={styles.modalView}>
                        <View style={{height:hp('15%'),justifyContent:'center',alignItems:'center'}}> 
                        <ResponsiveImage
                          style={{ height: hp('10%'), width: wp('20%'), alignSelf: 'center', justifyContent: 'center' }}
                          source={require('../assest/Image/Update.jpeg')} initWidth="100" initHeight="100"
                        />
                        <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold',color:'red'}}>
                         New Update Avilable !
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableOpacity
                            onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=com.buy4earn.www")}
                          >
                            <View style={{ height: hp('5%'), width: wp('27%'), margin: wp('2%'), borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: '#45ce30',marginTop:hp('3%') }} >
                              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: RFPercentage(2) }}>Update Now</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    </View>
                  </Modal>
                  : (
                    null
                  )
                }
                {/* modal code notification for massage*/}

                {this.state.notificationImage?
                  <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible1}
                    onRequestClose={() => {
                      this.toggleModal1(!this.state.modalVisible1)
                    }}>
                    <View style={styles.centeredView}>

                      <View style={styles.modalView}>
                        <View style={{height:hp('28%'),justifyContent:'center',alignItems:'center'}}>
                        <PlaceHolderImage
                          style={{  height: hp('22%'), width: wp('45%'), alignSelf: 'center', justifyContent: 'center' }}
                          source={{ uri: `${this.state.notificationImage}` }}
                          placeHolderURI={require('../assest/Image/AvtarImage.png')}
                          placeHolderStyle={{ height: 80, width: 80 }}
                        />
                        <View style={{ flexDirection: 'row' }}>

                          <TouchableOpacity
                            onPress={() => this.toggleModal1(false)}
                          >
                            <View style={{ height: hp('5%'), width: wp('25%'), margin: wp('2%'), borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red',marginTop:hp('2%') }} >
                              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: RFPercentage(2) }}>OK</Text>
                            </View>
                          </TouchableOpacity>
                        
                        </View>
                      </View>
                    </View>
                    </View>
                  </Modal>
                  : (
                    null
                  )
                }
                 {/* point code */}
                 {this.state.mts == '' || this.state.mts == null ? (
                  <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('Login')}>
                    <View
                      style={{
                        height: hp('10%'),
                        width: wp('100%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: hp('10%'),
                          width: wp('95%'),
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#45CE30',
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            height: hp('10%'),
                            width: 'auto',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: 30,
                            }}>
                            Login/Signup
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('Dashboard')}>
                    <View
                      style={{
                        height: hp('10%'),
                        width: wp('100%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: hp('10%'),
                          width: wp('95%'),
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#45CE30',
                          borderRadius: 10,
                        }}>
                        <View
                          style={{
                            height: hp('10%'),
                            width: 'auto',
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: 30,
                            }}>
                            Points : {this.state.TotalPoints}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: 'auto',
                            height: hp('10%'),
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            marginLeft: wp('1'),
                          }}>
                          <ResponsiveImage
                            source={require('../assest/Image/b4e_coin.jpeg')}
                            initWidth="30"
                            initHeight="30"
                            resizeMethod="resize"
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                )}
    {/* Flash Sale Code */}
    <View
                  style={{
                    marginTop: hp('1%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <TouchableWithoutFeedback   onPress={() => {
        this.props.navigation.navigate('SubProduct', {
          SubCategoryName:this.state.catpage,
          pagename:'Home'
        });
      }}>
                  <ResponsiveImage
                    source={{uri: this.state.FlashImage}}
                    initWidth="400"
                    initHeight="80"
                    style={{borderRadius: 10}}
                  />
                  </TouchableWithoutFeedback>
                </View>
                <View
                  style={{
                    width: wp('35%'),
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: wp('2%'),
                    borderRadius: 5,
                    opacity: 5,
                    backgroundColor: 'red',
                  }}>
                  <Text
                    style={{
                      fontSize: RFPercentage(2),
                      fontWeight: 'bold',
                      textAlign: 'center',
                      backgroundColor: 'red',
                      color: '#fff',
                      
                    }}>
                    {this.state.FlashSale}
                  </Text>
                </View>
                <View style={{height: hp('10%')}}>
                  <FlatList
                    data={this.state.FlashData}
                    renderItem={this.renderItem5}
                    keyExtractor={item => item.srid}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>

                {/* suggestion code */}

                <View style={{ width: wp('100%'), marginTop: hp('1%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp('1%') }}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Suggestion', { pagename: this.state.pagename[1] })}
                  >
                    <View style={{ width: wp('90%'), marginLeft: wp('2%'), }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{this.state.pagename[1]}</Text>
                    </View>
                  </TouchableOpacity>
                  {/* arrow code of suggestion button */}
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Suggestion', { pagename: this.state.pagename[1] })}
                  >
                    <View style={{ width: wp('6%'), marginRight: wp('2%') }}>
                      <ResponsiveImage source={require('../assest/Image/RightArrow.jpeg')} initWidth="20" initHeight="20" resizeMethod='resize' />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* FlatList of suggestion item code */}
                <FlatList
                  data={this.state.Suggestion}
                  renderItem={this.renderItem2}
                  keyExtractor={item => item.srid}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  extraData={this.state.selectedId1}
                />

                   {/* category item code */}
                   <View style={{backgroundColor: '#f0f5f5'}}>
                  <View
                    style={{
                      width: wp('100%'),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{fontSize: RFPercentage(2), fontWeight: 'bold'}}>
                      Shop from Top Categories
                    </Text>
                  </View>
                  <FlatList
                    data={this.state.CategoryData}
                    renderItem={this.renderItem1}
                    keyExtractor={item => item.cid}
                    showsHorizontalScrollIndicator={true}
                    numColumns={3}
                  />
                </View>
                {/* recent view item code */}
                {this.state.RecentViewCount == 0
                  ?
                  null
                  : (
                    <View>
                      {this.state.mts == '' || this.state.mts == null ? (
                    null
                      ):
                      
                      <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center',paddingBottom:hp('0.5%') }}>
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Recent', { pagename: this.state.pagename[2] })}
                      >
                        <View style={{ width: wp('40%'), marginLeft: wp('2%'), height: hp('5%'), justifyContent: 'center', }}>
                          <Text style={{ fontSize: RFPercentage(3), fontWeight: 'bold', color: 'red' }}>{this.state.pagename[2]}</Text>
                        </View>
                      </TouchableOpacity>

                      
                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Recent', { pagename: this.state.pagename[2] })}
                      >
                        <View style={{ width: wp('6%'), marginRight: wp('2%'), height: hp('5%'), justifyContent: 'center', alignItems: 'center' }}>
                          <ResponsiveImage source={require('../assest/Image/RightArrow.jpeg')} initWidth="25" initHeight="25" />
                        </View>
                      </TouchableOpacity>
                      </View>
                      }

                    </View>
                  )
                }
              </View>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

//all style code
const styles = StyleSheet.create({
  //code of All Trending,suggestion and recent card
  card: {
    backgroundColor: '#fefefe',
    height: hp('30%'),
    width: wp('40%'),
    borderRadius: 10,
    elevation: 2,
    margin: wp('1.5%'),
  },

  // code of All Category card
  card1: {
    backgroundColor: '#f0f5f5',
    height: hp('18%'),
    width: wp('30%'),
    borderRadius: 10,
    elevation: 2,
    margin: wp('1.5%'),
    marginTop: hp('2%'),
  },
  card3: {
    backgroundColor: 'grey',
    height: 'auto',
    width: 'auto',
  },
  card5: {
    backgroundColor: '#ffffff',
    height: hp('8%'),
    width: wp('17%'),
    borderRadius: 10,
    elevation: 2,
    margin: wp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#99ff99',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "#fffdfc",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
});
