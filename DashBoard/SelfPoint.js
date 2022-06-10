
// Importing Libraries
import React, { } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";

export default class SelfPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            SelfPontsdata: '',
        }
    }
    toastWithDurationHandler = (message) => {
        //function to make Toast With Duration
        ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
    }

    componentDidMount = async () => {
        this.GetSelfPointData();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.GetSelfPointData();
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    GetSelfPointData = async () => {
        this.setState({ isLoading: true })
        var mtsLogin = await AsyncStorage.getItem('mts');
        var dataToSend = new FormData();
        dataToSend.append('mts', mtsLogin);
        fetch('https://www.buy4earn.com/React_App/SelfPoints.php', {
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
                this.setState({ SelfPontsdata: responseJson.selfcms })
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error 
                this.toastWithDurationHandler('Please Try Again !');
            })
            .finally(() => this.setState({ isLoading: false }));
    }
    render_self_points = ({ item }) => (
        <View>
 {item.self_cms<=0 ||item.self_cms==''||item.self_cms==null?

null:
<View style={styles.userCardStyle}>
               
<View style={{ width: wp('9%'), marginLeft: wp('2%'), marginTop: hp('1%'), height: hp('4.5%') }}>
    <ResponsiveImage source={require('../assest/Image/CalenderIcon.jpeg')} initWidth="30" initHeight="30" />

</View>
<View style={{ width: wp('26%'), height: hp('3%'), justifyContent: "center", alignItems: "center", marginTop: hp('1.2%') }}>
    <Text style={{ width: wp('25%'), backgroundColor: 'white', fontSize: RFPercentage(2.2), color: 'black', }}> {item.date}</Text>
</View>
<View style={{ width: wp('3%'), justifyContent: "center", alignItems: "center", marginLeft: wp('4%') }}>
    <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="22" initHeight="22" style={{ borderRadius: 100 }} />

</View>
<View style={{ width: wp('50%'), marginLeft: wp('2.5%'), marginTop: hp('0.8%') }}>
    <Text style={{ fontSize: RFPercentage(3.2), color: "#45CE30", height: wp('10%'), width: wp('40%') }} >{item.self_cms}</Text>
</View>

</View>

                }
         


        </View>
    );


    render() {
        return (
            //Return of Flatlist
            <SafeAreaView style={{ flex: 1 }}>
                {this.state.SelfPontsdata.length === 0 ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
                        <ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
                    </View>
                    : (

                        <View>
                            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('70%'), justifyContent: 'center', alignItems: 'center' }} /> : (
                                <View style={{ marginBottom: hp('0.5%') }}>
                                    <FlatList
                                        data={this.state.SelfPontsdata}
                                        renderItem={this.render_self_points}
                                        keyExtractor={item => item.sno}
                                    />
                                </View>
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
        margin: hp('0.5%'),
        borderRadius: wp('5%'),
        alignSelf: "center",
        backgroundColor: "white",
        shadowColor: "black",
        width: wp('95%'),
        flexDirection: 'row',
        height: hp('6%')
    }
});
// Exportinf Final