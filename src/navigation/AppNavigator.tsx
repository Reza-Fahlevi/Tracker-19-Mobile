import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import SplashScreen from '../components/SplashScreen'
import AllScreen from '../components/AllScreen'
import WebView from '../components/WebView'


const RootNavigator = createSwitchNavigator({
  Splash: SplashScreen ,
  App: AllScreen,
  WebView: WebView
}, {
  initialRouteName: 'Splash'
})

const AppNavigator = createAppContainer(RootNavigator)

export default AppNavigator
