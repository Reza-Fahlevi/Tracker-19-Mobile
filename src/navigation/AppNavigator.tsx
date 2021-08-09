import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import SplashScreen from '../components/SplashScreen'
import AllScreen from '../components/AllScreen'
import WebviewScreen from '../components/WebviewScreen'


const RootNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  App: AllScreen,
  Webview: WebviewScreen
}, {
  initialRouteName: 'Splash'
})

const AppNavigator = createAppContainer(RootNavigator)

export default AppNavigator
