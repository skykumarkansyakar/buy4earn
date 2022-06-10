import React, { Component } from 'react';
import { Text, StyleSheet, StatusBar, ActivityIndicator, ToastAndroid, Vibration, BackHandler } from 'react-native';
import {  Container, Header, View } from 'native-base';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import ResponsiveImage from 'react-native-responsive-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Item from './Item';
import { Searchbar } from 'react-native-paper';
import SpeechToText from 'react-native-google-speech-to-text';
export default class SubProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DATA: '',
      cart: [],
      selectedId: null,
      isLoading: true,
      Sub_Category_name: null,
      masterDataSource: '',
      pagename:'',
      cartData:''
    }
  };


  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    this.fetchData(this.props.route.params.SubCategoryName,this.props.route.params.pagename);
  
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData(this.props.route.params.SubCategoryName,this.props.route.params.pagename);
    });
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this._unsubscribe();
  }
  // function call when open page
  backAction = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
    this.props.navigation.navigate('Category');
    return true;
  };

  fetchData = async (recivename,page) => {
    this.setState({
      Sub_Category_name: this.props.route.params.SubCategoryName,
      pagename:this.props.route.params.pagename
    });
    var dataToSend = new FormData();
    dataToSend.append('sub_category', recivename);
    this.setState({ isLoading: true })
    fetch('https://www.buy4earn.com/React_App/sub_category_search.php', {
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
        this.LoadCartData(responseJson.Products);
        this.setState({ masterDataSource: responseJson.Products })
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
  navigationpage=()=>{
if(this.state.pagename=='Home')
{
  this.props.navigation.navigate('main');
}
else{
  this.props.navigation.navigate('Category');
}
  }
  toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
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
  // Start Of Cart System
  // add cart data fucntion

  addItemToCart = (srid, AddedQty) => {
    for (var i in this.state.cart) {
      if (this.state.cart[i].srid === srid) {
        this.state.cart[i].AddedQty = AddedQty;
        this.SaveCartData();
        return;
      }
    };
    var itemsNew = {
      srid: srid,
      AddedQty: AddedQty
    };
    this.state.cart.push(itemsNew);
    this.SaveCartData();
  };
  // Remove Item From Cart
  removeItemFromCart = (srid) => {
    for (var i in this.state.cart) {
      if (this.state.cart[i].srid === srid) {
        this.state.cart.splice(i, 1);
        break;
      }
    }
    this.SaveCartData();
  };
  // SaveCart Data function
  SaveCartData = async () => {
    await AsyncStorage.setItem('cartdata', JSON.stringify(this.state.cart));
  };
  // loadcart data function
  LoadCartData = async (dataProducts) => {

    this.setState({ cart: JSON.parse(await AsyncStorage.getItem('cartdata')) });
    if (this.state.cart == null) {
      this.setState({ cart: [] });
    }
    let DATAArray = [...dataProducts];
    for (var i in this.state.cart) {
      var index = '';
      index = DATAArray.findIndex(element => element.srid == this.state.cart[i].srid);
      if (index != -1) {
        DATAArray[index].AddedQty = this.state.cart[i].AddedQty.toString();
        DATAArray[index].AddButton = false;

      }
    }
    this.setState({ DATA: DATAArray });
    this.setState({ selectedId: null });
  }


  // add button
  addbutton = (index, srid, AddedQty) => {
    let DATAArray = [...this.state.DATA];
    AddedQty = Number(AddedQty) + 1;
    if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
      AddedQty = Number(DATAArray[index]['available_quantity']);
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    else {
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({ DATA: DATAArray });
  };
  //  Minus To Cart
  MinusButton = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty) - 1;
    let DATAArray = [...this.state.DATA];
    if (AddedQty <= 0) {
      AddedQty = 0;
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = true;
      this.removeItemFromCart(srid);
    }
    else {
      DATAArray[index].AddedQty = AddedQty.toString();
      DATAArray[index].AddButton = false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({ DATA: DATAArray });
  }
  //  Cart qty change
  CartQuantityChange = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty);
    let DATAArray = [...this.state.DATA];
    if (AddedQty <= 0) {
      AddedQty = 1;
      DATAArray[index].AddedQty = '';
      this.addItemToCart(srid, AddedQty);
    }
    else {
      if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
        AddedQty = Number(DATAArray[index]['available_quantity']);
        DATAArray[index].AddedQty = AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }
      else {
        DATAArray[index].AddedQty = AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }

    }
    this.setState({ DATA: DATAArray });
  };
  // End of cart System
  handleSearch = (text) => {

    if (text) {
      // Inserted text is not blank
      // Filter the FriendsData
      // Update FilteredDataSource
      const newData = this.state.masterDataSource.filter(
        function (item) {
          const itemData = item.product_name
            ? item.product_name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
     
      this.setState({ DATA: newData, search: text })
    } else {
      this.setState({ search: text })
      if (text == null || text == '') {
        var data = this.state.masterDataSource
        this.setState({ DATA: data })

      }
    }
  }
  renderItem = ({ index, item }) => (
    <Item
      index={index}
      item={item}
      addbutton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.addbutton(index, item.srid, item.AddedQty); }}
      MinusButton={() => { this.setState({ selectedId: item.srid }); Vibration.vibrate(10); this.MinusButton(index, item.srid, item.AddedQty); }}
      CartQuantityChange={(value) => { this.setState({ selectedId: item.srid }); this.CartQuantityChange(index, item.srid, value.replace(/[^0-9]/g, '')); }}
      navigationpage={() => { this.props.navigation.navigate('Product', { itemid: item.srid,page:'page1' }) }}
      selectedId={this.state.selectedId}
    />
  );

  render() {
    return (
      <Container>
        {/* Header Code */}
        <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
        <View style={{width:wp('90%'),flexDirection:'row'}}>
          <TouchableOpacity style={{ flexDirection: 'row',width:wp('70%') }}
            onPress={() => this.navigationpage()}
          >
            <View style={{ color: 'white', marginLeft: wp('1%'), }}>

              <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" />

            </View>
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3), marginLeft: wp('2%') }}>{this.state.Sub_Category_name}</Text>
          </TouchableOpacity>
          
          
            </View>
        </Header>

        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
        {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('80%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (
          <SafeAreaView>
            <View style={{ marginBottom: hp('23%') }}>
              <View style={{flexDirection:'row',width:wp('100%')}}>
              <View style={styles.SearchStyle}>
                <Searchbar
                  placeholder="Search Products.."
                  onChangeText={(text) => this.handleSearch(text)}
                  value={this.state.search}
                />
                
              </View>
              <TouchableOpacity  onPress={() => this.speechToTextHandler()}>
            <View style={{width:wp('13%'),justifyContent:'center',alignItems:'center',height:hp('8%')}}>
              <ResponsiveImage source={require('../assest/Image/mic.jpeg')} initWidth="30" initHeight="30" />

            </View>
          </TouchableOpacity>
              </View>
              <FlatList
                data={this.state.DATA}
                renderItem={this.renderItem}
                keyExtractor={item => item.srid}
              />

            </View>

          </SafeAreaView>

        )}


      </Container>
    )
  }
}
const styles = StyleSheet.create({
  card: {
    height: hp('20%'),
    width: wp('95%'),
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#FFF',

    flexDirection: 'row'
  },
  ImageStyle: {
    height: hp('18%'),
    width: wp('28%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
  SearchStyle: {
    margin: 5,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: "white",
    shadowColor: "black",
    width: wp('85%'),
   
  },
  badgeStyle: {
    position: 'absolute',
    marginLeft:wp('4%'),
  
  },
});
