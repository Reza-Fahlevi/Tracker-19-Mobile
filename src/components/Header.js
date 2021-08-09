import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Item } from 'native-base'
import Feather from 'react-native-vector-icons/Feather'

import { black } from '../Lib/Color'

function Header(props) {
  const { onBack, headerText, navigation } = props

  const onPressBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigation.pop()
    }
  }

  return (
    <Item style={styles.headerContainer}>
      <TouchableOpacity onPress={onPressBack}>
        <Feather
          name='arrow-left'
          size={20}
          color={black}
        />
      </TouchableOpacity>
      <Text style={styles.headerText}>{headerText}</Text>
    </Item>
  )
}

const styles = StyleSheet.create({
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

export default Header