
// Importing Libraries
import React, { } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, SafeAreaView, ScrollView, ActivityIndicator, Modal, TextInput, ToastAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import ResponsiveImage from 'react-native-responsive-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { BlurView } from "@react-native-community/blur";
// JSX Return

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isloadingImage: false,
            modalVisible: false,
            modalVisible1: false,
            modalVisible2: false,
            username: '',
            dataOfUser: '',
            fileData: '',
            mts:''
        }
        if (Text.defaultProps == null) Text.defaultProps = {};
        Text.defaultProps.allowFontScaling = false; 
    }

    componentDidMount = async () => {
        this.fetchDetails();
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.fetchDetails();
        });
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    fetchDetails = async () => {
        this.setState({ isLoading: true })
        var mtsLogin = await AsyncStorage.getItem('mts');
        var dataToSend = new FormData();
        this.setState({mts:mtsLogin});
        dataToSend.append('mts', mtsLogin);
        fetch('https://www.buy4earn.com/React_App/DashboardDetails.php', {
            method: 'POST',
            body: dataToSend,
            headers: {
                'Content-Type': 'multipart/form-data; ',
            }
        })
            .then((response) => response.json())
            .then((json) => this.setState({ dataOfUser: json }))
            .finally(() => {
                this.setState({ isLoading: false })
            });
    }

    savebutton = async () => {
        if (this.state.username == '') {
            this._toastWithDurationHandler('Please Enter Your Name !');
        }
        else {
            this.setState({ isLoading: true })
            var mtsLogin = await AsyncStorage.getItem('mts');
            var dataToSend = new FormData();
            dataToSend.append('mts', mtsLogin);
            dataToSend.append('name', this.state.username);
            fetch('https://www.buy4earn.com/React_App/ChangeName.php', {
                method: 'POST',
                body: dataToSend,
                headers: {
                    'Content-Type': 'multipart/form-data; ',
                }
            })
                .then((response) => response.json())
                .finally(() =>
                    this.fetchDetails(),
                    this.setState({ modalVisible: false }),
                    this._toastWithDurationHandler('Name Change Sucessfully!'),
                    this.setState({ username: '' }),
                );

        }
    }



    chooseImage = () => {
        let options = {
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            cropping: true,
            maxHeight: 800, //speeds up compressImage to almost no time
            maxWidth: 800, //speeds up compressImage to almost no time
            compressImageQuality: 0.4,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                return;
            };
            {
                this.setState({ fileData: response.data, })
                this.converBase64(response.uri)

            }
        });
    }
    converBase64 = (fileUri) => {

        RNFS.readFile(fileUri, 'base64')

            .then(res => {
                this.setState({ isLoading: true })
                this.ImageUpload(res);
            });
    }
    ImageUpload = async (base64Image) => {
        var dataToSend = new FormData();
        var mtsLogin = await AsyncStorage.getItem('mts');
        dataToSend.append('mts', mtsLogin);
        dataToSend.append('image', base64Image);
        fetch('https://www.buy4earn.com/checking/image_upload_profile.php', {
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
                if (responseJson.Status == 'OK') {
                    this._toastWithDurationHandler('Image Uploaded !');
                    this.setState({ isLoading: false })
                }
                else {
                    this._toastWithDurationHandler('Please Try Again !');
                    this.setState({ isLoading: false })
                }
            })
            //If response is not in json then in error
            .catch((error) => {
                //Error 
                this._toastWithDurationHandler('Please Try Again !')
            });
    }
    _toastWithDurationHandler = (message) => {
        //function to make Toast With Duration
        ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
    }
    render() {
        return (
            //Return of Flatlist
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <View>
                        {/* modal of name edit  */}
                        <Modal animationType={'fade'} transparent={true}
                            visible={this.state.modalVisible}
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
                                height: hp('20%'),
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',


                            }}>
                                <View style={styles.modalView}>
                                    <View style={{ width: wp('90%'), height: hp('5%'), justifyContent: 'center', alignItems: 'flex-start', marginRight: wp('2.5%'), }}>
                                        <Text style={{ fontSize: RFPercentage(3), color: '#45CE30' }}>Edit Profile Name</Text>
                                    </View>


                                    <View style={{ height: hp('6%'), marginTop: hp('2%'), borderBottomWidth: 1, width: wp('80%'), borderColor: '#758283', alignItems: 'center' }}>
                                        <TextInput
                                            placeholder="Enter Your Name"
                                            value={this.state.username}
                                            onChangeText={data => this.setState({ username: data })}
                                            style={{ fontSize: RFPercentage(2.4), }}
                                            keyboardType='default'
                                            maxLength={50}
                                            autoCompleteType="off"
                                            placeholderTextColor="#758283"
                                        />
                                    </View>


                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('70%'), marginTop: hp('1%') }}>
                                        <TouchableOpacity onPress={() => {
                                            this.setState({ modalVisible: false })

                                        }}>
                                            <View style={{ width: wp('30%'), height: hp('5%'), justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'red', flexDirection: 'row', marginTop: hp('2%') }}>
                                                <View style={{ justifyContent: 'space-between' }}></View>
                                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>CANCEL</Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* code of cancel button */}
                                        <TouchableOpacity onPress={() => {
                                            this.savebutton()
                                        }}>
                                            <View style={{ width: wp('30%'), height: hp('5%'), justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: 'red', flexDirection: 'row', marginTop: hp('2%') }}>
                                                <View style={{ justifyContent: 'space-between' }}></View>
                                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>SAVE</Text>
                                            </View>
                                        </TouchableOpacity>


                                    </View>
                                </View>
                            </View>

                        </Modal>

                        <View style={{ height: 'auto' }}>
                            {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('70%'), justifyContent: 'center', alignItems: 'center' }} /> : (
                                <View style={styles.userCardStyle}>

                                    <View style={{ flexDirection: 'column', height: hp('80%'), marginRight: wp('3%'), marginTop: hp('1%') }}>

                                        {/* code for picture */}
                                        <View style={{ width: wp('96%'), height: hp('25%'), justifyContent: "center", alignItems: "center", borderRadius: 100, }}>
                                            <TouchableOpacity onPress={() => this.chooseImage()}  >
                                                {this.state.fileData ?
                                                    [
                                                        (this.state.isloadingImage
                                                            ?
                                                            <View style={{ width: 170, height: 170, borderRadius: 100, borderWidth: 6, borderColor: '#45CE30', justifyContent: 'center', alignItems: 'center' }}>
                                                                <ActivityIndicator size="large" color="#00ff00" />
                                                            </View>
                                                            :
                                                            <ResponsiveImage source={{ uri: 'data:image/jpeg;base64,' + this.state.fileData }} initWidth="170" initHeight="170"
                                                                style={{ borderRadius: 100, borderWidth: 6, borderColor: '#45CE30' }}
                                                            />

                                                        )
                                                    ]
                                                    :
                                                    this.state.dataOfUser.profile_picture != null ?
                                                        <ResponsiveImage source={{ uri: this.state.dataOfUser.profile_picture }} initWidth="160" initHeight="160" style={{ borderRadius: 100, borderWidth: 6, borderColor: '#45CE30' }} />
                                                        :
                                                        <ResponsiveImage source={require('../assest/Image/male.jpeg')} initWidth="150" initHeight="150" style={{ borderRadius: 100, borderWidth: 6, borderColor: '#45CE30' }} />
                                                }
                                                {this.state.isloadingImage ? null :
                                                    <ResponsiveImage source={require('../assest/Image/EditCamera.jpeg')} initWidth="50" initHeight="50" style={{ marginLeft: wp('25%'), marginTop: hp('-7%') }} />
                                                }
                                            </TouchableOpacity>
                                        </View>
                                        {/* item name code */}
                                        {this.state.dataOfUser.kyc_status == "KYC Done" ?
                                            <View style={{ height: hp('6%'), width: 'auto', justifyContent: 'center', alignItems: "center" }}>

                                                <Text style={{ fontSize: RFPercentage(2.8), fontWeight: 'bold', textAlign: 'center' }}>{this.state.dataOfUser.user_name}</Text>
                                            </View>
                                            : (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.setState({ modalVisible: true })
                                                    }}
                                                >
                                                    <View style={{ height: hp('6%'), width: 'auto', justifyContent: 'center', alignItems: "center" }}>

                                                        <Text style={{ fontSize: RFPercentage(2.8), fontWeight: 'bold', textAlign: 'center' }}>{this.state.dataOfUser.user_name}<ResponsiveImage source={require('../assest/Image/EditIcon.jpeg')} initWidth="20" initHeight="20" /></Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                        {
                                            this.state.dataOfUser.Teamwork ?
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.props.navigation.navigate('Voucher')
                                                    }}
                                                >
                                                    <View style={{ height: hp('2.5%'), width: 'auto', justifyContent: 'center', alignItems: "center" }}>

                                                        <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold', textAlign: 'center', color: 'red' }}>{this.state.dataOfUser.Teamwork}({this.state.dataOfUser.TwUSer})</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                : (
                                                    null
                                                )
                                        }

                                        {/* item mobile number code */}
                                       
                                        {this.state.mts=='' || this.state.mts==null ?
                                                   this.props.navigation.navigate('Login')
                                                   :(
                                                    <View style={{ height: hp('4%'), width: wp('95%'), justifyContent: 'center', alignItems: 'center', }}>
                                                        <Text style={{ color: '#8c8e91', fontSize: RFPercentage(2.8) }}><ResponsiveImage source={require('../assest/Image/PhoneIcon.jpeg')} initWidth="30" initHeight="30" /> {this.state.dataOfUser.user_mobile}<ResponsiveImage source={require('../assest/Image/EditIcon.jpeg')} initWidth="20" initHeight="20" />
                                                        </Text>
                                                    </View>
                                                   )}
                                        {/* code for friends */}
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate('Friends')}
                                        >
                                            <View style={{
                                                height: hp('4%'), width: wp('95%'), justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                <Text style={{ color: '#8c8e91', fontSize: RFPercentage(2.8), }}> <ResponsiveImage source={require('../assest/Image/User-Friends.jpeg')} initWidth="40" initHeight="30" />
                                                    {this.state.dataOfUser.downlines}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* code of point icon and points */}

                                        {/* code for boxes */}

                                        <View style={{ height: hp('46%') }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', height: hp('11%'), width: wp('80%'), marginLeft: wp('10%') }}>
                                                {/* code for Total point */}
                                                <View style={styles.boxStyle2}>
                                                    <View >
                                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                                                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8), }}>
                                                                Total Points
                                                        </Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                            <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />

                                                            <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                {this.state.dataOfUser.total_points}
                                                            </Text>
                                                        </View>



                                                    </View>
                                                </View>
                                            </View>

                                            {/* code for second row of point */}
                                            <View style={{ flexDirection: "row", height: hp('11%') }}>
                                                {/* selfPoint code */}
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('SelfPoint')}
                                                >
                                                    <View style={styles.boxStyle}>
                                                        <View style={{ flexDirection: "column" }}>
                                                            <View style={{ justifyContent: "center", alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                    Self Points
                                                            </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: "center", alignItems: 'center' }}>
                                                                <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                    {this.state.dataOfUser.self_cms}
                                                                </Text>
                                                            </View>

                                                        </View>
                                                    </View>
                                                </TouchableOpacity>

                                                {/* Buddy point code */}
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('BuddyPoint')}
                                                >
                                                    <View style={styles.boxStyle1}>
                                                        <View style={{ flexDirection: "column" }}>
                                                            <View style={{ justifyContent: "center", alignItems: 'center' }} >
                                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                    Buddy Points
                                                         </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                    {this.state.dataOfUser.abc_cms}
                                                                </Text>
                                                            </View>



                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            {/* code for second row of point */}
                                            <View style={{ flexDirection: "row", height: hp('11%') }}>
                                                {/* offer point code */}
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('BonusPoint')}
                                                >
                                                    <View style={styles.boxStyle}>
                                                        <View style={{ flexDirection: "column" }}>
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                    Bonus Points
                                                            </Text>
                                                            </View>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                    {this.state.dataOfUser.cab_cms}
                                                                </Text>
                                                            </View>

                                                        </View>
                                                    </View>
                                                </TouchableOpacity>

                                                {/* Redeem point */}
                                                <TouchableOpacity
                                                    onPress={() => this.props.navigation.navigate('ReedemPoint')}
                                                >
                                                    <View style={styles.boxStyle1}>
                                                        <View style={{ flexDirection: "column" }}>
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                    Redeem Points
                                                            </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                    {this.state.dataOfUser.redeem_points}
                                                                </Text>
                                                            </View>


                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>

                                            {/* offer point code */}
                                            <View style={{ flexDirection: "row", height: hp('11%') }}>
                                                {/* offer point code */}
                                                {this.state.dataOfUser.offer_points != 0 || this.state.dataOfUser.offer_points != '' ?
                                                    <TouchableOpacity
                                                        onPress={() => this.props.navigation.navigate('OfferPoint')}
                                                    >
                                                        <View style={styles.boxStyle}>
                                                            <View style={{ flexDirection: "column" }}>
                                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                        Offer Points
                                                                </Text>
                                                                </View>

                                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                    <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                    <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                        {this.state.dataOfUser.offer_points}
                                                                    </Text>
                                                                </View>

                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                    : null}

                                                {/* Additional point */}
                                                {this.state.dataOfUser.additional_points != 0 || this.state.dataOfUser.additional_points != '' ?
                                                    <View style={styles.boxStyle1}>
                                                        <View style={{ flexDirection: "column" }}>
                                                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(2.8) }}>
                                                                    Additonal Points
                                                            </Text>
                                                            </View>
                                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                                <ResponsiveImage source={require('../assest/Image/b4e_coin.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100 }} />
                                                                <Text style={{ marginLeft: wp('3%'), color: 'white', fontSize: RFPercentage(3.3) }}>
                                                                    {this.state.dataOfUser.additional_points}
                                                                </Text>
                                                            </View>


                                                        </View>
                                                    </View>
                                                    : null}
                                            </View>
                                        </View>

                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}
//Styles CSS
const styles = StyleSheet.create({
    userCardStyle: {
        margin: hp('2%'),
        borderRadius: 15,
        alignSelf: "center",
        backgroundColor: "white",
        height: hp('90%'),
        shadowColor: "black",
        width: wp('96%'),
    },
    boxStyle: {
        width: wp('45%'),
        height: hp('10%'),
        backgroundColor: '#45CE30',
        borderRadius: wp('5%'),
        margin: wp('1.5%'),
        shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    boxStyle1: {
        width: wp('45%'),
        height: hp('10%'),
        backgroundColor: '#45CE30',
        borderRadius: wp('5%'),
        marginTop: hp('1%'),
        marginRight: wp('1.5%'),
        shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'

    },
    boxStyle2: {
        width: wp('60%'),
        height: hp('10%'),
        backgroundColor: '#45CE30',
        borderRadius: wp('5%'),
        marginTop: hp('1%'),

        shadowColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'

    },
    ModalButtonView: {
        flexDirection: 'row',
        padding: 10, marginBottom: hp('2%'),
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        borderRadius: 10
    },
    modalView: {
        flex: 1,
        position: 'absolute',
        bottom: 2,
        width: wp('95%'),
        backgroundColor: '#e6ffee',
        height: hp('25%'),
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',


    },
    inputText: {
        width: wp('80%'),
        height: hp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: RFPercentage(3)

    },
    modalView1: {
        flex: 1,
        position: 'absolute',
        bottom: 2,
        width: wp('95%'),
        backgroundColor: '#e6ffee',
        height: hp('20%'),
        borderRadius: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        elevation: 10,
    },
    contentWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});
