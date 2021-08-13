import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, Image, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-navigation'
import isEmpty from 'lodash/isEmpty'

import Header from './Header'

import { white, black, primary } from '../Lib/Color'

const { height, width } = Dimensions.get('window')

class WebviewScreen extends Component {

  static navigationOptions = () => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      title: ''
    };
  }

  //kalo misal terjadi kesalahan saat ngerender halaman
  renderError = () => (
    <View style={styles.container}>
      <Image source={require('../assets/networkError.png')} />
      <Text style={styles.errorText}>Terjadi kesalahaan saat memuat halaman</Text>
    </View>
  )

  //animasi loading
  renderSpinner = () => (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator color={primary} size="large" />
    </View>
  )

  //buat ngerender webview nya
  renderWebView = (uri) => (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        cacheEnabled={true}
        scalesPageToFit={true}
        onHttpError={this.renderError}
        renderError={this.renderError}
        renderLoading={this.renderSpinner}
        startInLoadingState={true}
      />
    </View>
  )

render() {
  const { navigation } = this.props
  const { state: { params } } = navigation

  return (
    <SafeAreaView style={styles.root} forceInset={{ bottom: 'never' }}>
      <Header headerText={params.headerText} navigation={this.props.navigation} />
      <KeyboardAvoidingView style={styles.root} behavior="padding" enabled>
        <View style={styles.root}>
          {isEmpty(params.uri) ? this.renderError() : this.renderWebView(params.uri)}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
}

//styiling
const styles = StyleSheet.create({
  root: {
    backgroundColor: white,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  spinnerContainer: {
    position: 'absolute',
    top: height / 2,
    left: width / 2,
  },
  errorText: {
    color: primary,
    fontFamily: 'Poppins-Light',
    fontSize: 14,
    marginVertical: 16
  },
  headerContainer: {
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: black,
    flex: 1,
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 8
  }
})

export default WebviewScreen