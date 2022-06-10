import React, { Component } from "react";
import { Container } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';

export default class Voucher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: '',
      isLoading: true,
      textInputData: '',
      Voucher: '',
      id: ''
    }

  }

  fetchofferdata = async () => {
    this.setState({ isLoading: true })
    var mtsLogin = await AsyncStorage.getItem('mts');
    this.setState({ id: mtsLogin })
  }

  componentDidMount = async () => {
    this.fetchofferdata();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {

    });
  }
  // function again call 
  componentWillUnmount() {
    this._unsubscribe();
  }


  render() {
    const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
    return (
      <Container>
        
          
            <WebView
              injectedJavaScript={INJECTEDJAVASCRIPT}
              scalesPageToFit={true}
              source={{ uri: `https://www.buy4earn.com/React_App/Vouchers.php?mts=${this.state.id}` }}
              scrollEnabled={true}/>
          
       
      </Container>
    )
  }
}
