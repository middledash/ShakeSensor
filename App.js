import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import AppButton from './app/components/AppButton';
import Screen from './app/components/Screen';
import AppTextInput from './app/components/AppTextInput';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { create } from 'apisauce';
import { Keyboard } from 'react-native';

export default function App() {
  const [text, setText] = useState('Hello Micha');
  const [counter, setCounter] = useState(0);
  const [userUrl, setUserUrl] = useState('http://192.168.0.6:4001/api/post');
  const [httpStatus, setHttpStatus] = useState(null);


  const apiClient = create({
    baseURL: userUrl
  })

  const handelButtonPress = () => {
    console.log("POST...");
    apiClient.post("/", { "key": text })
      .then(
        response => setHttpStatus(response.status)
      )
  }

  const handleTextChange = (e) => {
    setText(e)
    if (httpStatus === 200) console.log("reset...")
    if (httpStatus === 200) setHttpStatus(null)
  }


  useEffect(() => {
    addSensorListener(() => {
      console.log(`Shake Shake Shake ${counter}`);
      setCounter(() => counter + 1);
      handelButtonPress();
    });
    return () => {
      removeListener();
    };
  });


  const addSensorListener = (handler) => {
    //this is shake sensitivity - lowering this will give high sensitivity and increasing this will give lower sensitivity
    const THRESHOLD = 25;
    let last_x, last_y, last_z;
    let lastUpdate = 0;
    Accelerometer.addListener((accelerometerData) => {
      let { x, y, z } = accelerometerData;
      let currTime = Date.now();
      if (currTime - lastUpdate > 100) {
        let diffTime = currTime - lastUpdate;
        lastUpdate = currTime;
        let speed =
          (Math.abs(x + y + z - last_x - last_y - last_z) / diffTime) * 10000;
        if (speed > THRESHOLD) {
          handler();
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
    });
  };
  const removeListener = () => {
    Accelerometer.removeAllListeners();
  };


  return (
    <Screen style={styles.container}>
      <View style={styles.background}>
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View style={styles.button}>
            <Text style={styles.text}>
              {httpStatus === 200 ?
                < MaterialCommunityIcons name="check-circle" size={50} color="green" />
                :
                <MaterialCommunityIcons name="check-circle" size={50} color="lightgrey" />}
            </Text>
            <Text style={styles.label}>
              Your Message:
            </Text>
            <AppTextInput
              style={styles.input}
              onChangeText={handleTextChange}
              placeholder="Enter some text..."
            />
            <Text style={styles.label}>
              http-Endpoint:
            </Text>
            <AppTextInput
              style={styles.input}
              onChangeText={setUserUrl}
              placeholder={userUrl}
            />
            <AppButton color="primary" title="Manual Event" onPress={handelButtonPress} />
          </View>

        </TouchableWithoutFeedback>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
  background: {
    height: '100%',
    // justifyContent: 'center',
  },
  button: {
    padding: 20
  },
  input: {
    fontSize: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center'
  },
  label: {
    fontSize: 20,
    textAlign: 'left'
  }
});
