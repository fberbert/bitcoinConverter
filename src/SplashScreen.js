import React, { Component } from 'react'
import { View, Text, Image, Dimensions } from 'react-native'

const screenWidth = Math.round( Dimensions.get('window').width * 0.8)
const screenHeight = Math.round(Dimensions.get('window').height)

const viewStyles = { 
    backgroundColor: 'white',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
}

const textStyles = {
    color: 'orange',
    fontSize: 30,
    fontWeight: 'bold'
}

const imgStyles = {
    width: screenWidth,
    height: screenWidth,
    resizeMode: 'stretch'   
}

export default class SplashScreen extends Component {

  render() {
    return (
      <View style={viewStyles}>
        <Image
          style={imgStyles} 
          source={require('./icons/bitcoin512x512.png')}
        />
        <Text style={textStyles}>
          Loading...
        </Text>

      </View>
    )
  }
}