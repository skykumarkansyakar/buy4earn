// code of import file
import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, ActivityIndicator, KeyboardAvoidingView, ToastAndroid, BackHandler, Vibration, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage, } from "react-native-responsive-fontsize";
import CartItem from './CartItem'

//code of data item of cart

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DATA: '',
      isLoading: true,
      percentage: '',
      cart: [],
      selectedId: null,
      CartDatalength: '',
      mts:'',
    }
    
  }
  // page load function run
  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this.fetchdata();

    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchdata();
    });
  }
  // function again call 
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
  }
  // function call when open page
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('Home');
    return true;
  };
  // fetch data of cart data
  fetchdata = async () => {
    this.setState({ isLoading: true })
    var JSonParse = await AsyncStorage.getItem('cartdata');
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    this.setState({mts:mtsLogin});
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('CartData', JSonParse);
    await fetch('https://www.buy4earn.com/React_App/CartData.php', {
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
          DATA: responseJson.CartData.ProductData,
          percentage: responseJson.CartData.SelfPer
        })
        this.checkstock(responseJson.CartData.ProductData)
        this.LoadCartData(responseJson.CartData.ProductData);
      })

      //If response is not in json then in error
      .catch((error) => {
        //Error 
        console.log(error)
        this.toastWithDurationHandler('Please Try Again !');
      })

      .finally(() => {
        this.setState({ isLoading: false, CartDatalength: this.state.DATA.length },)
      });
  }
  checkstock=async(stock)=>{
    this.setState({ cart: JSON.parse(await AsyncStorage.getItem('cartdata')) });
    if (this.state.cart == null) {
      this.setState({ cart: [] });
    }
    let DATAArray = [...stock];
    
    for (var i in DATAArray) {
      var index = '';
      index = DATAArray.findIndex(element => element.available_quantity <= 0);
      if (index != -1) {
        this.removeItemFromCart(DATAArray[index].srid)
        DATAArray.splice(index, 1);
        break;
      }
    }
     this.LoadCartData(DATAArray);
  }


  // cart function start
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
    this.setState({ CartDatalength: this.state.CartDatalength - 1 })
    this.SaveCartData();
  };
  // SaveCart Data function

  SaveCartData = async () => {
    await AsyncStorage.setItem('cartdata', JSON.stringify(this.state.cart));
  };
  // loadcart data function

  LoadCartData = async (dataProducts) => {
    this.setState({ cart: JSON.parse(await AsyncStorage.getItem('cartdata')) });
    if (this.state.cart == null) {
      this.setState({ cart: [] });
    }
    let DATAArray = [...dataProducts];
    for (var i in this.state.cart) {
      var index = '';
      index = DATAArray.findIndex(element => element.srid == this.state.cart[i].srid);
      if (index != -1) {
        DATAArray[index].AddedQty = this.state.cart[i].AddedQty.toString();
        DATAArray[index].AddButton = false;

      }
    }
    this.setState({ DATA: DATAArray });
    this.setState({ selectedId: null });
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
  // delete handler 
  deletehandler = async (index, srid) => {
    Alert.alert(
      'Are you sure you want to delete this item from your cart?',
      '',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Delete', onPress: async () => {
            let DATAArray = [...this.state.DATA];
            let AddedQty = 0;
            DATAArray[index].AddedQty = AddedQty.toString();
            DATAArray[index].AddButton = true;
            this.setState({ DATA: DATAArray });
            this.removeItemFromCart(srid);
          }
        },
      ],
      { cancelable: false }
    );
  }
  //function to make Toast With Duration
  toastWithDurationHandler = (message) => {
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }


  // amount function find
  amount = () => {
    const { DATA } = this.state;
    if (DATA) {
      const data1 = DATA.reduce((sum, item) => sum + (item.AddedQty * item.rate), 0);
      return Math.round(data1);
    }
    return 0;
  }

  // delevery function find 

  delevery = () => {
    const { DATA } = this.state;
    const charge = [];
    const data1 = DATA.reduce((sum, item) => sum + (item.AddedQty * item.rate), 0);
    const strData = JSON.stringify(data1);
    if (strData < 250) {
      const value = '₹15'
      charge.push(value);
    }
    else {
      const value = 'Free'
      charge.push(value);
    }
    return charge
  }
  // slef point function find
  selfpoint = () => {
    const { DATA } = this.state;
    if (DATA) {
      const data1 = DATA.reduce((sum, item) => sum + (item.AddedQty * item.bv) * this.state.percentage / 100, 0);
      var point = Math.floor(data1)
      return point;
    }
    return 0;
  }

  // subtotal anount function call
  subtotal = () => {
    const { DATA } = this.state;
    const charge = [];

    const data1 = DATA.reduce((sum, item) => sum + (item.AddedQty * item.rate), 0);
    const strData = JSON.stringify(data1);

    if (strData < 250) {
      const value = 15
      charge.push(value);
    }
    else {
      const value = 0
      charge.push(value);
    }
    const total = data1 + charge[0]
    return Math.round(total);

  }

  // render item of cart data
  renderItem = ({ item, index }) => (
    <CartItem
      index={index}
      item={item}
      addbutton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.addbutton(index, item.srid, item.AddedQty); }}
      MinusButton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.MinusButton(index, item.srid, item.AddedQty); }}
      CartQuantityChange={(value) => { this.setState({ selectedId: item.srid }); this.CartQuantityChange(index, item.srid, value.replace(/[^0-9]/g, '')); }}
      deletehandler={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.deletehandler(index, item.srid); }}
      selectedId={this.state.selectedId}
    />
  );
  render() {
    return (

      //Return of 
      <Container>
        <KeyboardAvoidingView
          behavior={'position'}
          style={styles.container}
        >
          {/* Header part of this page */}
          <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
            {/* Text code of Header part */}
            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => this.props.navigation.navigate('Home')}
            >
              <View style={{ color: 'white', marginLeft: wp('1%'), }}>

                <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" style={{ borderRadius: 100, }} />

              </View>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3.5), marginLeft: wp('2%') }}>Cart</Text>
            </TouchableOpacity>
          </Header>

          <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
          {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('80%'), justifyContent: 'center', alignItems: 'center' }} /> : (
            <View style={{ height: hp('100%') }}>
              {this.state.CartDatalength == 0 ?
                <View style={{ width: wp('100%'), height: hp('70%'), alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveImage source={require('../assest/Image/ShoppingBag.jpeg')} initWidth="120" initHeight="120" style={{ borderRadius: 100, }} />
                  <View>
                    <Text style={{ fontSize: RFPercentage(2.2), color: "#45CE30" }}>
                      Your Cart Is Empty
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <View style={{ width: wp('30%'), height: hp('4%'), backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', borderRadius: 20, marginTop: hp('3%') }}>
                      <Text style={{ fontSize: RFPercentage(2.5), fontWeight: 'bold', color: '#fff' }}>
                        Shop Now
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                : (


                  <View style={{ height: hp('80%') }}>
                    {/* Price view part */}

                    <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('100%'), height: hp('20%') }}>
                      <View style={{ backgroundColor: '#F9DDA4', width: wp('95%'), height: hp('18%'), justifyContent: 'flex-start', alignItems: 'center', marginTop: hp('1%'), borderRadius: 10, }}>
                        <View style={{ flexDirection: 'row' }}>
                          {/* icon image code */}
                          <View style={{ width: wp('25%'), height: hp('18%'), alignItems: 'center', justifyContent: 'center' }}>
                            <ResponsiveImage source={require('../assest/Image/ShoppingBag.jpeg')} initWidth="120" initHeight="120" style={{ borderRadius: 100, }} />
                          </View>

                          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', Width: wp('70%') }}>
                            {/* this code for Pricing_details text  */}
                            <View style={{ width: wp('70%'), height: hp('2.5%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('1%'), }}>
                              <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(1.8) }}>
                                Pricing Details
                              </Text>
                            </View>
                            {/* this code for total text  */}
                            <View style={{ marginLeft: wp('2%'), height: hp('17%'), width: wp('68%'), }}>

                              {/* Code of Total items code */}
                              <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                                <View style={{ width: wp('33.5%'), }}>
                                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    Total Items
                                  </Text>
                                </View>
                                <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    {this.state.CartDatalength}
                                  </Text>
                                </View>

                              </View>
                              {/*code of Amount code  */}

                              <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                                <View style={{ width: wp('33.5%'), }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    Amount
                                  </Text>
                                </View>
                                <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    ₹{this.amount()}
                                  </Text>
                                </View>

                              </View>

                              {/* code of Delivery Charge */}
                              <View style={{ width: wp('68%'), flexDirection: 'row' }}>
                                <View style={{ width: wp('33.5%'), }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    Delivery Charge
                                  </Text>
                                </View>
                                <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    {this.delevery()}

                                  </Text>
                                </View>

                              </View>
                              {/* this code for self point */}
                              <View style={{ width: wp('68%'), flexDirection: 'row' }}>
                                <View style={{ width: wp('33.5%'), }}>
                                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    Self Points
                                 </Text>
                                </View>
                                <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                                  <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    {this.selfpoint()}
                                  </Text>
                                </View>

                              </View>
                              {/* this code for line */}
                              <View
                                style={{
                                  borderBottomColor: 'black',
                                  borderBottomWidth: 1,
                                }}
                              />
                              {/* this code for sub total */}
                              <View style={{ width: wp('68%'), flexDirection: 'row', }}>
                                <View style={{ width: wp('33.5%'), }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    SUB TOTAL
                              </Text>
                                </View>
                                <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                    ₹ {this.subtotal()}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>



                    <FlatList
                      data={this.state.DATA}
                      renderItem={this.renderItem}
                      keyExtractor={item => item.srid}
                      scrollEnabled
                      extraData={this.state.selectedId}
                    />


                    {/* process Code */}

                    {this.state.mts=='' || this.state.mts==null ?
                    <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login')}
              >
    
    <View style={{ justifyContent: 'center', alignItems: 'center', }}>


  <View style={{ width: wp('90%'), backgroundColor: 'red', borderRadius: 10, height: hp('8%'), marginBottom: hp('1%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3) }}>Proceed to checkout</Text>

  </View>

</View>

  </TouchableOpacity>
          : (

                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>

                      <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('ConfirmOrder')}>
                        <View style={{ width: wp('90%'), backgroundColor: 'red', borderRadius: 10, height: hp('8%'), marginBottom: hp('1%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3) }}>Proceed to checkout</Text>

                        </View>
                      </TouchableOpacity>
                    </View>
          )}
                  </View>

                )}
            </View>)
          }
        </KeyboardAvoidingView>
      </Container>

    );
  }
}

//styles
const styles = StyleSheet.create({
  // Add product cart style
  card: {
    backgroundColor: '#fefefe',
    height: hp('15%'),
    width: wp('95%'),
    borderRadius: 10,
    elevation: 5,
    margin: wp('1.5%'),
  },
  card1: {
    height: hp('17%'),
    width: wp('95%'),
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%')

  },
  ImageStyle: {
    height: hp('14%'),
    width: wp('25%')
  },
  container: {
    flex: 1
  },

});