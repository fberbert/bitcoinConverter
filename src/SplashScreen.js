import React, { Component } from 'react'
import { View, Text, ImageBackground, Dimensions } from 'react-native'

const screenWidth = Math.round( Dimensions.get('window').width * 0.8)
const screenHeight = Math.round(Dimensions.get('window').height)

const imageBG = { 
    flex: 9,
    resizeMode: "cover",
    padding: 30,
    opacity: 0.6,
}

const textStyles = {
    color: 'white',
    fontSize: 20,
    fontWeight: 'normal',
    textTransform: 'uppercase',
}

const viewStyles = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: "center",
    alignItems: 'flex-end',
    paddingRight: 20,
}


export default class SplashScreen extends Component {

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 1)'}}>
      <ImageBackground source={require('./icons/btc-wallpaper.png')}
        resizeMode="stretch"
        style={imageBG}>
      </ImageBackground>
      <View style={viewStyles}>
          <Text style={textStyles}>Loading...</Text>
      </View>
      </View>
    )
  }
}