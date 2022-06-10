//import react in our code.
import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, ToastAndroid,BackHandler, TextInput, Modal, Button,Alert} from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Container, Header, Content } from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage } from "react-native-responsive-fontsize";
import { SliderBox } from "react-native-image-slider-box";
import DropDownPicker from 'react-native-dropdown-picker';
import ReadMore from 'react-native-read-more-text';
import Share from 'react-native-share'
import ImageZoom from 'react-native-image-pan-zoom';
import Swiper from 'react-native-swiper'
import { BlurView } from "@react-native-community/blur";
export default class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      images1: [],
      DATA: '',
      isLoading: true,
      cart: [],
      itemid: null,
      AvailableSize: '',
      sendimage: '',
      page: '',
      modalVisible: false,
      mts:'',
      cartData:''
    }

  }
  
  // function call when open page
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('Home');
    return true;
  };
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this.fetchData(this.props.route.params.itemid, this.props.route.params.page);
  
    // this._interval = setInterval(() => {
    //   this.fetchcartdata();
    // }, 300);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData(this.props.route.params.itemid, this.props.route.params.page);
    });
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
    clearInterval(this._interval); 
  }
  fetchData = async (reciveid, page) => {
    var mtsLogin=await AsyncStorage.getItem('mts');
    this.setState({
      itemid: reciveid,
      page: page,
      mts:mtsLogin,
    });
      var dataToSend = new FormData();
      dataToSend.append('mts', mtsLogin);
      dataToSend.append('srid', reciveid);
      this.setState({ isLoading: true })
      fetch('https://www.buy4earn.com/React_App/ProductPage.php', {
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
            DATA: [responseJson.ProductDetail.ProductDetail],
            images:responseJson.ProductDetail.ImagePath,
          })
          this.changeimage(responseJson.ProductDetail.ImagePath)
          this.LoadCartData();
          this.ChangeArray(responseJson.ProductDetail.AvailableSize);
        
        })
        //If response is not in json then in error
        .catch((error) => {
          console.log(error)
          //Error 
          this.toastWithDurationHandler('Please Try Again !');;
        })
        .finally(() => this.setState({ isLoading: false }));

  
  }
changeimage=(imagerecieve)=>{
  var SendImageData = [];
  for (let i = 0; i < imagerecieve.length; i++) {
    var TempArray = { id: i + 1, url: imagerecieve[i] };
    SendImageData.push(TempArray);
    this.setState({images1:SendImageData})
  }
}
  toggleModal(visible) {
    this.setState({ modalVisible: visible })
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

    this.setState({ cart: JSON.parse(await AsyncStorage.getItem('cartdata')) });
    if (this.state.cart == null) {
      this.setState({ cart: [] });
    }

    let DATAArray = [...this.state.DATA];
    for (var i in this.state.cart) {
      var index = '';
      index = DATAArray.findIndex(element => element.srid == this.state.cart[i].srid);
      if (index != -1) {
        DATAArray[index].AddedQty = this.state.cart[i].AddedQty.toString();
        DATAArray[index].AddButton = false;

      }
    }
    this.setState({ DATA: DATAArray });

  }


  // add button
  addbutton = (index, srid, AddedQty) => {

    let DATAArray = [...this.state.DATA];
    AddedQty = Number(AddedQty) + 1;
    if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
      AddedQty = Number(DATAArray[index]['available_quantity']);
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    else {
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({ DATA: DATAArray });
  };
  //  Minus To Cart
  MinusButton = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty) - 1;
    let DATAArray = [...this.state.DATA];
    if (AddedQty <= 0) {
      AddedQty = 0;
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = true;
      this.removeItemFromCart(srid);
    }
    else {
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({ DATA: DATAArray });
  }
  //  Cart qty change
  CartQuantityChange = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty);
    let DATAArray = [...this.state.DATA];
    if (AddedQty <= 0) {
      AddedQty = 1;
      DATAArray[index].AddedQty = '';
      this.addItemToCart(srid, AddedQty);
    }
    else {
      if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
        AddedQty = Number(DATAArray[index]['available_quantity']);
        DATAArray[index].AddedQty = AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }
      else {
        DATAArray[index].AddedQty = AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }

    }
    this.setState({ DATA: DATAArray });
  };

  // toast handler funtion
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  // readmore funciton
  renderTruncatedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#1B98F5' }} onPress={handlePress}>
        Read more
      </Text>
    );
  }
  // hide function
  renderRevealedFooter = (handlePress) => {
    return (
      <Text style={{ color: '#E21717' }} onPress={handlePress}>
        Show less
      </Text>
    );
  }
  // change array of avilable size
  ChangeArray = (size) => {
    const SizeLabel = [];
    var DatA = size
    if (DatA) {
      DatA.map((item) => {
        SizeLabel.push({ label: item.size, value: item.srid });
      }
      )
    }
    this.setState({ AvailableSize: SizeLabel })
  }
  // avilable size to call fatch data
  changeitemsize = (item) => {
    this.fetchData(item.value)
    this.setState({ isVisibleA: false })
  }
  
  // share image product datails
  onShare = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    const shareOptions = {
      title: 'Share file',
      message: `${this.state.DATA[0].product_name},${this.state.DATA[0].size_display},  Our Price ₹${this.state.DATA[0].rate}/ MRP ₹${this.state.DATA[0].mrp} #Download Buy4earn App!! https://www.buy4earn.com/Product/${this.state.DATA[0].srid}/${mtsLogin} `,
      //  url: `data:image/jpeg;base64,${this.state.sendimage}`,
    };
    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error =>', error);
    }
  };
  pagego = () => {
    if (this.state.page == '' || this.state.page == null) {
      this.props.navigation.navigate('main');
    }
    else {

      this.props.navigation.goBack();
    }
  }
  render() {
    return (

      <Container>
        <Header style={{ width: wp('100%'), backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', width: wp('100%') }}>
            <View style={{ color: 'white', marginLeft: wp('1%'), width: wp('10%') }}>
              <TouchableOpacity
                onPress={() => this.pagego()}
              >
                <ResponsiveImage source={require('../assest/Image/backarrow.png')} initWidth="40" initHeight="40" />
              </TouchableOpacity>

            </View>
           
          </View>
        </Header>

        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45ce30" />
        <Content>
          {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('80%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (
            <View>
              <View style={{ flexDirection: 'column' }}>
                {this.state.mts=='' || this.state.mts==null?
                null
                :(
                <View style={{  width: wp('95%'), flexDirection: 'row-reverse', marginLeft: wp('3%') }}>
                  <TouchableOpacity onPress={this.onShare}>
                    <View style={{ width: wp('20%'), alignItems: 'flex-end' }}>
                      <ResponsiveImage source={require('../assest/Image/ShareIcon.jpeg')} initWidth="30" initHeight="30" />
                    </View>
                  </TouchableOpacity>
                </View>
                 )} 
                <View style={{ height: hp('45%'), justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#CAD5E2' }}>

                  <SliderBox
                    images={this.state.images}
                    sliderBoxHeight={320}
                    parentWidth={360}
                    marginTop={5}
                    onCurrentImagePressed={index => this.toggleModal(true)
                    }
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE">
                  </SliderBox>
                </View>
                <View style={{ marginLeft: wp('3%') }}>
                  <Text style={{ fontSize: RFPercentage(1.5) }}>
                    Note:- Product Image is for display purpose only
                       </Text>
                </View>
                <View style={{ marginLeft: wp('2.5%'), width: wp('95%'), marginRight: wp('2.5%') }}>
                  <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold' }}>
                    {this.state.DATA[0].product_name}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', marginTop: hp('1%'), marginLeft: wp('2%'), marginRight: wp('2%') }}>
                  <View style={{ flexDirection: 'row', width: wp('65%'), height: hp('5%') }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: RFPercentage(3), textAlign: 'center', borderRadius: 10, padding: wp('0.5%'), color: "#45CE30" }}>
                        ₹{this.state.DATA[0].rate}
                      </Text>

                    </View>
                    {this.state.DATA[0].mrp == this.state.DATA[0].rate
                      ? null :
                      <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: wp('1%') }}>
                        <Text style={{ fontSize: RFPercentage(2), textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                          ₹{this.state.DATA[0].mrp}
                        </Text>
                      </View>
                    }

                  </View>
                  {this.state.DATA[0].discount == '' || this.state.DATA[0].discount == null || this.state.DATA[0].discount == 0
                    ?
                    null
                    :
                    <View style={{ width: wp('30%'), justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ textAlign: 'center', backgroundColor: "#45CE30", borderRadius: 5, padding: wp('1%'), color: "#fff", fontSize: RFPercentage(2) }}>
                        ₹{this.state.DATA[0].discount} OFF
          </Text>
                    </View>

                  }

                </View>

                <View style={{ marginLeft: wp('2%') }}>
                  <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold' }}>
                    Avilable Size
                </Text>
                </View>
                <View style={{ flexDirection: 'row', width: wp('95%'), marginLeft: wp('2%'), marginRight: wp('2%'), marginTop: hp('0.5%'), justifyContent: 'space-between' }}>
                  <View style={{ width: wp('50%') }}>

                    <DropDownPicker
                      items={this.state.AvailableSize}
                      placeholder={this.state.DATA[0].size_display}
                      containerStyle={{ height:'auto' }}
                      onChangeItem={item => this.changeitemsize(item)}
                      isVisible={this.state.isVisibleA}
                      onClose={() =>
                        this.setState({ isVisibleA: false })
                      }
                    />
                  </View>
                  {this.state.DATA[0].available_quantity <= 0 ?
                    <View style={{ alignItems: 'flex-end', marginRight: wp('3%') }}>
                      <View style={{ width: wp('30%'), height: hp('5%'), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</Text>
                      </View>
                    </View>
                    : (
                      <View style={{ alignItems: 'flex-end', marginRight: wp('3%') }}>

                        {this.state.DATA[0].AddButton == true ?

                          <TouchableWithoutFeedback onPress={() => this.addbutton(0, this.state.DATA[0].srid, this.state.DATA[0].AddedQty)} >


                            <View style={{ width: wp('30%'), height: hp('5%'), alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF362E', borderRadius: 7 }}>
                              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: RFPercentage(2) }}>ADD+</Text>
                            </View>
                          </TouchableWithoutFeedback>
                          : (
                            <View style={{ width: wp('30%'), height: hp('5%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                              {/* Minus Button */}
                              <TouchableWithoutFeedback onPress={() => this.MinusButton(0, this.state.DATA[0].srid, this.state.DATA[0].AddedQty)} >
                                <View style={{ backgroundColor: 'red', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopLeftRadius:7,borderBottomLeftRadius:7}}>
                                  <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>-</Text>
                                </View>
                              </TouchableWithoutFeedback>
                              {/* Text Input Field */}
                              <View style={{ width: wp('10%'), borderWidth: 1, borderColor: 'red', height: hp('4.85%'), justifyContent: 'center', alignItems: 'center' }}>
                                <TextInput
                                  style={{ textAlign: 'center', height: hp('5.5%') }}
                                  value={this.state.DATA[0].AddedQty}
                                  onChangeText={(value) => { this.CartQuantityChange(0, this.state.DATA[0].srid, value.replace(/[^0-9]/g, '')) }}
                                  keyboardType='numeric'
                                  placeholder="1"
                                />
                              </View>
                              {Number(this.state.DATA[0].AddedQty) >= Number(this.state.DATA[0].available_quantity) ?
                                <TouchableWithoutFeedback >
                                  <View style={{ backgroundColor: 'grey', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7 }}>

                                    <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>+</Text>
                                  </View>
                                </TouchableWithoutFeedback>
                                :

                                <TouchableWithoutFeedback onPress={() => this.addbutton(0, this.state.DATA[0].srid, this.state.DATA[0].AddedQty)}>
                                  <View style={{ backgroundColor: 'red', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7 }}>

                                    <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>+</Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              }
                            </View>
                          )
                        }
                      </View>
                    )}

                </View>
                {this.state.DATA[0].Description ?
                  <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('1%') }}>
                      <Text style={{ fontSize: RFPercentage(2.8), fontWeight: 'bold', color: '#45CE30' }}>
                        Product Description
                                </Text>
                    </View>
                    <View
                      style={{
                        width: '100%',
                        height: hp('0.15%'),
                        backgroundColor: 'gray',
                        marginTop: hp('2%'),

                      }}
                    />
                    <View style={styles.card1}>
                      <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={this.renderTruncatedFooter}
                        renderRevealedFooter={this.renderRevealedFooter}
                      >
                        <Text style={{ margin: wp('1%'), marginLeft: wp('2%'), fontSize: RFPercentage(2.2) }}>
                          {this.state.DATA[0].Description}
                        </Text>
                      </ReadMore>
                    </View>
                  </View>
                  : (
                    <View style={{ width: wp('50%'), height: hp('20%') }}></View>
                  )
                }
                    
               
              </View>
              <View>
                <Modal animationType="slide"
                  transparent={true}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    this.toggleModal(!this.state.modalVisible)
                  }}>
                                       <BlurView
                                                style={styles.absolute}
                                                viewRef={this.state.viewRef}
                                                blurType="light"
                                                blurAmount={10}
                                                reducedTransparencyFallbackColor="white"
                                            />

                  {/* modal view code */}
                  <View style={{
                    position: 'absolute',
                    width: wp('100%'),
                    height: hp('100%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  

                  }}>
                    <View style={styles.modalView}>
                      <View style={{width:wp('90%')}}>
                      <View style={styles.buttonContainer}>
                        
                        <Button
                          title="Close"
                          color="red"
                          onPress={() => { this.toggleModal(false) }}
                        >
                        </Button>
                      </View>
                      </View>
              {/* </ImageZoom> */}
              <View style={{width:wp('100%'),height:hp('60%')}}>
              <Swiper showsButtons={true} 
              >
        {this.state.images1.map((item, id) => {
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

                  </View>

                </Modal>

              </View>
            </View>
          )}
        </Content>
      </Container>

    );
  }
}

const styles = StyleSheet.create({
  card: {

    height: hp('40%'),
    width: 'auto',
    marginTop: hp('1%'),
  

  },
  card1: {
    height: 'auto',
    width: wp('95%'),
    marginTop: hp('1%'),
    borderColor: 'grey',
    borderRadius: 10,
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'),
    paddingBottom: hp('4%')
  },
  //code of All Trending,suggestion and recent card

  modalView: {
    position: 'absolute',
    width: wp('95%'),
    backgroundColor: '#fff',
    height: hp('70%'),
    borderRadius: 10,
    justifyContent:'center',
    alignItems: 'center',
    elevation: 10,

  },
  buttonContainer:{
    width:wp('90%'),
    flexDirection:'row-reverse'
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
},
badgeStyle: {
  
  position: 'absolute',
  marginLeft:wp('4%'),

},
});

