import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Content, Text, H1 } from 'native-base'
import i18n from './i18n'
import { NativeModules, Platform } from 'react-native'

const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;
//definir locale / translation
if (Object.keys(i18n.translations).includes(deviceLanguage)) {
  i18n.defaultLocale = deviceLanguage;
  i18n.locale = deviceLanguage;
} 

export default class SobreScreen extends Component {
    render() {
        return (
                <Content style={styles.contentStyle}>
                    <H1 style={styles.myH1}>{i18n.t('about')}</H1>
                    <Text style={styles.myText}>
                    {'\n'}
                        {i18n.t('developedBy')}:{'\n'}{'\n'}
                        Fábio Berbert de Paula{'\n'}
                        &lt;fberbert@gmail.com&gt; 
                        {'\n'}{'\n'}
                        {i18n.t('aboutTecnology')} 
                        {'\n'}{'\n'}
                        Github: 
                        {'\n'}{'\n'}
                        https://github.com/fberbert/bitcoinConverter
                        {'\n'}{'\n'}
                        {i18n.t('aboutSource')}:{'\n'}{'\n'}
                        USD -> Kucoin{'\n'}
                        BRL -> Mercado Bitcoin
                    </Text>
                </Content>

        )
    }
}

const styles = StyleSheet.create({
    contentStyle: {
        padding: 20,
    }, 
    myH1: {
        color: '#fff',
        fontSize: 25
    },
    myText: {
        fontSize: 16,
        color: '#fff'
    }
})