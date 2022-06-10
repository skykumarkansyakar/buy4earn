// Importing Libraries
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, ToastAndroid, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ResponsiveImage from 'react-native-responsive-image';
import { RFPercentage } from "react-native-responsive-fontsize";
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
//   Rendering Format


export default class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      FriendsData: '',
      search: '',
      masterDataSource: '',
      newdata1: '',
      maxlimit:60,
     
    }
  }

  componentDidMount = async () => {
    this.GetFriendsData();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.GetFriendsData();
    });
  }
  componentWillUnmount() {
    this._unsubscribe();
  }

  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }

  GetFriendsData = async () => {
    this.setState({ isLoading: true })
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);

       console.log(mtsLogin);
    fetch('https://www.buy4earn.com/React_App/Friends.php', {
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
          FriendsData: responseJson.downline,
          masterDataSource: responseJson.downline,
        })
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => this.setState({ isLoading: false }));

  }


  handleSearch = (text) => {

    if (text) {
      // Inserted text is not blank
      // Filter the FriendsData
      // Update FilteredDataSource
      const newData = this.state.masterDataSource.filter(
        function (item) {
          const itemData = item.name + item.mobile
            ? item.name.toUpperCase() + item.mobile
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      this.setState({ FriendsData: newData, search: text })
    } else {
      this.setState({ search: text })
      if (text == null || text == '') {
        var data = this.state.masterDataSource
        this.setState({ FriendsData: data })
      }
    }
  }
  render_User_Friends = ({ item }) => (

    <View style={styles.userCardStyle}>
      <View style={{ width: wp('30%'), justifyContent: 'center', alignItems: 'center', }}>
        {item.profile == null
          ?
          <ResponsiveImage source={require('../assest/Image/man.jpeg')} initWidth="80" initHeight="80" style={{ borderRadius: 90 }} />
          :
          
          <ResponsiveImage source={{ uri: item.profile }} initWidth="80" initHeight="80" style={{ borderRadius: 90 }} />}

      </View>
      <View style={{ width: wp('65%'), flexDirection: 'column' }}>

        <View style={{ height: hp('7%') }}>
          <Text style={{ marginLeft: wp('2%'), marginTop: hp('1%'), fontWeight: 'bold', fontSize: RFPercentage(2) ,
 color:
 item.grade === "(A)"||item.grade==='(B)'
   ? "red"
   : "black",
        }}>
          {((item.name).length > this.state.maxlimit) ?
                    (((item.name).substring(0, this.state.maxlimit - 3)) + '...') :
                    item.name} {item.grade}
                    
          </Text>
        </View>
        <View style={{ height: hp('6%') }}>
          <Text style={{ marginLeft: wp('2%'), color: '#8c8e91', fontSize: RFPercentage(2) }}><ResponsiveImage source={require('../assest/Image/PhoneIcon.jpeg')} initWidth="25" initHeight="25" /> {item.mobile}</Text>
        </View>
      </View>
    </View>

  );
  render() {
    return (
      //Return of Flatlist
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ width: wp('100%'), height: hp('70%'), justifyContent: 'center', alignItems: 'center' }} /> : (
          <View style={{ marginBottom: hp('8%') }}>
            <View style={styles.SearchStyle}>
              <Searchbar
                placeholder="Search"
                onChangeText={(text) => this.handleSearch(text)}
                value={this.state.search}
              />
            </View>

            {this.state.FriendsData.length == 0 ?
              <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: hp('75%'), width: 'auto', }}>
                <ResponsiveImage source={require('../assest/Image/nodatafound.jpeg')} initWidth="400" initHeight="400" />
              </View>
              : (
                <FlatList
                  data={this.state.FriendsData}
                  renderItem={this.render_User_Friends}
                  keyExtractor={item => item.mts_id}

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
    margin: 5,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: "white",
    height: hp('13%'),
    shadowColor: "black",
    width: wp('95%'),
    flexDirection: 'row'
  },
  SearchStyle: {
    margin: 5,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "black",
    width: wp('95%'),

  }
});
