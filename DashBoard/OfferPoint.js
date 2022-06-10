
// Importing Libraries
import React, { } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';

//   Rendering Format
export default class OfferPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            OfferPoints: '',
        }
    }

    componentDidMount = async () => {
        this.GetOfferPointsData();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.GetOfferPointsData();
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    GetOfferPointsData = async () => {
        this.setState({ isLoading: true })
        var mtsLogin = await AsyncStorage.getItem('mts');
        var dataToSend = new FormData();
        dataToSend.append('mts', mtsLogin);
        fetch('https://www.buy4earn.com/React_App/OfferPoints.php', {
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
                this.setState({ OfferPoints: responseJson.offercms })

            })
            //If response is not in json then in error
            .catch((error) => {
                //Error 
                this.toastWithDurationHandler('Please Try Again !');
            })
            .finally(() => this.setState({ isLoading: false }));
    }
    toastWithDurationHandler = (message) => {
        //function to make Toast With Duration
        ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
    }
    render_offer_points = ({ item }) => (

<View>
{
           
           item.offer_cms<=0 ||item.offer_cms==''||item.offer_cms==null?

           null:
        <View style={styles.userCardStyle}>

            <View style={{ width: wp('95%'), flexDirection: 'column' }}>
                {/* first row of card */}
                <View style={{ flexDirection: 'row', marginTop: hp('0.5%'), height: hp('3%'), width: wp('95%') }}>
                    {/* point code */}
                    <View style={{ width: wp('4%'), justifyContent: "center", alignItems: "center", marginLeft: wp('3%'), marginTop: hp('0.5%') }}>
                        <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="20" initHeight="20" style={{ borderRadius: 100 }} />
                    </View>
                    <View style={{ width: wp('40%') }}>
                        <Text style={{ marginLeft: wp('1%'), fontSize: RFPercentage(2.5), color: "#45CE30" }}> {item.offer_cms}</Text>
                    </View>

                    <View style={{ width: wp('7%'), height: hp('3.5%'), marginLeft: wp('3%') }}>
                        <ResponsiveImage source={require('../assest/Image/CalenderIcon.jpeg')} initWidth="25" initHeight="25" />
                    </View>
                    <View style={{ height: hp('3%'), width: wp('40%') }}>
                        <Text style={{ color: 'black', fontSize: RFPercentage(2), }}> {item.date}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', height: 'auto' }}>
                    <View style={{ marginLeft: wp('2.5%'), marginTop: hp('0.5%'), height: hp('5%') }} >
                        <ResponsiveImage source={require('../assest/Image/GiftIcon.jpeg')} initWidth="25" initHeight="25" />

                    </View>

                    <View style={{ height: 'auto', marginTop: hp('1%'), width: wp('85%'), marginBottom: hp('1%') }}>
                        <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(1.8) }}>{item.remark}</Text>
                    </View>
                </View>
            </View>
        </View>
}
        </View>
    );

    // JSX Return
    render() {
        return (
            //Return of Flatlist
            <SafeAreaView style={{ flex: 1 }}>
                {this.state.OfferPoints.length === 0 ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
                        <ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
                    </View>
                    : (
                        <View>
                            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('70%'), justifyContent: 'center', alignItems: 'center' }} /> : (
                                <FlatList
                                    data={this.state.OfferPoints}
                                    renderItem={this.render_offer_points}
                                    keyExtractor={item => item.sno}
                                />
                            )}
                        </View>
                    )}
            </SafeAreaView>
        );
    }



}
//Styles CSS
const styles = StyleSheet.create({
    userCardStyle: {
        borderRadius: 15,
        margin: hp('0.5%'),
        alignSelf: "center",
        backgroundColor: "white",
        height: 'auto',
        shadowColor: "black",
        width: wp('95%'),
        flexDirection: 'row'
    }
});
// Exportinf Final
