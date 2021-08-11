import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import SplashScreen from '../components/SplashScreen'
import AllScreen from '../components/AllScreen'
import WebviewScreen from '../components/WebviewScreen'

const MainNavigator = createStackNavigator({
  App: { screen: AllScreen },
  Webview: { screen: WebviewScreen },
}, {
  initialRouteName: 'App',
  headerMode: 'none'
})

const RootNavigator = createSwitchNavigator({
  MainNavigator: MainNavigator,
  Splash: SplashScreen,
}, {
  initialRouteName: 'Splash'
})

const AppNavigator = createAppContainer(RootNavigator)

export default AppNavigator
