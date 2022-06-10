import React, { Component } from 'react';
import { Text, StyleSheet, ActivityIndicator, } from 'react-native';
import { Container, View } from 'native-base';
import { FlatList, TouchableOpacity, } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaceHolderImage from 'react-native-placeholderimage';

export default class DisposableItems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Item_Data: '',
      isLoading: true,
    }
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false; 
  }
  componentDidMount = () => {
    this.fetchData();

  }
  _toastWithDurationHandler = (message) => {
    //function to make Toast With Duration
    ToastAndroid.show(`${message}`, ToastAndroid.SHORT);
  }
  fetchData = async () => {
    var mtsLogin = await AsyncStorage.getItem('mts');
    var category = 'Disposable items'
    var dataToSend = new FormData();
    dataToSend.append('mts', mtsLogin);
    dataToSend.append('category', category);
    fetch('https://www.buy4earn.com/React_App/sub_category.php', {
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
          Item_Data: responseJson.sub_category,
        })
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error 
        this._toastWithDurationHandler('Please Try Again !');
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }

  render() {
    return (
      <Container>
        <SafeAreaView>

          {this.state.isLoading ? <ActivityIndicator color="green" size={wp('10%')} style={{ height: hp('75%'), width: wp('100%'), justifyContent: 'center', alignItems: 'center', }} /> : (

            
              <View style={{ height: 'auto', }}>

                <FlatList
                  data={this.state.Item_Data}
                  renderItem={({ item }) => (

                    <View style={{ flexDirection: 'column', margin: hp('1%'), width: wp('30%'), }}>

                      <View style={styles.card1}>
                        <TouchableOpacity
                          onPress={() => {
                            this.props.navigation.navigate('SubProduct', {
                              SubCategoryName: item.sub_category_name
                            });
                          }}
                        >
                          <View style={{ margin: hp('1%'), margin: wp('1%'), justifyContent: 'center', alignItems: 'center', width: wp('27%') }}>

                            <PlaceHolderImage
                              style={{ height: hp('10%'), width: wp('22%'), alignItems: 'center', justifyContent: 'center', }}
                              source={{ uri: `${item.image}` }}
                              placeHolderURI={require('../assest/Image/AvtarImage.png')}
                              placeHolderStyle={{ height: 90, width: 90 }}
                              resizeMethod='resize'
                            />
                          </View>
                          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(2), textAlign: 'center' }}>{item.sub_category_name}</Text>
                          </View>
                          <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: hp('1%') }}>
                            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: RFPercentage(1.5) }}>{item.discount}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                    </View>
                  )
                  }
                  //Setting the number of column
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
       
          )}
        </SafeAreaView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height: 'auto',
    width: 'auto',
    marginLeft: wp('2.5%'),
    marginRight: wp('2.5%'),
    elevation: 10,
    borderRadius: 10,
    backgroundColor: '#45CE30',
    flexDirection: 'row'
  },
  card1: {
    borderRadius:8,
    elevation: 10,
    backgroundColor: "white",
    height: 'auto',
    shadowColor: "black",
    width: wp('28%'),
    justifyContent: 'center',
    alignItems: 'center'
  }
});
