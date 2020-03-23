import React, { Component } from 'react';
import { StyleSheet, View, YellowBox, Alert } from 'react-native';
import {
  Container, Header, Title, Content, Body, Text, Button, Left, Right, 
  Icon, Form, Input, Label, Item, Subtitle, StyleProvider
} from 'native-base';
import IconB from 'react-native-vector-icons/FontAwesome';
import IconC from 'react-native-vector-icons/MaterialCommunityIcons';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import 'intl/locale-data/jsonp/en';
// import getTheme from './native-base-theme/components';
import i18n from './src/i18n';
import { NativeModules, Platform } from 'react-native';

YellowBox.ignoreWarnings(['Require cycle', 'state update']);

const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;

//definir locale / translation
console.log("linguagem: " + deviceLanguage); 
console.log('t: ' + Object.keys(i18n.translations));

if (Object.keys(i18n.translations).includes(deviceLanguage)) {
  i18n.defaultLocale = deviceLanguage;
  i18n.locale = deviceLanguage;
} // else default i18n.js applies
console.log('i18n: ' + i18n.locale);

export default class App extends Component {

  state = {
    cotacaoBTCUSD: '0',
    cotacaoBTCBRL: '0',
    cotacaoUSDBRL: '0',
    iconBTCUSD: 'caret-up',
    iconBTCUSDstyle: styles.preto,
    iconBTCBRL: 'caret-up',
    iconBTCBRLstyle: styles.preto,
    inputUSD: null,
    inputBRL: null,
    inputBRC: null,
  }

  componentDidMount() {
    this._isMounted = true;

    this.getCotacaoBTCUSD();
    this.timer = setInterval( () => this.getCotacaoBTCUSD(), 60000);

    this.getCotacaoBTCBRL();
    this.timer = setInterval( () => this.getCotacaoBTCBRL(), 60000);
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

    var myHeaders = new Headers();
    myHeaders.append('pragma', 'no-cache');
    myHeaders.append('cache-control', 'no-cache');

    fetch('https://api.bitfinex.com/v1/pubticker/btcusd', {method: "GET", headers: myHeaders})
      .then((response) => response.text())
      .then((responseData) =>
      {

        if (responseData.includes('last_price')) {
          responseData = JSON.parse(responseData);
          var valor = responseData['last_price'];
          // console.log(this.state.cotacaoBTCUSD + ' > ' + valor);

          if (this.state.cotacaoBTCUSD > valor && this.state.cotacaoBTCUSD > 0) {
            // console.log('desceu');
            this.setState({iconBTCUSD: 'caret-down'});
            this.setState({iconBTCUSDstyle: styles.vermelho});
          } else if (this.state.cotacaoBTCUSD > 0) {
            // console.log('subiu');
            this.setState({iconBTCUSD: 'caret-up'});
            this.setState({iconBTCUSDstyle: styles.verde});
          }
          // valor = this.formatarMoeda(valor, 'USD').replace(/US\$/, 'US$ ');

          this.setState({cotacaoBTCUSD: valor});
          // .toLocaleString('pt-br', {style: 'currency', currency: 'USD'})
        }
      })
      .catch((error) => {
        console.error('Erro: ' + error);
      });
  }

  getCotacaoBTCBRL() {

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
          } else if (this.state.cotacaoBTCBRL > 0) {
            // console.log('subiu');
            this.setState({iconBTCBRL: 'caret-up'});
            this.setState({iconBTCBRLstyle: styles.verde});
          }

          this.setState({cotacaoBTCBRL: valor});
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

    // console.log('USD: ' + qUSD);

    if (qUSD) {
      qUSD = qUSD.replace(/\./,'');
      qUSD = qUSD.replace(/\,/,'.');

      qBTC = (qUSD / this.state.cotacaoBTCUSD).toFixed(8);
      qBRL = qBTC * this.state.cotacaoBTCBRL;
    } else if (qBRL) {
      qBRL = qBRL.replace(/\./,'');
      qBRL = qBRL.replace(/\,/,'.');

      qBTC = (qBRL / this.state.cotacaoBTCBRL).toFixed(8);
      qUSD = qBTC * this.state.cotacaoBTCUSD;
    } else if (qBTC) {
      qUSD = qBTC * this.state.cotacaoBTCUSD;
      qBRL = qBTC * this.state.cotacaoBTCBRL;
    }

    (qUSD) ? qUSD = (this.formatarMoeda(qUSD, 'USD')).replace(/US\$/, '') : null;
    (qBRL) ? qBRL = (this.formatarMoeda(qBRL, 'BRL')).replace(/R\$/, '') : null;
    (qBTC) ? qBTC = qBTC.toString() : null;

    this.setState({
      inputUSD: qUSD,
      inputBRL: qBRL,
      inputBTC: qBTC
    });
  }

  limpar() {
    this.setState({
      inputUSD: null,
      inputBRL: null,
      inputBTC: null
    });

  }

  render() {

    return(
      // <StyleProvider style={getTheme()}>
      <Container>
        <Header style={styles.myHeader}>
          <Left />
          <Body style={styles.myHeaderBody}>
            <Title>{i18n.t('appName')}</Title>
          </Body>
          <Right>
            <Button transparent onPress={ () => Alert.alert('Sobre', 'Fábio Berbert de Paula\nfberbert@gmail.com')}>
              <IconB name='info-circle' style={styles.branco} size={20} />
            </Button>
            </Right>
        </Header>
        <Content style={styles.display}>

          <View style={styles.linha}>
            <View style={styles.bitcao}>
              <Text style={styles.bitcaoText}><IconB name='bitcoin' size={50} /> =</Text>
            </View>
            <View style={[styles.bitcao, 'padding: 0']}>
              <Text style={styles.displayText}>
                {this.formatarMoeda(this.state.cotacaoBTCUSD, 'USD')
                .replace(/US\$/, 'US$ ')} <IconB name={this.state.iconBTCUSD} 
                style={this.state.iconBTCUSDstyle} size={25} />
              </Text>
              <Text style={styles.displayText}>
                {this.formatarMoeda(this.state.cotacaoBTCBRL, 'BRL')
                .replace(/R\$/, 'R$ ')} <IconB name={this.state.iconBTCBRL} 
                style={this.state.iconBTCBRLstyle} size={25} />
                </Text>
            </View>
          </View>

          <Form>
            <Item>
              <IconC name='currency-usd' style={styles.branco} />
              <Input placeholder={ i18n.t('dollar') }  style={styles.branco} 
              onChangeText={(inputUSD) => this.setState({inputUSD})} 
              value={this.state.inputUSD} />
            </Item>

            <Item>
              <IconC name='currency-brl' style={styles.branco} />
              <Input placeholder={ i18n.t('real') }  style={styles.branco} 
              onChangeText={(inputBRL) => this.setState({inputBRL})} 
              value={this.state.inputBRL} />
            </Item>

            <Item>
              <IconB name='bitcoin' style={styles.branco} />
              <Input placeholder={ i18n.t('bitcoin') } style={styles.branco} 
              onChangeText={(inputBTC) => this.setState({inputBTC})} 
              value={this.state.inputBTC} />
            </Item>

          </Form>
          <View style={styles.viewCalcular}>
              <Button iconLeft light transparent style={styles.butCalcular}
              onPress={() => this.calcular()}>
                <IconB name='calculator' style={styles.branco} />
                <Text>{ i18n.t("btnCalculate") }</Text>
              </Button>

              <Button iconLeft light transparent style={styles.butCalcular}
              onPress={() => this.limpar()}>
                <IconB name='eraser' style={styles.branco} />
                <Text>{ i18n.t("btnClear") }</Text>
              </Button>
          </View>

        </Content>
      </Container>
      // </StyleProvider>
    );
  }
}

const styles = StyleSheet.create({
  display: {
    padding: 10,
    margin: 10,
    backgroundColor: '#000',
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
  viewCalcular: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  butCalcular: {
    width: '45%',
    padding: 8,
  },
  myHeader: {
    backgroundColor: '#111',
  },
  myHeaderBody: {
    flex: 3,
    alignItems: 'center'
  }
});

