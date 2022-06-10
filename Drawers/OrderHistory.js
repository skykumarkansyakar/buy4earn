import React from 'react';
import { View, StyleSheet, Text, FlatList,StatusBar ,BackHandler,ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Container, Header, Content } from 'native-base';
import ResponsiveImage from 'react-native-responsive-image';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RFPercentage} from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class OrderHistory extends React.Component {
constructor(props) {
super(props);
this.state = {
isLoading:true,
order_list:'',
}
}

componentDidMount = async () => {
this.fetchdata();
this._unsubscribe = this.props.navigation.addListener('focus', () => {
this.fetchdata();
});
}
componentWillUnmount() {
this._unsubscribe();
}
fetchdata = async () => {
this.setState({isLoading:true})
var mtsLogin = await AsyncStorage.getItem('mts');
var dataToSend = new FormData();
dataToSend.append('mts', mtsLogin);
fetch('https://www.buy4earn.com/React_App/OrderList.php', {
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
this.setState({order_list:responseJson.order_list});
})
//If response is not in json then in error
.catch((error) => {
//Error
this.toastWithDurationHandler('Please Try Again !');
})
.finally( () => {
this.setState({isLoading:false})
});
}
renderItem = ({ item }) => (
<View style={styles.card}>
    <View style={{ height: hp('4%'), width: wp('95%'), justifyContent: 'center' , alignItems: 'center' }}>
        <Text style={{ textAlign: 'center' ,fontSize: RFPercentage(2.2) }}>
            ORDERED DATE {item.date}
        </Text>
    </View>
    <View style={{ flexDirection: 'row' , alignItems: 'center' , height: hp('4%'), width: wp('95%'),
        justifyContent: 'center' }}>
        <Text style={{ fontSize: RFPercentage(2), textAlign: 'center' , marginLeft: wp('3%'), color: 'grey' }}>
            DELIVERED BY BUY4EARN AT {item.delivery_time}
        </Text>
    </View>
    <View style={{ flexDirection: 'row' }}>
        <View style={{ height: hp('14%'), width: wp('25%'), marginTop: hp('5%'), marginRight: wp('2%') }}>
            <ResponsiveImage source={require('../assest/Image/orderlist.jpeg')} initWidth="100" initHeight="100" />
        </View>
        <View style={{ width: wp('68%'), height: 'auto' , flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' ,height:hp('3%'),justifyContent:'center',alignItems:'center' }}>
                <View style={{ width: wp('40%'), }}>
                    <Text style={{ fontSize: RFPercentage(2.2), fontWeight: 'bold' }}>
                        Amount
                    </Text>
                </View>
                <View style={{ flexDirection: 'row-reverse' , width: wp('25%'), }}>
                    <Text style={{ fontSize: RFPercentage(2.2), }}>
                        ₹ {item.amount}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row' ,height:hp('4%'),justifyContent:'center',alignItems:'center' }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), }}>
                    <Text style={{ fontSize: RFPercentage(2.2), color: 'grey' }}>
                        Delivery Charge
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{ color: '#45CE30' , fontSize: RFPercentage(2.2) }}>
                        {item.deliverycharge}
                    </Text>
                </View>
            </View>


            <View style={{ flexDirection: 'row' ,height:hp('4%'),justifyContent:'center',alignItems:'center' }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), }}>
                    <Text style={{ fontSize: RFPercentage(2.2), color: 'red' }}>
                        ORDER NO
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{ color: 'red' , fontSize: RFPercentage(2.2) }}>
                        {item.order_id}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row' ,justifyContent:'center',alignItems:'center' }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), }}>
                    <Text style={{ fontSize: RFPercentage(2.2), color: 'grey' }}>
                        Status
                    </Text>
                </View>
                {item.status=='Canceled'?
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{ color: 'red' , fontSize: RFPercentage(2.2) }}>
                        {item.status}
                    </Text>
                </View>
                :
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{ color: '#45CE30' , fontSize: RFPercentage(2.2) }}>
                        {item.status}
                    </Text>
                </View>
                }
            </View>

            {item.redeemPoints==''||item.redeemPoints==null||item.redeemPoints==0 ||item.redeemPoints=='null'
            ?null
            :
            <View style={{ flexDirection: 'row' ,height:hp('3.5%'),alignItems:"center" }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), marginBottom: hp('0.5%') }}>
                    <Text style={{ fontSize: RFPercentage(2.3) }}>
                        Redeem Amount
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{fontSize:RFPercentage(2.2)}}>
                        {item.redeemPoints}
                    </Text>
                </View>

            </View>
            }
            {item.offeramount==''||item.offeramount==null||item.offeramount==0 ||item.offeramount=='null'
            ?null
            :
            <View style={{ flexDirection: 'row' ,height:hp('3.5%'),alignItems:"center" }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), marginBottom: hp('0.5%') }}>
                    <Text style={{ fontSize: RFPercentage(2.3) }}>
                        Voucher Amount
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{fontSize:RFPercentage(2.2)}}>
                        ₹{item.offeramount}
                    </Text>
                </View>

            </View>
            }
            <View style={{ flexDirection: 'row' ,height:hp('3.5%'),alignItems:"center" }}>
                <View style={{ width: wp('40%'), marginTop: hp('0.5%'), marginBottom: hp('0.5%') }}>
                    <Text style={{ fontSize: RFPercentage(2.3) }}>
                        Total Amount
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{fontSize:RFPercentage(2.2)}}>
                        ₹{Math.round(item.total_amount)}
                    </Text>
                </View>

            </View>
            <View style={{ flexDirection: 'row' ,height:hp('3.5%'),alignItems:'center' }}>
                <View style={{ width: wp('40%') }}>
                    <Text style={{ fontSize: RFPercentage(2.2), color: '#45CE30' }}>
                        Self Point
                    </Text>
                </View>
                <View style={{ width: wp('25%'), flexDirection: 'row-reverse' }}>
                    <Text style={{fontSize:RFPercentage(2.2)}}>
                        {item.selfcms}
                    </Text>
                </View>

            </View>

        </View>

    </View>


    <TouchableOpacity onPress={()=>
        this.props.navigation.navigate('TrackOrder' ,{
        orderID:item.order_id,
        pagename:'OrderHistory'
        })}
        >
        <View style={{ backgroundColor: '#E8290B' , width: wp('95%'), height: hp('5%'), alignItems: 'center' ,
            justifyContent: 'center' , borderRadius: 10, marginBottom: hp('1%'), marginTop: hp('1%') }}>
            <Text style={{ color: "#fff" , textAlign: 'center' ,fontSize:RFPercentage(2.2) }}>
                VIEW DETAILS
            </Text>
        </View>
    </TouchableOpacity>

</View>
)
render(){


return (
<Container>
    {/* Header Code */}
    <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30'
        ,justifyContent:'flex-start',alignItems:'center'}}>

        <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> this.props.navigation.navigate('Home')}
            >
            <View style={{ color: 'white' , marginLeft: wp('1%'),}}>

                <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />

            </View>
            <Text
                style={{color:'white',fontWeight:'bold',fontSize:RFPercentage(3),marginLeft:wp('2%'),marginTop:hp('0.5%')}}>Order
                History</Text>
        </TouchableOpacity>
    </Header>
    <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
    {this.state.isLoading ?
    <ActivityIndicator color="green" size={wp('10%')} style={{ height:hp('80%'),width:wp('100%'),
        justifyContent: 'center' , alignItems: 'center' ,}} /> : (
    <Content>
                {this.state.order_list == '' || this.state.order_list == null ? 

<View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: hp('75%'), width: 'auto', }}>
<ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
</View>:(
        <FlatList data={this.state.order_list} renderItem={this.renderItem} keyExtractor={item=> item.order_id}
            scrollEnabled
            />
        )}
    </Content>
    )}
</Container>
)
}
}

const styles = StyleSheet.create({
// Main Image Code
card: {

height: 'auto',
width: 'auto',
backgroundColor: '#F9DDA4',
flexDirection: 'column',
justifyContent: 'flex-start',
alignItems: 'center',
marginTop: hp('1%'),
elevation: 10,


}
});