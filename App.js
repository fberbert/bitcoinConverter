import React, { Component } from 'react'
import { StyleSheet, View, YellowBox, Alert, 
  TouchableHighlight, ImageBackground, Switch } from 'react-native'
import {
  Container, Header, Title, Content, Body, Text, Button, Left, Right, 
  Form, Input, Item 
} from 'native-base'
import IconB from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/MaterialCommunityIcons'
import 'intl'
import 'intl/locale-data/jsonp/pt-BR'
import 'intl/locale-data/jsonp/en'
import AsyncStorage from '@react-native-community/async-storage'
// import getTheme from './native-base-theme/components'
import i18n from './src/i18n'
import { NativeModules, Platform } from 'react-native'
// import { limpar } from './src/functions'
import SplashScreen from './src/SplashScreen'
import SobreScreen from './src/SobreScreen'

YellowBox.ignoreWarnings(['Require cycle', 'state update', 'during an existing']);

const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;

//definir locale / translation
// console.log("linguagem: " + deviceLanguage); 
// console.log('t: ' + Object.keys(i18n.translations));

if (Object.keys(i18n.translations).includes(deviceLanguage)) {
  i18n.defaultLocale = deviceLanguage;
  i18n.locale = deviceLanguage;
} // else default i18n.js applies
// console.log('i18n: ' + i18n.locale);

const styles = StyleSheet.create({
  myContent: {
    // backgroundColor: '#f00',
  },
  display: {
    padding: 10,
    paddingBottom: 20,
    backgroundColor: '#444',
    opacity: 0.7,
    alignItems: 'center'
  },
  myForm: {
    padding: 10,
    margin: 10,
    backgroundColor: '#000',
    borderRadius: 20,
    opacity: 0.65,
  },

  displayText: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 20,
  },
  linha: {
    flexDirection: 'row'
  },
  bitcao: {
    justifyContent: 'center',
    padding: 10,
  },
  bitcaoText: {
    fontSize: 50,
    color: '#fff',
  },
  branco: {
    color: '#fff',
  },
  preto: {
    color: '#000',
  },
  verde: {
    color: '#0f0',
  },
  vermelho: {
    color: '#f00',
  },
  cinza: {
    color: '#444',
  },
  viewCalcular: {
    flexDirection: 'row',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  butCalcular: {
    width: '45%',
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: '#999'
  },
  myHeader: {
    backgroundColor: '#111',
  },
  myHeaderBody: {
    flex: 3,
    alignItems: 'center'
  },
  iconB: {
    marginRight: 10,
  },
  hidden: {
    display: "none"
  },
  imageBG: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  myShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 }, 
    textShadowRadius: 1,
  }
});



const initialState = {
    cotacaoBTCUSD: '0',
    cotacaoBTCBRL: '0',
    cotacaoUSDBRL: '0',
    iconBTCUSD: 'genderless',
    iconBTCUSDstyle: styles.cinza,
    iconBTCBRL: 'genderless',
    iconBTCBRLstyle: styles.cinza,
    inputUSD: null,
    inputBRL: null,
    inputBTC: null,
    isLoading: true,
    showHome: true,
    showSobre: false,
    autoUpdate: true,
    defaultCalc: 'usd',
}

export default class App extends Component {

  state = {
    ...initialState
  }

  async componentDidMount() {
    // this._isMounted = true;

    const stateString = await AsyncStorage.getItem('bcState')
    const state = JSON.parse(stateString) || initialState
    this.setState(state)

    this.getCotacaoBTCUSD()
    this.getCotacaoBTCBRL()

    this.timer = setInterval( () => this.getCotacaoBTCUSD(), 60000)
    this.timer = setInterval( () => this.getCotacaoBTCBRL(), 60000)
    this.timer = setInterval( () => this.syncState(), 10000)
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  formatarMoeda(valor, moeda) {
    Intl.__disableRegExpRestore();
    var formater = new Intl.NumberFormat('pt-BR', {style: 'currency', currency: moeda});
    return formater.format(valor);
  } 

  getCotacaoBTCUSD() {

    if (!this.state.autoUpdate) {
      this.setState({iconBTCUSDstyle: styles.cinza})
      this.setState({iconBTCUSD: 'genderless'});
      return false
    }

    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');

    // fetch('https://api.bitfinex.com/v1/pubticker/btcusd', {method: "GET", headers: myHeaders})
    fetch('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT', {method: "GET", headers: myHeaders})
      .then((response) => response.text())
      .then((responseData) =>
      {

        if (responseData.includes('price')) {
          responseData = JSON.parse(responseData);
          var valor = responseData['data']['price'];
          // console.log(this.state.cotacaoBTCUSD + ' > ' + valor);

          if (this.state.cotacaoBTCUSD > valor && this.state.cotacaoBTCUSD > 0) {
            // console.log('desceu');
            this.setState({iconBTCUSD: 'caret-down'});
            this.setState({iconBTCUSDstyle: styles.vermelho});
          } else if (this.state.cotacaoBTCUSD > 0 && this.cotacaoBTCUSD < valor) {
            // console.log('subiu');
            this.setState({iconBTCUSD: 'caret-up'});
            this.setState({iconBTCUSDstyle: styles.verde});
          } else {
            // console.log('nao mexeu');
            this.setState({iconBTCUSD: 'genderless'});
            this.setState({iconBTCUSDstyle: styles.cinza});
          }
          // valor = this.formatarMoeda(valor, 'USD').replace(/US\$/, 'US$ ');

          this.setState({cotacaoBTCUSD: valor});
          return(true)
          // .toLocaleString('pt-br', {style: 'currency', currency: 'USD'})
        }
      })
      .catch((error) => {
        console.error('Erro: ' + error);
      });
  }

  getCotacaoBTCBRL() {

    if (!this.state.autoUpdate) {
      this.setState({iconBTCBRLstyle: styles.cinza})
      this.setState({iconBTCBRL: 'genderless'});
      return false
    }

    fetch('https://www.mercadobitcoin.net/api/BTC/ticker/', {method: "GET"})
      .then((response) => response.text())
      .then((responseData) =>
      {

        if (responseData.includes('ticker')) {
          responseData = JSON.parse(responseData);
          var valor = responseData['ticker']['last'];
          // console.log(this.state.lastCotacaoBTCBRL + ' > ' + valor);

          if (this.state.cotacaoBTCBRL > valor && this.state.cotacaoBTCBRL > 0) {
            // console.log('desceu');
            this.setState({iconBTCBRL: 'caret-down'});
            this.setState({iconBTCBRLstyle: styles.vermelho});
          } else if (this.state.cotacaoBTCBRL > 0 && this.state.cotacaoBTCBRL < valor) {
            // console.log('subiu');
            this.setState({iconBTCBRL: 'caret-up'});
            this.setState({iconBTCBRLstyle: styles.verde});
          } else {
            // console.log('não mexeu');
            this.setState({iconBTCBRL: 'genderless'});
            this.setState({iconBTCBRLstyle: styles.cinza});
          }

          this.setState({cotacaoBTCBRL: valor});
          return(true)
        }
      })
      .catch((error) => {
        console.error('Erro: ' + error);
      });
  }

  calcular() {
    var qUSD = this.state.inputUSD;
    var qBRL = this.state.inputBRL;
    var qBTC = this.state.inputBTC;

    if (this.state.defaultCalc==='usd' && qUSD) {
      qUSD = qUSD.replace(/\./,'');
      qUSD = qUSD.replace(/\,/,'.');

      qBTC = (qUSD / this.state.cotacaoBTCUSD).toFixed(8);
      qBRL = qBTC * this.state.cotacaoBTCBRL;

    } else if (this.state.defaultCalc==='brl' && qBRL) {
      qBRL = qBRL.replace(/\./,'');
      qBRL = qBRL.replace(/\,/,'.');

      qBTC = (qBRL / this.state.cotacaoBTCBRL).toFixed(8);
      qUSD = qBTC * this.state.cotacaoBTCUSD;

    } else if (this.state.defaultCalc==='btc' && qBTC) {
      qUSD = qBTC * this.state.cotacaoBTCUSD;
      qBRL = qBTC * this.state.cotacaoBTCBRL;
    }

    // console.log(`usd:  ${qUSD} ${this.state.defaultCalc}`);

    (qUSD) ? qUSD = (this.formatarMoeda(qUSD, 'USD')).replace(/US\$/, '') : null;
    (qBRL) ? qBRL = (this.formatarMoeda(qBRL, 'BRL')).replace(/R\$/, '') : null;
    (qBTC) ? qBTC = qBTC.toString() : null;

    if (this.state.cotacaoBTCUSD==='0' || this.state.cotacaoBTCBRL==='0') {
      qUSD, qBRL, qBTC = '0';
    }

    this.setState({
      inputUSD: qUSD,
      inputBRL: qBRL,
      inputBTC: qBTC
    });

    this.syncState()
  }

  limpar() {
    this.setState({
      inputUSD: null,
      inputBRL: null,
      inputBTC: null
    })
    this.syncState()
  }

  syncState() {
    AsyncStorage.setItem('bcState', JSON.stringify(this.state))
  }

  setLoaded() {
    this.setState({isLoading: false})
  }

  currencyOnly(myObject, text) {
    let newText = '';
    let characters = '0123456789';
    if (myObject==="inputBTC") {
      characters = '0123456789.';
    }

    for (var i=0; i < text.length; i++) {
        if(characters.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
    }

    if (myObject==="inputUSD") { this.setState({inputUSD: newText}); }
    if (myObject==="inputBRL") { this.setState({inputBRL: newText}); }
    if (myObject==="inputBTC") { this.setState({inputBTC: newText}); }
  }

  render() {

    if (this.state.cotacaoBTCUSD>0 && this.state.cotacaoBTCBRL>0 && this.state.isLoading===true) {
      this.setLoaded()
    }

    if (this.state.isLoading) {
      return <SplashScreen />
    }

    let viewHomeStyle = ''
    let viewSobreStyle = ''
    if (this.state.showHome) {
      viewSobreStyle = styles.hidden
    }

    if (this.state.showSobre) {
      viewHomeStyle = styles.hidden
      // corpo = <SobreScreen />
    }

    return(
      // <StyleProvider style={getTheme()}>
      <Container>
        <Header style={styles.myHeader}>
          <Left />
          <Body style={styles.myHeaderBody}>
            <Title>{i18n.t('appName')}</Title>
          </Body>
          <Right>
            <Button transparent 
            onPress={ () => { 
              this.setState({showHome: true}); 
              this.setState({showSobre: false})}
            }>
              <IconB name='home' style={styles.branco} size={20} />
            </Button>

            <Button transparent 
            onPress={ () => { 
              this.setState({showHome: false}); 
              this.setState({showSobre: true})}
            }>

              <IconB name='info-circle' style={styles.branco} size={20} />
            </Button>
            </Right>
        </Header>

          <ImageBackground source={require('./src/icons/btc-wallpaper.jpg')}
          resizeMode="stretch"
          style={styles.imageBG}>
        <Content style={styles.myContent}>
        <View style={viewHomeStyle}>{/* View home */}
        <View style={styles.display}>{/* View display */}

          <View style={styles.linha}>
            <View style={styles.bitcao}>
              <Text style={[styles.bitcaoText, styles.myShadow]}><IconB name='bitcoin' size={50} /> =</Text>
            </View>
            <View style={styles.bitcao}>
              <Text style={styles.displayText}>
                <Text style={[styles.displayText, styles.myShadow]}>{this.formatarMoeda(this.state.cotacaoBTCUSD, 'USD')
                .replace(/US\$/, 'US$ ')}</Text> <IconB name={this.state.iconBTCUSD} 
                style={this.state.iconBTCUSDstyle} size={25} /></Text>
              <Text style={styles.displayText}>
                <Text style={[styles.displayText, styles.myShadow]}>
                {this.formatarMoeda(this.state.cotacaoBTCBRL, 'BRL')
                .replace(/R\$/, 'R$ ')}</Text> <IconB name={this.state.iconBTCBRL} 
                style={this.state.iconBTCBRLstyle} size={25} />
                </Text>
            </View>
          </View>



          </View>{/* end View display */}

        <View style={{flexDirection: 'row'}}>
          <Right style={{backgroundColor: "#000", 
          flexDirection: 'row', justifyContent: 'flex-end',
          alignItems: 'center'}}>
          <Text style={[styles.branco, {fontSize: 8}]}>AUTO UPDATE:</Text>
           <Switch 
            style={{color: '#fff', width: 50, height: 50}}
            // trackColor={{ false: "#AA2B0E", true: "#25A542" }}
            thumbColor={this.state.autoUpdate ? "#25A542" : "#AA2B0E" }
            onValueChange={ () => {
              let newUpdate = !this.state.autoUpdate
              this.setState({autoUpdate: newUpdate})
              this.syncState()
            }}
             value={this.state.autoUpdate} />
          </Right>
        </View>

          <View style={styles.myForm}>
          <Form>
            <Item>
              <IconC name='currency-usd' style={styles.branco} />
              <Input placeholder={ i18n.t('dollar') }  style={styles.branco} 
              keyboardType='numeric'
              placeholderTextColor='#fff' 
              onChangeText={(text) => this.currencyOnly('inputUSD', text)} 
              onFocus={() => this.setState({defaultCalc: 'usd'})}
              value={this.state.inputUSD} />
            </Item>

            <Item>
              <IconC name='currency-brl' style={styles.branco} />
              <Input placeholder={ i18n.t('real') }  style={styles.branco} 
              keyboardType='numeric'
              placeholderTextColor='#fff' 
              onChangeText={(text) => this.currencyOnly('inputBRL', text)} 
              onFocus={() => this.setState({defaultCalc: 'brl'})}
              value={this.state.inputBRL} />
            </Item>

            <Item>
              <IconB name='bitcoin' style={styles.branco} />
              <Input placeholder={ i18n.t('bitcoin') } style={styles.branco} 
              keyboardType='numeric'
              placeholderTextColor='#fff' 
              onChangeText={(text) => this.currencyOnly('inputBTC', text)} 
              onFocus={() => this.setState({defaultCalc: 'btc'})}
              value={this.state.inputBTC} />
            </Item>
          </Form>
          <View style={styles.viewCalcular}>
              {/* <Button iconLeft light transparent style={styles.butCalcular} */}
              <TouchableHighlight style={styles.butCalcular}
              underlayColor='#888' 
              onPress={() => this.calcular()}>
                <Text style={styles.branco}>
                    <IconB name='calculator' />{'  '} 
                    { i18n.t('btnCalculate') }
                </Text>
              </TouchableHighlight>

              <TouchableHighlight style={styles.butCalcular}
              underlayColor='#888' 
              onPress={() => this.limpar()}>
                
                <Text style={styles.branco}>
                  <IconB name='eraser' />{'  '}
                  { i18n.t('btnClear') }
                </Text>
              </TouchableHighlight>
          </View>
          </View>
        </View>{/* View home */}

        <View style={viewSobreStyle}>{/* view sobre */}
          <SobreScreen />
        </View>

        </Content>
        </ImageBackground>
      </Container>
      // </StyleProvider>
    );
  }
}

