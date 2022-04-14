import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
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
  // const [userUrl, setUserUrl] = useState('http://192.168.0.6:4001/api/post');
  const [userUrl, setUserUrl] = useState('http://44.192.67.50:8001');
  const [httpStatus, setHttpStatus] = useState(null);
  const [preventPost, setPreventPost] = useState(false);

  const apiClient = create({
    baseURL: userUrl
  })

  const myDelay = () => {
    console.log("Delay..");
    setPreventPost(false);
  }

  const handelButtonPress = () => {
    if (preventPost) return;

    console.log("POST...");
    // apiClient.post("/", { "key": text })
    apiClient.post("/", { "key": parseInt(text, 10) })
      .then(
        response => setHttpStatus(response.status)
      )
    setPreventPost(true);
    setTimeout(() => { myDelay() }, 4000);
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
              Number:
            </Text>
            <AppTextInput
              style={styles.input}
              onChangeText={handleTextChange}
              placeholder="20"
            />
            <Text style={styles.label}>
              HTTP:
            </Text>
            <AppTextInput
              style={styles.input}
              onChangeText={setUserUrl}
              placeholder={userUrl}
            />
            <AppButton color="secondary" title="Manual Event" onPress={handelButtonPress} />
            <View style={styles.logo}>
              <Image
                style={styles.tinyLogo}
                source={require('./assets/LogoWeeve.png')}
              />
            </View>
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
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
  background: {
    // height: '100%',
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
  },
  logo: {
    alignItems: 'center',
    margin: 20,
    height: 200,
  },
  tinyLogo: {
    width: 150,
    height: 150,
    margin: 10,
    resizeMode: 'contain',
  },
});
