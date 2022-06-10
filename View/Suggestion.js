import React  from 'react';
import { Text, StyleSheet, FlatList, StatusBar, ToastAndroid, ActivityIndicator,TouchableOpacity,Vibration} from 'react-native';
import { Content, Container, Header, View } from 'native-base';
import { SafeAreaView } from 'react-navigation';
import ResponsiveImage from 'react-native-responsive-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFPercentage} from "react-native-responsive-fontsize";
import ViewItem from './ViewItem';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
export default class Recent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DATA:'',
      cart: [],
      selectedId:null,
      isLoading: true,
      maxlimit: 40,
      backbuttonpresse: 0,
      name: props.route.params.pagename,
    
    }
  }
  // auto call function page load
  componentDidMount = async () => {
    this.fetchData();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchData();
    });
  }

  // function again call 
  componentWillUnmount() {
    this._unsubscribe();
  }


  fetchData = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    fetch('https://www.buy4earn.com/React_App/HomeApi.php', {
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
          DATA: responseJson.HomeApi.Suggestion,
        })
        this.LoadCartData();
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

  LoadCartData = async () => {
    this.setState({ cart: JSON.parse(await AsyncStorage.getItem('cartdata')) });
    if (this.state.cart == null) {
      this.setState({ cart: [] });
    }

    let DATAArray = [ ...this.state.DATA ];
    for (var i in this.state.cart) {
      var index='';
       index = DATAArray.findIndex(element => element.srid == this.state.cart[i].srid);
       if(index!=-1){
        DATAArray[index].AddedQty=this.state.cart[i].AddedQty.toString();
        DATAArray[index].AddButton=false;
    
       }
    }
    this.setState({DATA:DATAArray});
  }

  // add button
  addbutton = (index, srid, AddedQty) => {
    let DATAArray = [ ...this.state.DATA ];
    AddedQty = Number(AddedQty) + 1;
    if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
      AddedQty = Number(DATAArray[index]['available_quantity']);
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
    this.setState({DATA:DATAArray});
  };
  //  Minus To Cart
  MinusButton = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty) - 1;
    let DATAArray = [ ...this.state.DATA ];
    if (AddedQty <= 0) {
      AddedQty=0;
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=true;
      this.removeItemFromCart(srid);
    }
    else {
      DATAArray[index].AddedQty=AddedQty.toString();
      DATAArray[index].AddButton=false;
      this.addItemToCart(srid, AddedQty);
    }
  }
  //  Cart qty change
  CartQuantityChange = (index, srid, AddedQty) => {
    AddedQty = Number(AddedQty);
    let DATAArray = [ ...this.state.DATA ];
    if (AddedQty <= 0) {
      AddedQty = 1;
      DATAArray[index].AddedQty='';
      this.addItemToCart(srid, AddedQty);
    }
    else {
      if (AddedQty >= Number(DATAArray[index]['available_quantity'])) {
        AddedQty = Number(DATAArray[index]['available_quantity']);
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }
      else {
        DATAArray[index].AddedQty=AddedQty.toString();
        this.addItemToCart(srid, AddedQty);
      }

    }
    this.setState({DATA:DATAArray});
  };

  // End of Cart System
  renderItem = ({ item,index}) =>(
    <ViewItem
    index={index}
    item={item}
    addbutton={() => {this.setState({selectedId:item.srid}); Vibration.vibrate(10); this.addbutton(index, item.srid, item.AddedQty);}}
    MinusButton={() => {this.setState({selectedId:item.srid}); Vibration.vibrate(10); this.MinusButton(index, item.srid, item.AddedQty);}}
    CartQuantityChange={(value) => {this.setState({selectedId:item.srid});this.CartQuantityChange(index, item.srid, value.replace(/[^0-9]/g, ''));}}
    navigationpage={()=>{this.props.navigation.navigate('Product',{itemid:item.srid,page:'page1'})}}
    selectedId={this.state.selectedId}
  />
  );

  render() {

    return (

      <Container>
      {/* Header Code */}
      <Header style={{ height: hp('8%'), width: wp('100%'), backgroundColor: '#45CE30', justifyContent: 'flex-start', alignItems: 'center' }}>
      <TouchableOpacity style={{flexDirection:'row'}}
            onPress={() => this.props.navigation.navigate('Home'

            )}
          >
        <View style={{ color: 'white', marginLeft: wp('1%'), }}>
          
            <ResponsiveImage source={require('../assest/Image/LeftArrow.jpeg')} initWidth="40" initHeight="40" resizeMethod='resize' />
       
        </View>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: RFPercentage(3), marginLeft: wp('2%') }}>{this.state.name}</Text>
        </TouchableOpacity>
      </Header>
      <Content>
        {/* <StatusBar style="auto" /> */}
        <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#45CE30" />
        {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('90%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (
          <SafeAreaView>
           
            <FlatList
          data={this.state.DATA}
          renderItem={this.renderItem}
          keyExtractor={item => item.srid}
          extraData={this.state.selectedId}
        />
         
          </SafeAreaView>
        )}

      </Content>

    </Container>
      
    );
  }
}
const styles = StyleSheet.create({
 

  ImageStyle: {
    height: hp('14%'),
    width: wp('28%'),
    justifyContent: 'center',
    alignItems: 'center'
  },
});



