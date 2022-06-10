import React, { Component } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import PlaceHolderImage from 'react-native-placeholderimage';
export default class ViewItem extends Component {
  shouldComponentUpdate(prevProps) {
    if (prevProps.selectedId != null) {
      if (prevProps.selectedId == this.props.item.srid) {
        return true;
      }
      else {

        return false;
      }
    }
    else {
      return true;
    }


  }
  constructor(props) {
    super(props);
    this.state = {
      maxlimit: 40,
    }
  }
  render() {
    return (

      <View style={{ width: ('100%'), marginTop: hp('1%'), marginBottom: hp('1%') }}>
        <View style={styles.card}>
          <View style={{ height: hp('20%'), width: wp('30%'), justifyContent: 'center', alignItems: 'center', marginLeft: wp('2%'), }}>
          <TouchableWithoutFeedback
        onPress={this.props.navigationpage}
      >
              <PlaceHolderImage
                style={{ height: hp('10%'), width: wp('28%'), alignSelf: 'center', justifyContent: 'center' }}
                source={{ uri: `${this.props.item.image_path}` }}
                placeHolderURI={require('../assest/Image/AvtarImage.png')}
                placeHolderStyle={{ height: 100, width: 100 }}
                resizeMethod='resize'
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: hp('18%'), width: wp('61%'), marginTop: hp('0.8%'), marginLeft: wp('2%'), marginRight: wp('2%'), }}>
            <View>
              <TouchableOpacity
              onPress={this.props.navigationpage}
              >
                
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: wp('41%'), flexDirection: "row", height: hp('4%') }}>
                    {/* PRICE */}
                    <View style={{ width: 'auto', height: hp('3.5%'), alignItems: 'flex-start', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: RFPercentage(2.2), color: '#45CE30', fontWeight: "bold", }}>₹{this.props.item.rate}
                      </Text>
                    </View>
                    {/* MRP */}
                    {
                      this.props.item.mrp==this.props.item.rate
                      ?
                      null
                      :
                      <View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-end', marginLeft: wp('1%'), marginTop: hp('0.3%'), justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: RFPercentage(2), textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                        ₹{this.props.item.mrp}
                      </Text>
                    </View>
                    }
                  
                    </View>
                    {/* Discount */}
                    {
                      this.props.item.discount==0 || this.props.item.discount==''||this.props.item.discount==null
                      ?
                      null
                      :
                      <View style={{ width: wp('18%'), height: hp('3%'), alignItems: 'flex-end', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={{ fontSize: RFPercentage(1.6), color: '#fff', backgroundColor: '#45CE30', borderRadius: 40, paddingLeft: wp('1%'), paddingRight: wp('1%'), }}>
                        ₹{this.props.item.discount} OFF
            </Text>
                    </View>
                    }
                   
                 
                  </View>
                  {/* PRODUCT NAME Code */}
                  <View style={{ width: wp('60%'), height: hp('6%'), marginRight: wp('1.2%') }}>
                    <Text style={{ fontSize: RFPercentage(2), fontWeight: 'bold' }}>
                      {((this.props.item.product_name).length > this.state.maxlimit) ?
                        (((this.props.item.product_name).substring(0, this.state.maxlimit - 3)) + '...') :
                        this.props.item.product_name}
                    </Text>
                  </View>
                  {/* Product Size  Code*/}
                  <View style={{ width: wp('61%'), height: hp('3%'), alignItems: 'flex-start' }}>
                    <Text style={{ fontSize: RFPercentage(1.8) }}>
                      {this.props.item.size_display}
                    </Text>
                  </View>
              

              </TouchableOpacity>
            </View>
            {/* Add+ Code */}
            {this.props.item.available_quantity <= 0 ?
              <View style={{ alignItems: 'flex-end', marginRight: wp('3%') }}>
                <View style={{ width: wp('30%'), height: hp('5%'), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</Text>
                </View>
              </View>
              : (
                <View style={{ alignItems: 'flex-end', marginRight: wp('3%') }}>
                  {this.props.item.AddButton == true ?
                    <TouchableWithoutFeedback onPress={this.props.addbutton}>
                      <View style={{ width: wp('30%'), height: hp('5%'), alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF362E', borderRadius: 7 }}>

                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: RFPercentage(2) }}>ADD+</Text>

                      </View>
                    </TouchableWithoutFeedback>
                    : (
                      <View style={{ width: wp('30%'), height: hp('5%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {/* Minus Button */}
                        <TouchableWithoutFeedback onPress={this.props.MinusButton} >
                          <View style={{ backgroundColor: 'red', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopLeftRadius:7,borderBottomLeftRadius:7 }}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>-</Text>
                          </View>
                        </TouchableWithoutFeedback>
                        {/* Text Input Field */}
                        <View style={{ width: wp('10%'), borderWidth: 1, borderColor: 'red', height: hp('4.85%'), justifyContent: 'center', alignItems: 'center' }}>
                          <TextInput
                            style={{ textAlign: 'center', height: hp('5.5%') }}
                            value={this.props.item.AddedQty}
                            onChangeText={this.props.CartQuantityChange}
                            keyboardType='numeric'
                            placeholder="1"
                          />
                        </View>
                        {Number(this.props.item.AddedQty) >= Number(this.props.item.available_quantity) ?
                          <TouchableWithoutFeedback >
                            <View style={{ backgroundColor: 'grey', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7}}>

                              <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>+</Text>
                            </View>
                          </TouchableWithoutFeedback>
                          :

                          <TouchableWithoutFeedback onPress={this.props.addbutton}>
                            <View style={{ backgroundColor: 'red', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7 }}>

                              <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>+</Text>
                            </View>
                          </TouchableWithoutFeedback>
                        }
                      </View>
                    )
                  }
                </View>
              )}
          </View>
        </View>
      </View>
    );
  }
};
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
    height: hp('14%'),
    width: wp('28%'),
    justifyContent: 'center',
    alignItems: 'center'
  }
});