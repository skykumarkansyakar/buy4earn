import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet,  StatusBar, BackHandler, ToastAndroid, ActivityIndicator, RefreshControl, Modal, TextInput, Button,Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header, Content } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import { BlurView } from "@react-native-community/blur";
import PlaceHolderImage from 'react-native-placeholderimage';

//code of data item of OrderView
const maxlimit =30;
const renderItem = ({ item }) => (
  <View style={{ width: ('100%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('1%') }}>
    <View style={styles.card1}>
      {/* Code for image */}
      <View style={{ height: hp('10%'), width: wp('26%'), marginLeft: wp('2%') }}>
      <PlaceHolderImage
                           style={styles.ImageStyle}
                           source={{ uri: `${item.image_path}` }}
                          placeHolderURI={require('../assest/Image/AvtarImage.png')}
                          placeHolderStyle={{ height: 80, width: 80 }}
                        />
      </View>
      <View style={{ height: hp('16%'), width: wp('63%'), marginLeft: wp('2%'), marginRight: wp('2%'), flexDirection: 'column', }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
          {/* PRICE */}
          <View style={{ width: wp('35%'), flexDirection: "row", height: hp('3.2%'), }}>
            <View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontSize: RFPercentage(2.5), color: '#45CE30', fontWeight: "bold", }}> ₹{item.rate}
              </Text>
            </View>
            {/* MRP */}

          </View>


          {/* OFF */}

          <View style={{ width: wp('20%'), height: hp('5%'), alignItems: 'flex-end' }}>
            <View style={{ width: wp('15%'), height: hp('4.5%'), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: RFPercentage(2.2), color: 'red', borderRadius: 8, paddingLeft: wp('1%'), paddingRight: wp('1%'), height: hp('2.5%'), textAlign: 'center' }}>
                QTY
              </Text>
            </View>
          </View>
        </View>


        {/* PRODUCT NAME */}
        <View style={{ width: wp('63%'), height: hp('4%') }}>
          <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold' }}>
            {((item.product_name).length > maxlimit) ?
              (((item.product_name).substring(0, maxlimit - 3)) + '...') :
              item.product_name}
          </Text>
        </View>
        {/* Product Size */}
        <View style={{ flexDirection: 'row', width: wp('63%'), justifyContent: 'space-between'}}>
          <View style={{ width: wp('45%'), height: hp('5%'), alignItems: 'flex-start'}}>
            <Text style={{ fontSize: RFPercentage(1.8) }}>
              {item.size_display}
            </Text>
          </View>
          <View style={{ width: wp('15%'), height: hp('5%'), justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: RFPercentage(2.5) }}>
              {item.qty}
            </Text>
          </View>
        </View>

      </View>
    </View>
  </View>
);

const TrackOrder = ({ route, navigation }) => {
  var [Item_Data, setItem_Data] = useState('');
  var [orderid, setorderid] = useState('');
  var [amount, setamount] = useState('');
  var [status, setstatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  var [employee_mobile, setemployee_mobile] = useState('');
  var [employee_name, setemployee_name] = useState('');
  const [reason, setreason] = useState('');
  const [isLoading, setLoading] = useState(true);
  const[offeramount,setofferamount]=useState('');
  const [redeemPoints,setredeemPoints]=useState('');
  const { orderID } = route.params;
  const order = orderID;
  const { pagename } = route.params;
  const [DeleveryTime, SetTime]=useState(null);


  useEffect(() => {
    fetchdata(order)
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };

  }, [order])

  const onRefresh = () => {
    //Clear old data of the list

    //Call the Service to get the latest data
    fetchdata(order)
  };
  const backAction = () => {
    fetchdata(order);
    BackHandler.removeEventListener("hardwareBackPress", backAction);
    navigation.navigate(pagename)
    return true;
  };

  const dialCall = () => {
    console.log(employee_mobile)
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${employee_mobile}`; }
    else {phoneNumber = `telprompt:${employee_mobile}`; }
    Linking.openURL(phoneNumber);
 };
 
  const canclebutton = async () => {
    setModalVisible(!modalVisible)
    setLoading(true)
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('order_id', orderid);
    dataToSend.append('Reason', reason);

    fetch('https://www.buy4earn.com/React_App/CancelOrder.php', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'multipart/form-data; ',
      }
      //Request Type 
    })
      .then((response) => response.json())
      //If response is in json then in success
      
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this._toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {

        fetchdata(order)
        setreason('')
      });

  }

  const toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }

  const fetchdata = async (recive) => {

    setLoading(true)
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('order_id', recive);
    fetch('https://buy4earn.com/React_App/TrackOrder.php', {
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
        setRefreshing(false);
        setItem_Data(responseJson.order_status.items_list);
        setorderid(responseJson.order_status.order_id)
        setamount(responseJson.order_status.amount)
        setstatus(responseJson.order_status.status)
        setemployee_mobile(responseJson.order_status.employee_mobile)
        setemployee_name(responseJson.order_status.employee_name)
        setofferamount(responseJson.order_status.offeramount)
        setredeemPoints(responseJson.order_status.redeemPoints)
        SetTime(responseJson.order_status.deliveryTime)
        
       
      }
      )

      //If response is not in json then in error
      .catch((error) => {
        //Error 
        toastWithDurationHandler('Please Try Again !');
        // console.log(error);
      })
      .finally(() => {
        setLoading(false)

      });
  }
 
  return (
    //Return of 
    <Container >
      {/* Header part of this page */}

      <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
      <TouchableOpacity style={{flexDirection:'row'}}
            onPress={() => navigation.navigate(pagename,
            )}
          >
        <View style={{ marginLeft: wp('1%'), }}>
       
            <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />
      
        </View>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3), marginLeft: wp('2%') }}>Track Order</Text>
        </TouchableOpacity>
      </Header>


      <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />


      {isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('80%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (

       <View>
           {orderid == null?

<View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: hp('75%'), width: 'auto', }}>
<ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
</View>
        :(
        <View style={{ width: wp('100%'), height: hp('100%'), }} >
        
          <View style={{ width: wp('100%'), height: hp('45%'), }}>


            <View style={{ backgroundColor: '#F5F5F5', width: wp('100%'), height: hp('45%'), flexDirection: 'row', justifyContent: 'space-between' }}>



              {/*order cancle,confirm,ordered line code */}
              <View style={{ width: wp('40%'), marginLeft: wp('1%'), }}>

                <View
                  style={{
                    borderLeftColor: 'green',
                    borderLeftWidth: 2,
                    width: wp('5%'),
                    height: hp('5%'),
                    marginLeft: wp('5%'),
                  }}
                />
                {/* order cancle,confirm,ordered code with image */}
                <View style={{ flexDirection: 'row', }}>

                  {status == 'ordered' || status == 'order confirmed' ?

                    <ResponsiveImage source={require('../assest/Gif/gif.gif')} initWidth="60" initHeight="18" style={{ marginLeft: wp('-2%') }} />

                    : (
                      <View style={{ marginTop: hp('0.2%'), marginLeft: wp('2%'), }}>
                        <ResponsiveImage source={require('../assest/Image/OrderConfirmICon.jpeg')} initWidth="25" initHeight="25" style={{ borderRadius: 100 }} />
                      </View>
                    )}



                  <View style={{ marginLeft: wp('1.5%') }}>

                    {status == 'ordered' ?
                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        ordered
           </Text>
                      : (
                        null
                      )
                    }

                    {status == 'order confirmed' ?
                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        Order Confirmed
           </Text>
                      : (
                        null
                      )
                    }
                    {status == 'Canceled' ?
                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        Canceled
           </Text>
                      : (
                        null
                      )
                    }
                    {status == 'order packed' || status == 'out for delivery' || status == 'Delivered' ?
                      <Text style={{ fontSize: RFPercentage(2), color: 'gray' }}>
                        order confirmed
           </Text>
                      : (
                        null
                      )
                    }

                  </View>
                </View>
                {/*order packed line code */}
                {status == 'order packed' || status == 'out for delivery' || status == 'Delivered' ?
                  <View
                    style={{
                      borderLeftColor: 'green',
                      borderLeftWidth: 2,
                      width: wp('5%'),
                      height: hp('5%'),
                      marginLeft: wp('5%'),

                    }} />
                  : (
                    <View
                      style={{
                        borderLeftColor: 'gray',
                        borderLeftWidth: 2,
                        width: wp('5%'),
                        height: hp('5%'),
                        marginLeft: wp('5%'),
                      }} />
                  )
                }

                {/* order packed code with image */}
                <View style={{ flexDirection: 'row' }}>

                  {status == 'order packed' ?
                    <ResponsiveImage source={require('../assest/Gif/gif.gif')} initWidth="60" initHeight="18" style={{ marginLeft: wp('-2%') }} />
                    : (
                      <View style={{ marginTop: hp('0.2%'), marginLeft: wp('2%') }}>
                        <ResponsiveImage source={require('../assest/Image/shoppingbagicon.jpeg')} initWidth="25" initHeight="25" style={{ borderRadius: 100 }} />
                      </View>
                    )
                  }

                  <View style={{ marginLeft: wp('1.5%') }} >
                    {status == 'order packed' ?

                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        Order Packed
                       </Text> : (
                        <Text style={{ fontSize: RFPercentage(2), color: 'gray' }}>
                          Order Packed
                        </Text>
                      )
                    }
                  </View>
                </View>


                {/*out for delivery line code */}
                {status == 'out for delivery' || status == 'Delivered' ?
                  <View
                    style={{
                      borderLeftColor: 'green',
                      borderLeftWidth: 2,
                      width: wp('5%'),
                      height: hp('5%'),
                      marginLeft: wp('5%'),


                    }} />
                  : (
                    <View
                      style={{
                        borderLeftColor: 'gray',
                        borderLeftWidth: 2,
                        width: wp('5%'),
                        height: hp('5%'),
                        marginLeft: wp('5%'),
                      }} />
                  )
                }

                {/* out for delivery code with image */}
                <View style={{ flexDirection: 'row' }}>
                  {status == 'out for delivery' ?
                    <ResponsiveImage source={require('../assest/Gif/gif.gif')} initWidth="60" initHeight="18" style={{ marginLeft: wp('-2%') }} />
                    : (
                      <View style={{ marginTop: hp('0.2%'), marginLeft: wp('2%') }}>
                        <ResponsiveImage source={require('../assest/Image/OrderDeliveredIcon.jpeg')} initWidth="25" initHeight="25" style={{ borderRadius: 100 }} />
                      </View>
                    )
                  }

                  <View style={{ marginLeft: wp('1.5%') }} >
                    {status == 'out for delivery' ?

                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        Out for delivery
                       </Text> : (
                        <Text style={{ fontSize: RFPercentage(2), color: 'gray' }}>
                          Out for delivery
                        </Text>
                      )
                    }
                  </View>
                </View>

                {/* order deleverd line code */}
                {status == 'Delivered' ?
                  <View
                    style={{
                      borderLeftColor: 'green',
                      borderLeftWidth: 2,
                      width: wp('5%'),
                      height: hp('5%'),
                      marginLeft: wp('5%'),


                    }} />
                  : (
                    <View
                      style={{
                        borderLeftColor: 'gray',
                        borderLeftWidth: 2,
                        width: wp('5%'),
                        height: hp('5%'),
                        marginLeft: wp('5%'),


                      }} />
                  )
                }
                {/* order deleverd  code with image  */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ marginTop: hp('0.2%'), marginLeft: wp('2%') }}>
                    {status == 'Delivered' ?
                      <ResponsiveImage source={require('../assest/Image/OrderConfirmgreen.jpeg')} initWidth="25" initHeight="25" style={{ borderRadius: 100 }} />
                      : (
                        <ResponsiveImage source={require('../assest/Image/OrderConfirm.jpeg')} initWidth="25" initHeight="25" style={{ borderRadius: 100 }} />
                      )
                    }
                  </View>
                  <View style={{ marginLeft: wp('1.5%') }} >
                    {status == 'Delivered' ?

                      <Text style={{ fontSize: RFPercentage(2), color: 'red', fontWeight: 'bold' }}>
                        Delivered
             </Text> : (
                        <Text style={{ fontSize: RFPercentage(2), color: 'gray' }}>
                          Delivered
                        </Text>
                      )
                    }
                  </View>

                </View>



                {/* code for orderd button  */}
                {status == 'ordered' ?
                  <View style={{ height: hp('4%'), width: wp('90%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: wp('25%'), margin: wp('2%'), height: hp('4%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#45ce30' }}>
                      <Text style={{ color: '#fff' }}>Ordered</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                      setModalVisible(!modalVisible)
                    }}>

                      <View style={{ width: wp('30%'), margin: wp('2%'), height: hp('4%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
                        <Text style={{ color: '#fff' }}>Cancel Order</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  : (
                    null
                  )
                }

                {/* code for cancle  button  */}
                {status == 'Canceled' ?
                  <View style={{ width: wp('25%'), margin: wp('2%'), height: hp('4%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
                    <Text style={{ color: '#fff' }}>{status}</Text>
                  </View> : (
                    null
                  )
                }

                {/* code for out for delivery */}
                {status == 'out for delivery' ?
                  <View style={{ height: hp('4%'), width: wp('90%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: wp('25%'), margin: wp('2%'), height: hp('4%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: '#45ce30' }}>
                      <Text style={{ color: '#fff' }}>Delivery Boy</Text>
                    </View>
                    <TouchableOpacity onPress={() => dialCall()}>
                      <View style={{ width: 'auto', margin: wp('2%'), padding: wp('2%'), height: hp('5%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }} >
                        <Text style={{ color: '#fff', textAlign: 'center' }}><ResponsiveImage source={require('../assest/Image/call.jpeg')} initWidth="20" initHeight="20" /> {employee_name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  : (
                    null
                  )
                }
                {/* order Delivered code  */}
                {status == 'Delivered' ?
                  <View style={{ width: wp('25%'), margin: wp('2%'), height: hp('4%'), borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'red' }}>
                    <Text style={{ color: '#fff' }}>{status}</Text>
                  </View> : (
                    null
                  )
                }
                
                {DeleveryTime!=null &&DeleveryTime!='' && DeleveryTime!='null'?
  <View style={{height:hp('5%'),marginTop:hp('1%'),width:wp('30%'),justifyContent:'center',alignItems:'center'}}>
  <Text style={{color:'#45ce30',}}>
   {DeleveryTime}
  </Text>
  </View>
     :null
            }
             
              </View>

              {/*big image code*/}
              <View style={{ width: wp('56%'), marginRight: wp('1%') }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('1%'), }}>
                  {status == 'Canceled' ?
                    <ResponsiveImage source={require('../assest/Image/cancleorder.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }
                  {status == 'ordered' ?
                    <ResponsiveImage source={require('../assest/Image/ordered.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }
                  {status == 'order confirmed' ?
                    <ResponsiveImage source={require('../assest/Image/ordered.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }
                  {status == 'order packed' ?
                    <ResponsiveImage source={require('../assest/Image/orderpack.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }
                  {status == 'out for delivery' ?
                    <ResponsiveImage source={require('../assest/Image/outfordelivery.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }
                  {status == 'Delivered' ?
                    <ResponsiveImage source={require('../assest/Image/orderddelivered.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 100 }} />
                    : (null)

                  }

                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('0.5%') }}>
                  <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.5), color: 'red' }}>
                    Order ID
           </Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    marginLeft: wp('3%'),
                    width: wp('50%')
                  }}
                />
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp('0.5%')}}>
                  <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.8), color: 'black' }}>
                    {orderid}
                  </Text>
                </View>
               
                {redeemPoints==''||redeemPoints==null||redeemPoints<=0 || redeemPoints=='null'
                ?null
                :
                <View style={{ width: wp('55%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ width: wp('20%'), justifyContent: 'center', alignItems: 'center'  }}>
                  <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: 'black' }}>
                    Redeem:
         </Text>
                </View>
                <View style={{ width: 'auto', }}>
                  <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#45CE30' }}>
                    {redeemPoints}
                  </Text>
                </View>
                
              </View> 
                }
               {
                 offeramount==''||offeramount==null||offeramount<=0 || offeramount=='null'
                 ?
                 null
                 :
                 <View style={{ width: wp('55%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  }}>
                 <View style={{ width: wp('20%'), justifyContent: 'center', alignItems: 'center', }}>
                   <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: 'black' }}>
                       Voucher:
          </Text>
                 </View>
                 <View style={{ width: 'auto', }}>
                   <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#45CE30' }}>
                     ₹{offeramount}
                   </Text>
                 </View>
                 
               </View>
               }
              <View style={{ width: wp('55%'), flexDirection: 'row', justifyContent: 'center' , alignItems: 'center',  }}>
                  <View style={{ width: wp('20%'), justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: 'black' }}>
                      Amount:
                   </Text>
                  </View>
                  <View style={{ width: 'auto', }}>
                    <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2.2), color: '#45CE30' }}>
                      ₹{Math.round(amount)}
                    </Text>
                  </View>
                  
                </View>

              </View>
            </View>

          </View>
          <Content refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            <View style={{ marginBottom: hp('13%'), }}>

              {refreshing ? <ActivityIndicator /> : null}
              <FlatList
                data={Item_Data}
                renderItem={renderItem}
                keyExtractor={item => item.srid}
                scrollEnabled
                refreshControl={
                  <RefreshControl
                    //refresh control used for the Pull to Refresh
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>


            <Modal animationType="slide"
              visible={modalVisible}
              transparent={true}
              onRequestClose={() => { console.log("Modal has been closed.") }}>
              <BlurView
                style={styles.absolute}

                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
              />


              {/* modal view code */}
              <View style={{
                position: 'absolute',
                bottom: 2,
                width: wp('100%'),
                height: hp('41%'),
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',

              }}>
                <View style={styles.modalView}>
                  <View style={{ height: hp('20%'), margin: hp('1%'), borderBottomWidth: 1, width: wp('90%'), borderColor: '#758283', borderWidth: 1, }}>
                    <TextInput
                      placeholder="Reason For Canclelling Order!"
                      value={reason}
                      onChangeText={data => setreason(data)}
                      style={{ fontSize: RFPercentage(2.4), }}
                      keyboardType='default'
                      autoCompleteType="off"
                      placeholderTextColor="#ff0000"
                      multiline={true}
                    />
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ margin: wp('1%'), marginRight: wp('2%') }}>
                      <Button
                        style={styles.buttonstyle}
                        title="CANCEL"
                        color="red"
                        onPress={() => setModalVisible(!modalVisible)}
                      />
                    </View>
                    <View style={{ margin: wp('1%'), marginLeft: wp('2%') }}>
                      <Button
                        style={styles.buttonstyle}
                        title="Submit"
                        color="#45CE30"
                        onPress={() => { canclebutton() }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </Content>
      
        </View>
        )}
        </View>

      )}
    </Container>
  );
}

//styles
const styles = StyleSheet.create({
  // Add product TrackOrder style

  card1: {
    height: hp('17%'),
    width: wp('95%'),
    backgroundColor: '#fefefe',
    borderRadius: 10,
    elevation:5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),

  },
  ImageStyle: {
    height: hp('10%'),
    width: wp('26%')
  },


  modalView: {
    flex: 1,
    position: 'absolute',
    bottom: 2,
    width: wp('95%'),
    backgroundColor: '#e6ffee',
    height: hp('28%'),
    borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    elevation: 10,

  },

  buttonstyle: {
    borderWidth: 5,
    height: hp('100%'),
    padding: wp('2%'),
  }


});


export default TrackOrder;