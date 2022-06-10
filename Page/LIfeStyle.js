import React, { Component } from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage } from "react-native-responsive-fontsize";
import PlaceHolderImage from 'react-native-placeholderimage';

export default class LIfeStyle extends Component {

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

      <View style={styles.card}>

      {/* code of rate off */}
      <TouchableWithoutFeedback
        onPress={ this.props.navigationpage}
      >
        <View style={{ width: wp('47%'), height: hp('2%'), justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: hp('0.5%')}}>
        {this.props.item.discount==0 ||this.props.item.discount==null || this.props.item.discount==''
?
null:
          <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: wp('2%'), borderRadius: 20, }}>
            <Text style={{ color: 'white', fontSize: RFPercentage(1.5), backgroundColor: '#45CE30', borderRadius: 40, paddingLeft: wp('1.8%'), paddingRight: wp('1.8%') }}>
              ₹{this.props.item.discount} OFF
         </Text>
          </View>
  }
        </View>
    
        {/* code of image icons */}
        <View style={{ width: wp('47%'), justifyContent: 'center', alignItems: 'center', height: hp('14.5%')  }}>
          <PlaceHolderImage
            style={{ height:hp('10%'), width:wp('28%'), alignSelf: 'center', justifyContent: 'center', }}
            source={{ uri: `${this.props.item.image_path}` }}
            placeHolderURI={require('../assest/Image/AvtarImage.png')}
            placeHolderStyle={{ height: 70, width: 70 }}
          />
        </View>
    
        {/* code of rate */}
        <View style={{ flexDirection: 'row', height: hp('3%'), alignItems: 'center',}}>
          <View style={{ backgroundColor: 'white', paddingLeft: wp('0.5%'), paddingRight: ('1%'),height: hp('2.5%'),alignItems:'center' }}>
            <Text style={{ fontSize: RFPercentage(2), color: '#45CE30', fontWeight: "bold",textAlign:'center' }}> ₹{this.props.item.rate}</Text>
          </View>
    
          {/* code of mrp */}
          {
            this.props.item.rate==this.props.item.mrp
            ?
            null
            :
          <View style={{ justifyContent: 'center', marginLeft: wp('1%') }}>
            <Text style={{
              fontSize: RFPercentage(1.6), color: 'black', textDecorationLine: 'line-through',
              textDecorationStyle: 'solid'
            }}> ₹{this.props.item.mrp}</Text>
          </View>
  }
        </View>
    
        {/* code for productname */}
        <View style={{ flexDirection: 'column', paddingLeft: wp('1%'), paddingRight: wp('1%'), height: hp('4%') }}>
          <Text style={{ fontWeight: 'bold', fontSize: RFPercentage(1.5), }} >{((this.props.item.product_name).length > this.state.maxlimit) ?
            (((this.props.item.product_name).substring(0, this.state.maxlimit - 3)) + '...') :
            this.props.item.product_name}</Text>
        </View>
    
        {/* code for product size */}
        <View style={{ flexDirection: 'column', height: hp('2%'), paddingLeft: wp('1%'), paddingRight: wp('1%'), }}>
          <Text style={{ fontSize: RFPercentage(1.5), }}>{this.props.item.size_display}</Text>
        </View>
      </TouchableWithoutFeedback>
      {/* add cart button */}
    
      {this.props.item.available_quantity <=0 ?
        <View style={{ alignItems: 'flex-end', marginTop: hp('0.5%'),width: wp('45%')  }}>
          <View style={{ width: wp('40%'), height: hp('4%'), alignItems:'flex-end', justifyContent: 'center', }}>
            <Text style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</Text>
          </View>
        </View>
        : (
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: hp('0.5%') }}>
            {this.props.item.AddButton==true ?
              <TouchableWithoutFeedback onPress={this.props.addbutton}>
                <View style={{
                  backgroundColor: 'red',
                  width: wp('46%'),
                  borderRadius: 10,
                  height: hp('5%'),
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: RFPercentage(2) }}> ADD +</Text>
    
                </View>
              </TouchableWithoutFeedback>
              :
              (
               <View style={{ width: wp('46%'), height: hp('5%'), flexDirection: 'row', justifyContent: 'center', alignItems: 'center',borderRadius:2}}>
                {/* Minus Button */}
                <TouchableWithoutFeedback onPress={this.props.MinusButton} >
                <View style={{backgroundColor:'red',width:wp('12%'),justifyContent:'center',alignItems:'center',height:hp('5%'),borderTopLeftRadius:7,borderBottomLeftRadius:7}}>
              <Text style={{fontSize:RFPercentage(2.5),color:'#fff',textAlign:'center'}}>-</Text>
              </View>
              </TouchableWithoutFeedback>
                 {/* Text Input Field */}
            <View style={{width:wp('22%'),borderWidth:1,borderColor:'red',height:hp('4.85%'),justifyContent:'center',alignItems:'center'}}>
             <TextInput 
          style={{textAlign:'center',height:hp('5.5%'),width:wp('22%')}}
          value={this.props.item.AddedQty}
          onChangeText={this.props.CartQuantityChange}
          keyboardType = 'numeric'
           placeholder="1"
      />
      </View>
    {Number(this.props.item.AddedQty)>=Number(this.props.item.available_quantity)?
              <TouchableWithoutFeedback>
              <View style={{backgroundColor:'grey',width:wp('12%'),justifyContent:'center',alignItems:'center',height:hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7}}>
    
              <Text style={{fontSize:RFPercentage(2.5),color:'#fff',textAlign:'center'}}>+</Text>
              </View>
              </TouchableWithoutFeedback>
              :
              
              <TouchableWithoutFeedback onPress={this.props.addbutton}>
              <View style={{backgroundColor:'red',width:wp('12%'),justifyContent:'center',alignItems:'center',height:hp('5%'),borderTopRightRadius:7,borderBottomRightRadius:7}}>
    
              <Text style={{fontSize:RFPercentage(2.5),color:'#fff',textAlign:'center'}}>+</Text>
              </View>
              </TouchableWithoutFeedback>
    }
                </View>
              )
            }
          </View>
        )
      }
    </View>
    );
  }
};
const styles = StyleSheet.create({
  //code of All Trending,suggestion and recent card
  card: {
    backgroundColor: '#fefefe',
    height: hp('32%'),
    width: wp('47%'),
    borderRadius: 10,
    elevation: 2,
    margin: wp('1.5%'),
  },
})