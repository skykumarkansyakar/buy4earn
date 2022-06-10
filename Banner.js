import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Image,
Dimensions,
LogBox
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedSplash from 'react-native-animated-splash-screen';
import Carousel from 'react-native-banner-carousel';
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = hp('80%');
export default class banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      images: []
    };

  }
componentDidMount = () => {
 this.BannerApi();
 LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    setTimeout(() => {
      this.setState({isLoaded: true});
    }, 1000);
  };
  BannerApi = async () => {
    await fetch('https://www.buy4earn.com/React_App/banner.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; ',
      },
      //Request Type
    })
      .then(response => response.json())
      //If response is in json then in success
      .then(responseJson => {
        this.setState({
          images: responseJson.banner,
        });
      })
    
  };
  gopage = () => {

    this.props.navigation.navigate('main');
  };

  // banner image code
  renderPage(image, index) {
    return (
      <View
        style={{
          width: wp('100%'),
          justifyContent: 'center',
          alignItems: 'center',
          height: hp('80%'),
        }}
        key={index}>
        <Image
          style={{width: wp('95%'), borderRadius: 10, height: BannerHeight}}
          source={{uri: image}}
        />
      </View>
    );
  }
  render() {
    return (
      
      <AnimatedSplash
        logoWidht={150}
        logoHeight={150}
        isLoaded={this.state.isLoaded}
        backgroundColor={"#fff"}
        logoImage={require("./assest/Image/Splash.png")}
      >
        <View>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" hidden={false} backgroundColor='transparent' />
          <View style={{ width: wp('90%'), height: hp('15%'), justifyContent: 'flex-end' }}>
          <TouchableWithoutFeedback onPress={() => this.gopage()}>
              <View>
                <Text style={{textAlign: 'right', color: '#808080'}}>Skip</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View>
            <TouchableWithoutFeedback>
            <Carousel
                autoplay
                autoplayTimeout={5000}
                loop
                index={0}
                pageSize={BannerWidth}>
                {this.state.images.map((image, index) =>
                  this.renderPage(image, index),
                )}
              </Carousel>
          </TouchableWithoutFeedback>
               </View>
        </View>
        <View>
        </View>
        <TouchableWithoutFeedback
          style={{
            width: wp('100%'),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'red',
            height: hp('5%'),
            borderRadius: 10,
            marginTop: hp('80%'),
          }}
          onPress={() => this.gopage()}>
          <View
            style={{
              width: wp('95%'),
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              backgroundColor: '#E21717',
              height: hp('5%'),
              borderRadius: 10,
              marginTop: hp('80%'),
              margin: wp('2%'),
            }}>
            <Text style={{color: '#fff', textAlign: 'center'}}>Lets Start</Text>
          </View>
        </TouchableWithoutFeedback>
        </View>
      </AnimatedSplash>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: wp('100%'),
    height: hp('100%'),
    alignItems: 'center',
  },
});