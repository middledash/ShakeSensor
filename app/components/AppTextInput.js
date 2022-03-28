import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import defaultStyles from '../config/styles'

export default function AppTextInput({ icon, sizex, ...otherProps }) {
  return (
    <View style={styles.container(sizex)}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        style={defaultStyles.text}
        {...otherProps}
        autoCapitalize='none'
        autoCorrect={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: size => ({
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: 'row',
    width: size,
    padding: 15,
    marginVertical: 10,
  }),
  text: {

  },
  icon: {
    marginRight: 10,
  },
})
