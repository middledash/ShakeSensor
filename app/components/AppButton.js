import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import { Children } from 'react-native'

function AppButton({ title, color, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors[color] }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: "bold",
  },

})

export default AppButton;