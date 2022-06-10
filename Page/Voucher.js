import React, { Component } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Footer } from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orderanimation from '../Process/Orderanimation'
import VersionNumber from 'react-native-version-number';
export default class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      isLoading: true,
      textInputData: '',
      Voucher: '',
      coupanprice: 0,
      payable: 0,
      total1: 0,
      animation: false,
      AddressName:'',
      AlternateNumber:'',
      Address: '',
    }

  }



  componentDidMount = async () => {
    this.fetchofferdata();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchofferdata();
    });
  }
  // function again call 
  componentWillUnmount() {
    this._unsubscribe();
  }
  fetchofferdata = async () => {
    this.setState({ isLoading: true, coupanprice: 0, })
    var mtsLogin = await AsyncStorage.getItem('mts');
    var JSonParse = await AsyncStorage.getItem('cartdata');
    var dataToSend = new FormData();
    dataToSend.append('CartData', JSonParse);
    dataToSend.append('mts', mtsLogin);
    fetch('https://www.buy4earn.com/React_App/CartData.php', {
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
          Data: responseJson.CartData.ProductData,
          Voucher: responseJson.CartData.Voucher,
          Address: responseJson.CartData.Address.Address,
          AddressName: responseJson.CartData.Address.AddressName,
          AlternateNumber: responseJson.CartData.Address.AlternateNumber,
        })
        this.Loadofferdata(responseJson.CartData.Voucher)
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {
        this.setState({ isLoading: false })

      });
  }
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  // Total Amount to Pay function code

  TotalpayAmount = async () => {
    var JSonParse = await AsyncStorage.getItem('voucher');
    if (JSonParse == null) {
      var newDatatoAdd = [];
    }
    else {
      var newDatatoAdd = JSON.parse(JSonParse);
    }

    var JSonParse = await AsyncStorage.getItem('payamount');
    var total = JSON.parse(JSonParse);
    const voucheramount = newDatatoAdd.reduce((sum, item) => sum + (item.amount * 1), 0);
    const remian = total - voucheramount
    this.setState({ payable: Math.round(remian), total1: Math.round(total) });
  }
  Loadofferdata = async (responseDataToSEt) => {
    this.TotalpayAmount();
    var JSonParse = await AsyncStorage.getItem('voucher');
    var newDatatoAdd = JSON.parse(JSonParse);
    var Voucher = responseDataToSEt;
    if (JSonParse != null) {
      var DATA = Voucher;
      DATA.map((item) => {
        var equalism = null;
        newDatatoAdd.map((StoredCartData) => {
          if (StoredCartData.id === item.id) {
            equalism = 1;
          }
        });
        if (equalism == 1) {
          item.OfferButton = false;
        }
      });
      this.setState({ Voucher: DATA });
    }
    else {
      this.setState({ Voucher: Voucher });
    }
  }
  // claimbutton 
  Claimbutton = async (id, amount, sno) => {

    var JSonParse = await AsyncStorage.getItem('voucher');
    if (JSonParse == null) {
      var newDatatoAdd = [];
    }
    else {
      var newDatatoAdd = JSON.parse(JSonParse);
    }

    var JSonParse = await AsyncStorage.getItem('payamount');
    var total = JSON.parse(JSonParse);
    const voucheramount = newDatatoAdd.reduce((sum, item) => sum + (item.amount * 1), 0);
    const remian = total - voucheramount
    const add = amount - remian
    if
      (amount <= total) {
      if (voucheramount <= total) {
        if (amount <= remian) {
          var ToAdd = {
            id: id,
            amount: amount,
            sno: sno
          };
          newDatatoAdd.push(ToAdd);
          var DATA = this.state.Voucher;
          DATA.map((item) => {
            if (item.id == id) {
              item.OfferButton = false;
            }
          });
          this.setState({ Voucher: DATA });
          this.SaveCartData(newDatatoAdd);

        }
        else {
          this.toastWithDurationHandler('Add more ₹' + add + ' To Apply Voucher !');
        }
      }

      else {
        this.toastWithDurationHandler('Add more ₹' + add + '  To Apply Voucher !');
      }
    }
    else {
      this.toastWithDurationHandler('Add more ₹' + add + ' To Apply Voucher !');
    }
    var JSonParse = await AsyncStorage.getItem('voucher');
    var vocher = JSON.parse(JSonParse);

    if (vocher !== null) {
      const voucheramount = vocher.reduce((sum, item) => sum + (item.amount * 1), 0);
      this.setState({
        coupanprice: voucheramount
      })
    }
    this.TotalpayAmount();
  }

  // unclaim button
  Unclamied = async (id, index) => {
    var DATA = this.state.Voucher;
    DATA.map((item) => {
      if (item.id == id) {
        item.OfferButton = true;
      }
    });
    this.setState({ Voucher: DATA });
    var JSonParse = await AsyncStorage.getItem('voucher');
    var total = JSON.parse(JSonParse);

    for (var i in total) {
      if (total[i].id === id) {
        total.splice(i, 1);
        break;
      }
    }
    this.SaveCartData(total);
    var JSonParse = await AsyncStorage.getItem('voucher');
    var vocher = JSON.parse(JSonParse);

    if (vocher !== null) {
      const voucheramount = vocher.reduce((sum, item) => sum + (item.amount * 1), 0);
      this.setState({
        coupanprice: voucheramount
      })
    }
    this.TotalpayAmount();
  }
  SaveCartData = async (Voucher) => {
    AsyncStorage.setItem('voucher', JSON.stringify(Voucher));
  }
  placeorder = async () => {
    this.setState({ isLoading: true,animation:true })
    var CartData = await AsyncStorage.getItem('cartdata');
    var mtsLogin = await AsyncStorage.getItem('mts');
    var Vouchers = await AsyncStorage.getItem('voucher');
    var JSonParse = await AsyncStorage.getItem('redeempoint');
    var redeem = JSON.parse(JSonParse);
    var AlternateNumber1 = await AsyncStorage.getItem('AlternateNumber');
    var AddressName1 = await AsyncStorage.getItem('AddressName');
    var Address1 = await AsyncStorage.getItem('Address');
    var dataToSend = new FormData();
    if(AlternateNumber1==null||AlternateNumber1==''||AlternateNumber1=='null')
    {
    dataToSend.append('Anumber', this.state.AlternateNumber);
    }
    else{
      dataToSend.append('Anumber', AlternateNumber1);
    }
    if(AddressName1==null||AddressName1==''||AddressName1=='null')
    {
      dataToSend.append('OrderName', this.state.AddressName);
    }
    else{
        dataToSend.append('OrderName', AddressName1);
    }
    if(Address1==null||Address1==''||Address1=='null')
    {
    dataToSend.append('Address', this.state.Address);
    }
    else{
      dataToSend.append('Address', Address1);
    }
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('RedeemPoints', redeem);
    dataToSend.append('CartData', CartData);
    dataToSend.append('Vouchers', Vouchers);
    dataToSend.append('AppVersion', VersionNumber.appVersion);
    dataToSend.append('OS', 'android');
 
    fetch('https://www.buy4earn.com/React_App/PlaceOrder.php', {
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
        this.setState({ coupanprice: 0, redeempoint: '', isLoading: false })
        AsyncStorage.removeItem('voucher');
        AsyncStorage.removeItem('cartdata');
        AsyncStorage.removeItem('AlternateNumber');
        AsyncStorage.removeItem('AddressName');
        AsyncStorage.removeItem('Address');
        AsyncStorage.setItem('TrackOrder', responseJson.orderID);
        this.setState({ animation: false })
        this.props.navigation.navigate('TrackOrder', {
          orderID: responseJson.orderID,
          pagename: 'Home',
        })
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      });

  }


  renderItem = ({ item, index }) => (
    // code of card 

    <View style={styles.container}>
      {item.OfferButton == true ?

        <View style={styles.cardStyle}>
          <Text style={styles.headingStyle}>
            Congrates !!
          </Text>
          <Text style={styles.paragraph}>
            You Have a Voucher!
          </Text>
          <View style={styles.simpleLineStyle} />



          <ResponsiveImage source={require('../assest/Image/gift.jpeg')} initWidth="100" initHeight="100" style={styles.logoStyle} />


          <Text style={styles.textLargeStyle}>
            ₹ {item.OfferAmount}
          </Text>
          <Text style={styles.textLargeStyle}>{item.sno}</Text>

          <TouchableOpacity onPress={() => this.Claimbutton(item.id, item.OfferAmount, item.sno)} >
            <View
              style={{

                backgroundColor: 'red',
                width: wp('95%'),
                height: hp('5%')

              }}>

              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  padding: 5,
                  textAlign: 'center',
                }}
              >
                Claim
            </Text>

            </View>
          </TouchableOpacity>
        </View>
        : (
          <View style={styles.cardStyle2}>
            <Text style={styles.headingStyle1}>
              Congrates !!
            </Text>
            <Text style={styles.paragraph}>
              You Have a Voucher!
            </Text>
            <View style={styles.simpleLineStyle} />



            <ResponsiveImage source={require('../assest/Image/gift2.jpeg')} initWidth="100" initHeight="100" style={styles.logoStyle} />


            <Text style={styles.textLargeStyle1}>
              ₹ {item.OfferAmount}
            </Text>
            <Text style={styles.textLargeStyle1}>{item.sno}</Text>
            <TouchableOpacity onPress={() => this.Unclamied(item.id, index)} >
              <View
                style={{
                  backgroundColor: '#808080',
                  width: wp('95%'),
                  height: hp('5%')
                }}>

                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    padding: 5,
                    textAlign: 'center',
                  }}
                >
                  Claimed
              </Text>

              </View>
            </TouchableOpacity>
          </View>
        )
      }

    </View>

  );
  render() {


    return (
      <Container>
        {this.state.animation ? <Orderanimation /> : (
          <View>
            <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>

              <TouchableOpacity style={{ flexDirection: 'row' }}
                onPress={() => this.props.navigation.navigate('ConfirmOrder')}
              >
                <View style={{ color: 'white', marginLeft: wp('1%'), }}>

                  <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />

                </View>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3), marginLeft: wp('2%') }}>Voucher</Text>
              </TouchableOpacity>
            </Header>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('80%'), justifyContent: 'center', alignItems: 'center' }} /> : (
              <View style={{ height: hp('90%') }}>

                <View style={{ justifyContent: 'center', alignItems: 'center', width: wp('100%'), height: hp('14%') }}>
                  <View style={{ backgroundColor: '#F9DDA4', width: wp('95%'), height: hp('13%'), justifyContent: 'flex-start', alignItems: 'center', borderRadius: 10, }}>
                    <View style={{ flexDirection: 'row' }}>
                      {/* icon image code */}
                      <View style={{ width: wp('25%'), height: hp('13%'), alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveImage source={require('../assest/Image/ShoppingBag.jpeg')} initWidth="80" initHeight="80" />
                      </View>

                      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', Width: wp('70%'), height: hp('13%') }}>
                        {/* this code for Pricing_details text  */}
                        <View style={{ width: wp('70%'), height: hp('2.5%'), justifyContent: 'center', alignItems: 'center', }}>
                          <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(1.8) }}>
                            Pricing Details
                              </Text>
                        </View>
                        {/* this code for total text  */}
                        <View style={{ marginLeft: wp('2%'), height: hp('11%'), width: wp('68%'), }}>

                          {/* Code of Total items code */}
                          <View style={{ width: wp('68%'), flexDirection: 'row', height: hp('3%'), }}>
                            <View style={{ width: wp('33.5%'), }}>
                              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                Total Amount
                                  </Text>
                            </View>
                            <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                              <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                ₹{this.state.total1}
                              </Text>
                            </View>

                          </View>
                          {/*code of Amount code  */}

                          <View style={{ width: wp('68%'), flexDirection: 'row', height: hp('3%') }}>
                            <View style={{ width: wp('33.5%'), }}>
                              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                Offer Amount
                                  </Text>
                            </View>
                            <View style={{ width: wp('32%'), alignItems: 'flex-end', marginRight: wp('1.5%') }}>
                              <Text style={{ color: 'black', fontWeight: 'bold', fontSize: RFPercentage(2.2) }}>
                                ₹ {this.state.coupanprice}
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
                                ₹{this.state.payable}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>


                <FlatList
                  data={this.state.Voucher}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id}
                />
                <Footer style={{ backgroundColor: 'transparent', width: wp('100%'), height: hp('10%'), backgroundColor: '#fff', }}>
                  <View style={{ width: wp('40%'), height: hp('8%'), marginBottom: hp('1%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    <Text>
                      Payable Amount
                            </Text>
                    <Text style={{ fontWeight: 'bold', color: 'red' }}>
                      ₹{this.state.payable}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => this.placeorder()}>
                    <View style={{ width: wp('50%'), backgroundColor: 'red', borderRadius: 5, height: hp('5%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('2.5%') }}>
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3) }}>Place Order</Text>
                    </View>
                  </TouchableOpacity>
                </Footer>

              </View>
            )}
          </View>
        )}

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: hp('1%'),
    backgroundColor: '#ecf0f1',
    padding: wp('2%'),



  },
  cardStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('2%'),
    backgroundColor: 'white',

  },
  cardStyle2: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('2%'),
    backgroundColor: 'white',

  },
  textLargeStyle: {
    margin: hp('1%'),
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  textLargeStyle1: {
    margin: hp('1%'),
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#808080',
  },
  simpleLineStyle: {
    backgroundColor: 'grey',
    width: '100%',
    height: hp('0.15%'),
  },
  headingStyle: {
    margin: hp('1%'),
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'green',
  },
  headingStyle1: {
    margin: hp('1%'),
    fontSize: RFPercentage(3),
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#808080',
  },
  paragraph: {
    margin: hp('1%'),
    fontSize: RFPercentage(2.5),
    textAlign: 'center',
  },
  logoStyle: {
    height: hp('12%'),
    width: wp('23%'),
    marginTop: hp('3%')
  }



});