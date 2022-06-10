import React, { Component } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import PlaceHolderImage from 'react-native-placeholderimage';
import ResponsiveImage from 'react-native-responsive-image';
export default class CartItem extends Component {

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
      maxlimit: 30,
      maxlimit1:30
    }
  };
  render() {
    return (
      <View>
{this.props.item.AddButton==false && this.props.item.available_quantity >=1 ? 
      <View style={{ width: ('100%'), marginTop: hp('1%'), marginBottom: hp('1%') }}>
        <View style={styles.card}>
  
          <View style={{ height: hp('13%'), width: wp('27%'), justifyContent: 'center', alignItems: 'center' }}>
          <PlaceHolderImage
            style={styles.ImageStyle}
            source={{ uri: `${this.props.item.image_path}` }}
            placeHolderURI={require('../assest/Image/AvtarImage.png')}
            placeHolderStyle={{ height: 80, width: 80 }}
            resizeMethod='resize'
          />

        </View>
   
            <View style={{ height: hp('16%'), width: wp('63%'), marginLeft: wp('2%'), marginRight: wp('2%'), flexDirection: 'column', }}>
          <View style={{ flexDirection: 'row', }} >
            {/* PRICE */}

            <View style={{ width: wp('35%'), flexDirection: "row", height: hp('3.2%') }}>
              <View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ fontSize: RFPercentage(2.5), color: '#45CE30', fontWeight: "bold", }}>₹{this.props.item.rate}
                </Text>
              </View>
              {/* MRP */}
              {
                this.props.item.mrp==this.props.item.rate
                ?
                null:
                <View style={{ width: 'auto', height: hp('3%'), alignItems: 'flex-end', marginLeft: wp('1%'), justifyContent: 'center' }}>
                <Text style={{ fontSize: RFPercentage(1.8), textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                  ₹{this.props.item.mrp}
                </Text>
              </View>
              }
             
            </View>

            {/* OFF */}

            <View style={{ width: wp('20%'), height: hp('3%'), }}>
              {
                this.props.item.discount==null || this.props.item.discount=='' || this.props.item.discount==0?
null
:
<View style={{ justifyContent: 'center', alignItems: 'center', }}>
<Text style={{ fontSize: RFPercentage(1.8), color: '#fff', backgroundColor: '#45CE30', borderRadius: 8, paddingLeft: wp('1%'), paddingRight: wp('1%'), height: hp('2.5%'), textAlign: 'center' }}>
  ₹{this.props.item.discount} OFF
</Text>
</View>
              }
             
            </View>
            {/* delete Cart Data */}
            <TouchableOpacity onPress={this.props.deletehandler}>
              <ResponsiveImage source={require('../assest/Image/DeleteIcon.jpeg')} initWidth="30" initHeight="30" style={{ borderRadius: 100, }} />
            </TouchableOpacity>
          </View>

          {/* PRODUCT NAME */}

          <View style={{ width: wp('63%'), height: hp('5%'), }}>
            <Text style={{ fontSize: RFPercentage(1.8), fontWeight: 'bold' }}>
        
              {((this.props.item.product_name).length > this.state.maxlimit) ?
            (((this.props.item.product_name).substring(0, this.state.maxlimit - 3)) + '...') :
            this.props.item.product_name}
            </Text>
          </View>
          {/* Product Size */}
          <View style={{ width: wp('63%'), height: hp('3%'), alignItems: 'flex-start', }}>
            <Text style={{ fontSize: RFPercentage(1.8) }}>
              {((this.props.item.size_display).length > this.state.maxlimit1) ?
            (((this.props.item.size_display).substring(0, this.state.maxlimit1 - 3)) + '...') :
            this.props.item.size_display}
            </Text>
          </View>
            {/* Add+ Code */}
            {this.props.item.available_quantity <= 0 ?
              <View style={{ alignItems: 'flex-end', marginRight: wp('3%') }}>
                <View style={{ width: wp('30%'), height: hp('5%'), alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</Text>
                </View>
              </View>
              : (
                <View style={{ alignItems: 'flex-end', marginRight: wp('1%'), height: hp('5%') }}>
          
                      <View style={{ width: wp('30%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center',  height: hp('5%')}}>
                        {/* Minus Button */}
                        <TouchableWithoutFeedback onPress={this.props.MinusButton} >
                          <View style={{ backgroundColor: 'red', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopLeftRadius:7,borderBottomLeftRadius:7 }}>
                            <Text style={{ fontSize: RFPercentage(2.5), color: '#fff', textAlign: 'center' }}>-</Text>
                          </View>
                        </TouchableWithoutFeedback>
                        {/* Text Input Field */}
                        <View style={{ width: wp('10%'), borderWidth: 1, borderColor: 'red', height: hp('4.85%'), justifyContent: 'center', alignItems: 'center' }}>
                          <TextInput
                            style={{ textAlign: 'center', height: hp('5%') }}
                            value={this.props.item.AddedQty}
                            onChangeText={this.props.CartQuantityChange}
                            keyboardType='numeric'
                            placeholder="1"
                            
                          />
                        </View>
                        {Number(this.props.item.AddedQty) >= Number(this.props.item.available_quantity) ?
                          <TouchableWithoutFeedback >
                            <View style={{ backgroundColor: 'grey', width: wp('10%'), justifyContent: 'center', alignItems: 'center', height: hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7 }}>

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
                 
                </View>
              )}
          </View>
        </View>
      </View>
      :(
        null
      )
  }
      </View>
    );
  }
};
const styles = StyleSheet.create({
  card: {
    height: hp('18%'),
    width: wp('95%'),
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  marginLeft:wp('2.5%'),
  marginRight:wp('2.5%')
  },
  ImageStyle: {
    height: hp('10%'),
    width: wp('27%')
  },
  container: {
    flex: 1
  },
});