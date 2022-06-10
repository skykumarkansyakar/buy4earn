import React from 'react';
import { View, Text, StyleSheet, StatusBar, ActivityIndicator, BackHandler,ToastAndroid } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-navigation';
import { FlatList, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Content, Container, Header } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import ResponsiveImage from 'react-native-responsive-image';
import SpeechToText from 'react-native-google-speech-to-text';
import PlaceHolderImage from 'react-native-placeholderimage';
import AsyncStorage from '@react-native-async-storage/async-storage';
console.disableYellowBox = true;

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      SearchData: '',
      search: '',
      masterDataSource: '',
      maxlimit:50,
      maxlimit1:18,   
    }
  }
  
  componentDidMount = async () => {
    this.SearchApi();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.SearchApi();
    });
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
  }
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress',this.backAction);
    this.props.navigation.navigate('Home');
     return true;
};
  toastWithDurationHandler = (message) => {
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  SearchApi = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    fetch('https://www.buy4earn.com/React_App/SearchForNew.php', {
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
        // SetSearchData(responseJson);
        this.setState({masterDataSource:responseJson});
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this.toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => this.setState({isLoading:false}));

  }
  // specch to search
  speechToTextHandler = async () => {

    let speechToTextData = null;
    try {
      speechToTextData = await SpeechToText.startSpeech('Try saying something', 'en_IN');
      this.handleSearch(speechToTextData);

    } catch (error) {
      console.log('error: ', error);
    }
  }
  handleSearch = async (text) => {
    this.setState({isLoading:true})
    if (text) {
      this.setState({ search: text })
      const newData = this.state.masterDataSource.filter(
        function (item) {
          const itemData = item.regular_search
            ? item.regular_search.toUpperCase() 
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({ SearchData: newData })
        this.setState({isLoading:false})
    } else {
      if (text == null || text == '') {
        var data = this.state.masterDataSource
        this.setState({ SearchData: [] })
        this.setState({isLoading:false})
      }
      this.setState({search:text})
    }
  }
  renderItem = ({ item }) => (
    <View style={{ width: ('100%'), justifyContent: 'center', alignItems: 'center', marginTop: hp('1%'), marginBottom: hp('1%') }}>
      {/* code of card */}
      <View style={styles.card}>
        {/* Code for image */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Product', {
            itemid: item.srid,
            page:'page1'
          })}
        >
          <View style={{ height: hp('11%'), width: wp('26%'), marginLeft: wp('2%'), justifyContent: 'center', alignItems: 'center' }}>

            <PlaceHolderImage
              style={{ height: hp('10%'), width: wp('26%'), alignSelf: 'center', justifyContent: 'center' }}
              source={{ uri: `https://www.buy4earn.com/Uploads/${item.image}` }}
              placeHolderURI={require('../assest/Image/AvtarImage.png')}
              placeHolderStyle={{ height: 60, width: 60 }}
            />
          </View>
        </TouchableOpacity>

        <View style={{ height: hp('13%'), width: wp('64%'), marginLeft: wp('2%'), marginRight: wp('2%'), flexDirection: 'column', }}>
          <View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Product', {
                itemid: item.srid,
                page:'page1'
              })}
            >
              <View style={{ flexDirection: 'row' }} >
                {/* PRICE */}
                <View style={{ width: wp('44%'), flexDirection: "row", justifyContent: 'flex-start', height: hp('3.5%'), }}>
                  <View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-start', justifyContent: 'flex-start', justifyContent: 'center' }}>
                    <Text style={{ fontSize: RFPercentage(2.8), color: '#45CE30', fontWeight: "bold", }}> ₹{item.rate}
                    </Text>
                  </View>
                  {/* MRP */}
                  {
                   item.mrp==item.rate
                   ?
                   null
                   :
<View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-end', marginLeft: wp('1%'), marginTop: hp('0.5%') }}>
                    <Text style={{ fontSize: RFPercentage(2), textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                      ₹{item.mrp}
                    </Text>
                  </View>
                  }
                  
                </View>


                {/* OFF */}
{
  item.discount==0 || item.discount==''|| item.discount ==null?
  null:
<View style={{ width: wp('19%'), height: hp('3.5%'), justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: RFPercentage(2), color: '#fff', backgroundColor: '#45CE30', borderRadius: 5, paddingLeft: wp('1%'), paddingRight: wp('1%'), height: hp('2.5%'), textAlign: 'center' }}>
                    ₹{item.discount} OFF
              </Text>
                </View>
}
                


              </View>


              {/* PRODUCT NAME Code */}
              <View style={{ width: wp('63%'), height: hp('5%'), }}>
                <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold' }}>
                  {item.product_brand}{" "}
                {((item.product_name).length > this.state.maxlimit) ?
            (((item.product_name).substring(0,this.state.maxlimit - 3)) + '...') :
            item.product_name}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ width: wp('64%'), flexDirection: 'row', height: hp('4.5%') }}>
            {/* Product Size  Code*/}
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Product', {
                itemid: item.srid,
                page:'page1'
              })}
            >
              <View style={{ width: wp('40%'), height: hp('3%'), alignItems: 'flex-start'}}>
                <Text style={{ fontSize: RFPercentage(2) }}>
                  
                  {((item.size_display).length > this.state.maxlimit1) ?
            (((item.size_display).substring(0,this.state.maxlimit1 - 3)) + '...') :
            item.size_display}
                </Text>
              </View>
            </TouchableOpacity>
            {
              item.available_quantity<=0 || item.available_quantity=='' || item.available_quantity==null?
              
              <View style={{width:wp('23%'),justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'red', fontSize:RFPercentage(1.5),fontWeight:'bold'}}>
              OUT OF STOCK
              </Text>
            </View>
            :
            null
            }
            
                 

          </View>


        </View>
      </View>
    </View>

  );

render(){
  return (
    <Container>
      {/* header code  */}
      <Header style={{ height: hp('10%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center', }}>
        {/* search bar */}
        <View style={{ width: wp('85%'), flexDirection: 'row' }}>
          <Searchbar
            placeholder="Search"
            onChangeText={(text) => this.handleSearch(text)}
            value={this.state.search}
          />
          <TouchableOpacity onPress={() => this.speechToTextHandler()}>
            <View style={{ marginTop: hp('1%') }}>
              <ResponsiveImage source={require('../assest/Image/mic1.png')} initWidth="30" initHeight="30" style={{ marginLeft: wp('2%') }} />

            </View>
          </TouchableOpacity>
        </View>
      </Header>
      <Content>
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
        {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('75%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (
          <SafeAreaView>
            {/* flat list data of search bar */}
            <ScrollView>
            {this.state.SearchData.length == 0 ?
             <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', height: hp('75%'), width: 'auto', }}>
             <ResponsiveImage source={require('../assest/Image/searchname.jpeg')} initWidth="300" initHeight="300" />
           </View>
           : (
              <FlatList
                data={this.state.SearchData}
                renderItem={this.renderItem}
                keyExtractor={item => item.srid}
              />
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </Content>

    </Container>

  );
}
  
};
const styles = StyleSheet.create({
  // card style of flatlist item
  card: {
    height: hp('14%'),
    width: wp('95%'),
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

  },
  // image style of card item
  ImageStyle: {
    height: hp('10%'),
    width: wp('26%')
  }



});