
// Importing Libraries
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
//   Rendering Format
export default class BuddyPoint extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            BuddyPointsData: '',
            maxlimit:50,
        }
    }

    componentDidMount = async () => {
        this.GetBuddyPointData();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.GetBuddyPointData();
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    toastWithDurationHandler = (message) => {
        //function to make Toast With Duration
        ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
    }
    GetBuddyPointData = async () => {
        this.setState({ isLoading: true })
        var mtsLogin = await AsyncStorage.getItem('mts');
        var dataToSend = new FormData();
        dataToSend.append('mts', mtsLogin);
        fetch('https://www.buy4earn.com/React_App/BuddyPoints.php', {
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
                this.setState({ BuddyPointsData: responseJson.abccms })
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error 
                toastWithDurationHandler('Please Try Again !');
            })
            .finally(() => this.setState({ isLoading: false }));
    }
    render_buddy_points = ({ item }) => (
   <View>
       {
           
           item.abc_cms<=0 ||item.abc_cms==''||item.abc_cms==null?

           null:
       
        <View style={styles.userCardStyle}>

            <View style={{ width: wp('65%'), flexDirection: 'column', }}>
                <View style={{ flexDirection: 'row', marginTop: hp('0.5%'), height: hp('3%') }}>
                    <View style={{ width: wp('4%'), justifyContent: "center", alignItems: "center", marginLeft: wp('3%'), marginTop: hp('1%') / 2 }}>
                        <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="20" initHeight="20" style={{ borderRadius: 100 }} />
                    </View>
                    <View>
                        <Text style={{ marginLeft: wp('1%'), fontSize: RFPercentage(2), color: "#45CE30" }}> {item.abc_cms}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: hp('0.3%') }}>
                    <View style={{ width: wp('5%'), height: hp('5%') / 2, marginLeft: wp('3%'), }}>
                        <ResponsiveImage source={require('../assest/Image/CalenderIcon.jpeg')} initWidth="20" initHeight="20" />
                    </View>
                    <View>
                        <Text style={{ color: 'black', fontSize: RFPercentage(1.6), }}> {item.date}</Text>
                    </View>
                </View>


                <View style={{ height: hp('4.6%'), }}>
                    <Text style={{ marginLeft: wp('3%'), fontWeight: 'bold', fontSize: RFPercentage(1.8) }}>
                    {((item.name_down).length > this.state.maxlimit) ?
                    (((item.name_down).substring(0, this.state.maxlimit - 3)) + '...') :
                    item.name_down}
                    </Text>
                    
                </View>
                <View style={{ height: hp('3.5%'), marginLeft: wp('1%') }}>
                    <Text style={{ marginLeft: wp('2%'), color: '#8c8e91', fontSize: RFPercentage(2), }}><ResponsiveImage source={require('../assest/Image/PhoneIcon.jpeg')} initWidth="20" initHeight="20" /> {item.mobile_downline}</Text>
                </View>


            </View>
            <View style={{ width: wp('30%'), justifyContent: 'center', alignItems: 'center', }}>
                {
                    item.profile == null ?
                        <ResponsiveImage source={require('../assest/Image/man.jpeg')} initWidth="100" initHeight="100" style={{ borderRadius: 90 }} />
                        :
                        <ResponsiveImage source={{ uri: item.profile }} initWidth="100" initHeight="100" style={{ borderRadius: 90 }} />

                }
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
                
                {this.state.BuddyPointsData.length === 0 ?
                
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#fff' }}>
                        <ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
                    </View>
                    : (
                        <View style={{ marginBottom: hp('9%') }}>
                            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('70%'), justifyContent: 'center', alignItems: 'center' }} /> : (
                                <View>
                                    <FlatList
                                        data={this.state.BuddyPointsData}
                                        renderItem={this.render_buddy_points}
                                        keyExtractor={item => item.sno}
                                    />
                                    <View style={{ margin: 100 }}></View>
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
        margin: 5,
        borderRadius: 15,
        alignSelf: "center",
        backgroundColor: "white",
        height: hp('15%'),
        shadowColor: "black",
        width: wp('95%'),
        flexDirection: 'row'
    }
});
// Exportinf Final
