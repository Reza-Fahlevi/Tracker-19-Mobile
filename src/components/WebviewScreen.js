import React, { Component } from 'react'
import { View, Text, KeyboardAvoidingView, BackHandler, ProgressBarAndroid, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { SafeAreaView } from 'react-navigation'
import _ from 'lodash'

import Header from './Header'

import { basic, danger, white, black } from '../Lib/Color'

class WebviewScreen extends Component {

  static navigationOptions = ({ navigaton, screenProps }) => {
    return {
      header: null
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      fetching: false,
      canGoBack: false,
      title: ''
    };
    this.webview = React.createRef()
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackHandler)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackHandler)
  }

  onBackHandler = () => {
    const { canGoBack } = this.state

    if (canGoBack) {
      this.webview.current.goBack()
      return true
    } else {
      return false
    }
  }

  renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Terjadi kesalahaan saat memuat halaman peko...</Text>
    </View>
  )

  progressBar = (progress) => {
    return <ProgressBarAndroid color={basic} indeterminate={false} progress={progress} styleAttr='Horizontal' />
  }

  renderWebView = (uri) => {
    const { progress, fetching } = this.state


    return (
      <>
        {(progress !== 1 && fetching) && this.progressBar(progress)}
        <View style={{ flex: 1 }}>
          <WebView
            ref={this.webview}
            source={{ uri }}
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            cacheEnabled={true}
            scalesPageToFit={true}
            onLoadEnd={() => this.setState({ fetching: false })}
            onLoadProgress={({ nativeEvent }) => this.setState({ progress: nativeEvent.progress, fetching: true })}
            onNavigationStateChange={({ navState }) => this.setState({ canGoBack: navState.canGoBack, title: navState.title })}
            renderError={this.renderError}
            onHttpError={this.renderError}
          />
        </View>
      </>
    )
  }

  render() {
    const { navigation } = this.props
    const { state: { params } } = navigation

    return (
      <SafeAreaView style={styles.root} forceInset={{ bottom: 'never' }}>
        <Header headerText={params.headerText} navigation={this.props.navigation} />
        <KeyboardAvoidingView style={styles.root} behavior="padding" enabled>
          <View style={styles.root}>
            {_.isEmpty(params.uri ? this.renderError() : this.renderWebView(params.uri))}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: white,
    flex: 1,
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: danger,
    fontFamily: 'Poppins-Light',
    fontSize: 12,
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