import React, { PureComponent } from 'react'
import { SafeAreaView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'

import { blackSecondary, primary, success, white } from '../Lib/Color'

//safe area view itu kea page ya ?
const NoInternet = (props) => {
  const { onPress } = props

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/noInternetConnection.png')} />
      <Text style={styles.headerText}>Hilang Koneksi?</Text>
      <Text style={styles.descriptionText}>Sepertinya kami tidak bisa memenuhi permintaan anda, mohon untuk memeriksa koneksi anda</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.buttonText}>Coba lagi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
  
}

//define style buat no internet page (?)
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: white,
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    color: blackSecondary,
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    marginTop: 48
  },
  descriptionText: {
    color: blackSecondary,
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    marginHorizontal: 16,
    marginTop: 16,
    textAlign: 'center'
  },
  buttonText: {
    color: primary,
    fontFamily: 'Poppins-Light',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center'
  }
})

export default NoInternet