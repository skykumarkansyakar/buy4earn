// import Code
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  ActivityIndicator,
  Modal,
  Button,
  KeyboardAvoidingView,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Container, Header, Footer} from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BlurView} from '@react-native-community/blur';
import Orderanimation from '../Process/Orderanimation';
import VersionNumber from 'react-native-version-number';
export default class ConfirmOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qty: '',
      Data: '',
      deleverycharge: '',
      percentage: '',
      isLoading: true,
      redeempoint: '',
      Address: '',
      Voucher: '',
      AddressName: '',
      AlternateNumber: '',
      modalVisible: true,
      coupanprice: 0,
      result: '',
      animation: false,
    };
  }
  // 20498

  // toast message code function

  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  };
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount = async () => {
    this.fetchdata();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchdata();
    });
  };
  // function again call
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
  }

  // function again call
  fetchdata = async () => {
    this.setState({isLoading: true});
    var JSonParse = await AsyncStorage.getItem('cartdata');
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('CartData', JSonParse);
    fetch('https://www.buy4earn.com/React_App/CartData.php', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        this.setState({
          Data: responseJson.CartData.ProductData,
          percentage: responseJson.CartData.SelfPer,
          points: responseJson.CartData.total_points,
          Address: responseJson.CartData.Address.Address,
          AddressName: responseJson.CartData.Address.AddressName,
          AlternateNumber: responseJson.CartData.Address.AlternateNumber,
          Voucher: responseJson.CartData.Voucher,
        });
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(async () => {
        this.setState({isLoading: false});
        var JSonParse = await AsyncStorage.getItem('voucher');
        var vocher = JSON.parse(JSonParse);

        if (vocher !== null) {
          const voucheramount = vocher.reduce(
            (sum, item) => sum + item.amount * 1,
            0,
          );
          this.setState({
            coupanprice: voucheramount,
          });
        } else {
          AsyncStorage.removeItem('voucher');
        }

        var AlternateNumber1 = await AsyncStorage.getItem('AlternateNumber');
        var AddressName1 = await AsyncStorage.getItem('AddressName');
        var Address1 = await AsyncStorage.getItem('Address');
        if (
          AddressName1 == null ||
          AddressName1 == '' ||
          AddressName1 == 'null' ||
          Address1 == null ||
          Address1 == '' ||
          Address1 == 'null' ||
          AlternateNumber1 == null ||
          AlternateNumber1 == '' ||
          AlternateNumber1 == 'null'
        ) {
          null;
        } else {
          this.toggleModal(false);
          this.setState({
            AlternateNumber: AlternateNumber1,
            AddressName: AddressName1,
            Address: Address1,
          });
        }

        AsyncStorage.removeItem('redeempoint');
      });
  };
  // Amount function code
  subtotalPrice = () => {
    const {Data} = this.state;
    if (Data) {
      const data1 = Data.reduce(
        (sum, item) => sum + item.AddedQty * item.rate,
        0,
      );
      return data1;
    }
    return 0;
  };

  // Self Point Function code
  selfpoint = () => {
    const {Data} = this.state;
    if (Data) {
      const data1 = Data.reduce(
        (sum, item) =>
          sum + (item.AddedQty * item.bv * this.state.percentage) / 100,
        0,
      );
      var point = Math.floor(data1);
      return point;
    }
    return 0;
  };

  // Delivery Charge function code
  delevery = () => {
    const {Data} = this.state;
    const charge = [];
    const delevery = [];
    if (Data) {
      const data1 = Data.reduce(
        (sum, item) => sum + item.AddedQty * item.rate,
        0,
      );

      charge.push(data1);
    }

    if (charge[0] < 250) {
      const value = '₹15';
      delevery.push(value);
    } else {
      const value = 'Free';
      delevery.push(value);
    }
    return delevery;
  };

  // Total Amount to Pay function code
  TotalpayAmount = () => {
    const {Data} = this.state;
    const charge = [];
    const delevery = [];
    if (Data) {
      const data1 = Data.reduce(
        (sum, item) => sum + item.AddedQty * item.rate,
        0,
      );
      charge.push(data1);
    }

    if (charge[0] < 250) {
      const value = 15;
      delevery.push(value);
    } else {
      const value = 0;
      delevery.push(value);
    }
    const total = charge[0] + delevery[0];
    const final = total - this.state.redeempoint;
    const pay = final - this.state.coupanprice;
    AsyncStorage.setItem('payamount', JSON.stringify(pay));
    return pay;
  };

  // Redeem Point Function Code
  redeempoint = (point) => {
    const {Data} = this.state;
    const charge = [];
    const delevery = [];
    if (Data) {
      const data1 = Data.reduce(
        (sum, item) => sum + item.AddedQty * item.rate,
        0,
      );

      charge.push(data1);
    }

    if (charge[0] < 250) {
      const value = 15;
      delevery.push(value);
    } else {
      const value = 0;
      delevery.push(value);
    }
    const total = charge[0] + delevery[0];
    const pay = total - this.state.coupanprice;

    if (point <= pay) {
      if (point <= this.state.points - 1) {
        this.setState({redeempoint: point.replace(/[^0-9]/g, '')});
        AsyncStorage.setItem(
          'redeempoint',
          JSON.stringify(point.replace(/[^0-9]/g, '')),
        );
      } else {
        this.toastWithDurationHandler(
          'You have only ' + this.state.points + ' points !',
        );
      }
    } else {
      this.toastWithDurationHandler(
        'You do not reddem more then total Amount! ',
      );
    }
  };
  // Delete Data of Voucher
  deletedata = () => {
    this.setState({coupanprice: 0});
    AsyncStorage.removeItem('voucher');
  };

  saveaddress = () => {
    const {AddressName, Address} = this.state;
    if (
      AddressName == '' ||
      Address == '' ||
      AddressName == null ||
      Address == null ||
      AddressName == 'null' ||
      Address == 'null'
    ) {
      this.toastWithDurationHandler('Name & Address Should not be Empty !');
    } else {
      this.toggleModal(false);
    }
  };

  // Save Cart Function
  SaveCartData = async (CartData) => {
    AsyncStorage.setItem('cartdata', JSON.stringify(CartData));
  };
  // addresssave
  AddressName1 = (data) => {
    this.setState({AddressName: data});
    AsyncStorage.setItem('AddressName', data);
  };
  AlternateNumber1 = (data) => {
    this.setState({AlternateNumber: data});
    AsyncStorage.setItem('AlternateNumber', data);
  };
  Address1 = (data) => {
    this.setState({Address: data});
    AsyncStorage.setItem('Address', data);
  };
  // Place Order Button function code
  placeorder = async () => {
    const {AddressName, Address} = this.state;
    if (
      AddressName == '' ||
      Address == '' ||
      AddressName == null ||
      Address == null ||
      AddressName == 'null' ||
      Address == 'null'
    ) {
      this.toggleModal(true);
    } else {
      var JSonParse = await AsyncStorage.getItem('voucher');
      var Vouchers = JSON.parse(JSonParse);
      if (this.state.Voucher != '' || this.state.Voucher.length != 0) {
        if (Vouchers == null || Vouchers == '' || Vouchers == 0) {
          this.props.navigation.navigate('Voucher');
        } else {
          this.setState({isLoading: true, animation: true});
          var CartData = await AsyncStorage.getItem('cartdata');
          var mtsLogin = await AsyncStorage.getItem('mts');
          var Vouchers = await AsyncStorage.getItem('voucher');
          var dataToSend = new FormData();
          dataToSend.append('mts', mtsLogin);
          dataToSend.append('Anumber', this.state.AlternateNumber);
          dataToSend.append('OrderName', this.state.AddressName);
          dataToSend.append('Address', this.state.Address);
          dataToSend.append('RedeemPoints', this.state.redeempoint);
          dataToSend.append('CartData', CartData);
          dataToSend.append('Vouchers', Vouchers);
          dataToSend.append('AppVersion', VersionNumber.appVersion);
          dataToSend.append('OS', 'android');
          fetch('https://www.buy4earn.com/React_App/PlaceOrder.php', {
            method: 'POST',
            body: dataToSend,
            headers: {
              'Content-Type': 'multipart/form-data; ',
            },
            //Request Type
          })
            .then((response) => response.json())
            //If response is in json then in success
            .then((responseJson) => {
              this.setState({
                coupanprice: 0,
                redeempoint: '',
                isLoading: false,
              });
              AsyncStorage.removeItem('voucher');
              AsyncStorage.removeItem('cartdata');
              AsyncStorage.removeItem('redeempoint');
              AsyncStorage.removeItem('AlternateNumber');
              AsyncStorage.removeItem('AddressName');
              AsyncStorage.removeItem('Address');
              AsyncStorage.setItem('TrackOrder', responseJson.orderID);
              this.setState({animation: false});
              this.props.navigation.navigate('TrackOrder', {
                orderID: responseJson.orderID,
                pagename: 'Home',
              });
            })
            //If response is not in json then in error
            .catch((error) => {
              //Error
              this.toastWithDurationHandler('Please Try Again !');
            });
        }
      } else {
        this.setState({isLoading: true, animation: true});
        var CartData = await AsyncStorage.getItem('cartdata');
        var mtsLogin = await AsyncStorage.getItem('mts');
        var Vouchers = await AsyncStorage.getItem('voucher');
        var dataToSend = new FormData();
        dataToSend.append('mts', mtsLogin);
        dataToSend.append('Anumber', this.state.AlternateNumber);
        dataToSend.append('OrderName', this.state.AddressName);
        dataToSend.append('Address', this.state.Address);
        dataToSend.append('RedeemPoints', this.state.redeempoint);
        dataToSend.append('CartData', CartData);
        dataToSend.append('Vouchers', Vouchers);
        dataToSend.append('AppVersion', VersionNumber.appVersion);
        dataToSend.append('OS', 'android');
        fetch('https://www.buy4earn.com/React_App/PlaceOrder.php', {
          method: 'POST',
          body: dataToSend,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
          //Request Type
        })
          .then((response) => response.json())
          //If response is in json then in success
          .then((responseJson) => {
            this.setState({coupanprice: 0, redeempoint: '', isLoading: false});
            AsyncStorage.removeItem('voucher');
            AsyncStorage.removeItem('cartdata');
            AsyncStorage.setItem('TrackOrder', responseJson.orderID);
            this.setState({animation: false});
            this.props.navigation.navigate('TrackOrder', {
              orderID: responseJson.orderID,
              pagename: 'Home',
            });
          })
          //If response is not in json then in error
          .catch((error) => {
            //Error
            this.toastWithDurationHandler('Please Try Again !');
          });
      }
    }
  };
  // Back Action Hardware Function
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.goBack();
    return true;
  };
  // back button function
  backbutton = () => {
    this.setState({coupanprice: 0, redeempoint: ''});
    AsyncStorage.removeItem('voucher');
    this.props.navigation.navigate('Home');
  };
  // Remian Points
  remainpoint = () => {
    if (this.state.redeempoint) {
      var remainpoint = this.state.points - this.state.redeempoint;
      return remainpoint;
    }
  };
  applyvoucher = () => {
    const {AddressName, Address} = this.state;
    if (
      AddressName == '' ||
      Address == '' ||
      AddressName == null ||
      Address == null ||
      AddressName == 'null' ||
      Address == 'null'
    ) {
      this.toggleModal(true);
    } else {
      this.props.navigation.navigate('Voucher');
    }
  };

  render() {
    return (
      <Container>
        <KeyboardAvoidingView behavior={'position'} style={styles.container}>
          {this.state.animation ? (
            <Orderanimation />
          ) : (
            <View>
              {/* Header Code */}
              <Header
                style={{
                  height: hp('8%'),
                  width: wp('100%'),
                  backgroundColor: '#45CE30',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => this.backbutton()}>
                  <View style={{color: 'white', marginLeft: wp('1%')}}>
                    <ResponsiveImage
                      source={require('../assest/Image/LeftArrow.jpeg')}
                      initWidth="40"
                      initHeight="40"
                    />
                  </View>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: RFPercentage(3),
                      marginLeft: wp('2%'),
                    }}>
                    Confirm Order
                  </Text>
                </TouchableOpacity>
              </Header>
              <StatusBar
                barStyle="dark-content"
                hidden={false}
                backgroundColor="#45CE30"
              />
              {/* Adress Code  */}
              {this.state.isLoading ? (
                <ActivityIndicator
                  color="green"
                  size={wp('10%')}
                  style={{
                    width: wp('100%'),
                    height: hp('80%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ) : (
                <View>
                  {/* Address Card Code */}
                  <View style={styles.card}>
                    <View style={{flexDirection: 'column'}}>
                      <View
                        style={{
                          width: wp('24%'),
                          marginLeft: hp('1%'),
                          borderBottomWidth: 1,
                          borderColor: '#CAD5E2',
                        }}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            fontWeight: 'bold',
                          }}>
                          Deliver To:
                        </Text>
                      </View>
                      {/* Add new Address Code */}
                      {this.state.AddressName == '' ||
                      this.state.Address == '' ||
                      this.state.AddressName == 'null' ||
                      this.state.Address == 'null' ||
                      this.state.AddressName == null ||
                      this.state.Address == null ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.toggleModal(true);
                          }}>
                          <View
                            style={{
                              width: wp('83%'),
                              marginLeft: hp('3%'),
                              height: hp('5%'),
                              borderRadius: 10,
                              marginTop: hp('1%'),
                              backgroundColor: 'red',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: RFPercentage(2.5),
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              Add New Address
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        //    Old Adress Code
                        <View style={{flexDirection: 'row'}}>
                          <View
                            style={{width: wp('67%'), marginLeft: hp('3%')}}>
                            <Text>
                              {this.state.AddressName},
                              {this.state.AlternateNumber},{this.state.Address},
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => {
                              this.toggleModal(true);
                            }}>
                            <View
                              style={{width: wp('30%'), marginLeft: wp('3%')}}>
                              <Text
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: RFPercentage(2.5),
                                  color: 'red',
                                }}>
                                Change
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                  {/* End Code */}

                  {/* Price Details Code */}
                  <View style={styles.card1}>
                    <View
                      style={{
                        marginLeft: wp('3%'),
                        marginTop: hp('3%'),
                        marginRight: hp('3%'),
                        borderBottomWidth: 1,
                        borderColor: '#CAD5E2',
                      }}>
                      <Text
                        style={{fontSize: RFPercentage(2), fontWeight: 'bold'}}>
                        PRICE DETAILS
                      </Text>
                    </View>
                    {/* Amount Code */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('95%'),
                        marginLeft: wp('2.5%'),
                        marginRight: wp('2.5%'),
                        marginTop: hp('3%'),
                      }}>
                      <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            color: '#758283',
                          }}>
                          Amount:
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: wp('3%'),
                          width: wp('40%'),
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: RFPercentage(2.5)}}>
                          ₹{this.subtotalPrice().toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    {/* Delivery Code */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('95%'),
                        marginLeft: wp('2.5%'),
                        marginRight: wp('2.5%'),
                        marginTop: hp('3%'),
                      }}>
                      <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            color: '#758283',
                          }}>
                          Delivery Charge
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: wp('3%'),
                          width: wp('40%'),
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: RFPercentage(2.5)}}>
                          {this.delevery()}
                        </Text>
                      </View>
                    </View>
                    {/* Self Point Code */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('95%'),
                        marginLeft: wp('2.5%'),
                        marginRight: wp('2.5%'),
                        marginTop: hp('3%'),
                      }}>
                      <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            color: '#758283',
                          }}>
                          Self Points
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: wp('3%'),
                          width: wp('40%'),
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: RFPercentage(2.5)}}>
                          {this.selfpoint().toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    {/* total points */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('95%'),
                        marginLeft: wp('2.5%'),
                        marginRight: wp('2.5%'),
                        marginTop: hp('3%'),
                      }}>
                      <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            color: '#758283',
                          }}>
                          Total Points
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: wp('3%'),
                          width: wp('40%'),
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontSize: RFPercentage(2.5)}}>
                          {this.state.points}
                        </Text>

                        {this.state.redeempoint == null ||
                        this.state.redeempoint == '' ||
                        this.state.redeempoint <= 0 ? null : (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={{color: '#45ce30'}}>
                              ({this.state.points}-
                            </Text>
                            <Text style={{color: 'red'}}>
                              {this.state.redeempoint}
                            </Text>
                            <Text style={{color: '#45ce30'}}>
                              ={this.remainpoint()})
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* end total points */}
                    {/* Redeem Point Code */}
                    {this.state.points >= 100 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp('95%'),
                          marginLeft: wp('2.5%'),
                          marginRight: wp('2.5%'),
                          marginTop: hp('3%'),
                        }}>
                        <View
                          style={{
                            marginLeft: wp('3%'),
                            width: wp('40%'),
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: RFPercentage(2.5),
                              color: '#758283',
                            }}>
                            Redeem Points
                          </Text>
                        </View>
                        <View
                          style={{
                            marginLeft: wp('3%'),
                            width: wp('40%'),
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <TextInput
                            placeholder="Enter Your Points"
                            value={this.state.redeempoint}
                            onChangeText={(data) =>
                              this.redeempoint(data.replace(/[^0-9]/g, ''))
                            }
                            keyboardType="numeric"
                            maxLength={4}
                            autoCompleteType="off"
                            style={{
                              alignItems: 'center',
                              fontSize: RFPercentage(2),
                              borderBottomWidth: 1,
                              textAlign: 'right',
                            }}
                          />
                        </View>
                      </View>
                    ) : null}
                    {/* Voucher Code */}
                    {this.state.Voucher != '' ||
                    this.state.Voucher.length != 0 ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          width: wp('95%'),
                          marginLeft: wp('2.5%'),
                          marginRight: wp('2.5%'),
                          marginTop: hp('3%'),
                        }}>
                        <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                          <Text
                            style={{
                              fontSize: RFPercentage(2.5),
                              color: '#758283',
                            }}>
                            Voucher Discount
                          </Text>
                        </View>

                        {this.state.coupanprice != 0 ? (
                          <TouchableOpacity onPress={() => this.deletedata()}>
                            <View
                              style={{
                                marginLeft: wp('3%'),
                                width: wp('40%'),
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  fontSize: RFPercentage(2.5),
                                  color: 'red',
                                }}>
                                ₹ {this.state.coupanprice}
                              </Text>

                              <ResponsiveImage
                                source={require('../assest/Image/Close.jpeg')}
                                initWidth="20"
                                initHeight="20"
                                style={{
                                  marginLeft: wp('2%'),
                                  marginBottom: hp('0.2%'),
                                }}
                              />
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.applyvoucher()}>
                            <View
                              style={{
                                marginLeft: wp('3%'),
                                width: wp('40%'),
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{
                                  fontSize: RFPercentage(2.5),
                                  color: 'red',
                                }}>
                                Apply Voucher
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : null}
                    {/* Total Amount Pay */}
                    <View
                      style={{
                        flexDirection: 'row',
                        width: wp('95%'),
                        marginLeft: wp('2.5%'),
                        marginRight: wp('2.5%'),
                        marginTop: hp('3%'),
                        borderTopWidth: 1,
                        borderColor: '#758283',
                      }}>
                      <View style={{marginLeft: wp('3%'), width: wp('40%')}}>
                        <Text style={{fontSize: RFPercentage(2.5)}}>
                          Total Amount
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: wp('3%'),
                          width: wp('40%'),
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        }}>
                        <Text
                          style={{
                            fontSize: RFPercentage(2.5),
                            color: '#45CE30',
                          }}>
                          ₹{this.TotalpayAmount().toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{height: hp('9%')}}>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={this.state.modalVisible}
                      onRequestClose={() => {
                        this.toggleModal(!this.state.modalVisible);
                      }}>
                      <BlurView
                        style={styles.absolute}
                        viewRef={this.state.viewRef}
                        blurType="light"
                        blurAmount={10}
                        reducedTransparencyFallbackColor="white"
                      />

                      {/* modal view code */}
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 2,
                          width: wp('100%'),
                          height: hp('40%'),
                          borderRadius: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <View style={styles.modalView}>
                          <View
                            style={{
                              height: hp('6%'),
                              marginTop: hp('5%'),
                              borderBottomWidth: 1,
                              width: wp('80%'),
                              borderColor: '#758283',
                              alignItems: 'center',
                            }}>
                            <TextInput
                              placeholder="Enter Your Name*"
                              value={this.state.AddressName}
                              onChangeText={(data) => this.AddressName1(data)}
                              style={{fontSize: RFPercentage(2.6)}}
                              keyboardType="default"
                              maxLength={50}
                              autoCompleteType="off"
                              placeholderTextColor="#ff0000"
                            />
                          </View>

                          <View
                            style={{
                              height: hp('6%'),
                              marginTop: hp('5%'),
                              borderBottomWidth: 1,
                              width: wp('80%'),
                              borderColor: '#758283',
                              alignItems: 'center',
                            }}>
                            <TextInput
                              placeholder=" Alternate Mobile Number (optional)"
                              value={this.state.AlternateNumber}
                              onChangeText={(data) =>
                                this.AlternateNumber1(data)
                              }
                              style={{fontSize: RFPercentage(2.4)}}
                              keyboardType="phone-pad"
                              maxLength={11}
                              autoCompleteType="off"
                              placeholderTextColor="#758283"
                            />
                          </View>
                          <View
                            style={{
                              height: hp('6%'),
                              marginTop: hp('5%'),
                              borderBottomWidth: 1,
                              width: wp('80%'),
                              borderColor: '#758283',
                              alignItems: 'center',
                            }}>
                            <TextInput
                              placeholder="Enter Address*"
                              value={this.state.Address}
                              onChangeText={(data) => this.Address1(data)}
                              style={{fontSize: RFPercentage(2.4)}}
                              keyboardType="default"
                              maxLength={50}
                              autoCompleteType="off"
                              placeholderTextColor="#ff0000"
                            />
                          </View>
                          <View style={styles.buttonContainer}>
                            <Button
                              title="Save"
                              color="#45CE30"
                              onPress={() => {
                                this.saveaddress();
                              }}></Button>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                  <Footer
                    style={{
                      backgroundColor: 'transparent',
                      width: wp('100%'),
                      height: hp('9%'),
                      backgroundColor: '#fff',
                    }}>
                    <View
                      style={{
                        width: wp('40%'),
                        height: hp('8%'),
                        marginBottom: hp('1%'),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}>
                      <Text>Payable Amount</Text>
                      <Text style={{fontWeight: 'bold', color: 'red'}}>
                        ₹{this.TotalpayAmount().toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => this.placeorder()}>
                      <View
                        style={{
                          width: wp('50%'),
                          backgroundColor: 'red',
                          borderRadius: 5,
                          height: hp('5%'),
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: hp('2.5%'),
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: RFPercentage(3),
                          }}>
                          Place Order
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Footer>
                </View>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  // Main Image Code
  card: {
    height: hp('14%'),
    width: 'auto',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: hp('1%'),
    elevation: 10,
    flexDirection: 'row',
  },

  card1: {
    height: hp('55%'),
    width: 'auto',
    backgroundColor: '#FFF',
    flexDirection: 'column',
    marginTop: hp('1%'),
    elevation: 2,
  },
  modalView: {
    flex: 1,
    position: 'absolute',
    bottom: 2,
    width: wp('95%'),
    backgroundColor: '#e6ffee',
    height: hp('45%'),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 10,
  },
  buttonContainer: {
    width: wp('60%'),
    height: hp('5%'),
    marginTop: hp('4%'),
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
  },
});
