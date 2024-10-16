import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { io } from 'socket.io-client';

const socket = io('https://estadoemocionalapp-3t3bn79v.b4a.run/');

const BackgroundPattern = () => (
  <View style={styles.patternContainer}>
    {[...Array(100)].map((_, i) => (
      <Text key={i} style={[
        styles.patternEmoji,
        {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }
      ]}>
        {Math.random() > 0.5 ? '💙' : '💍'}
      </Text>
    ))}
  </View>
);

export default function App() {
  const [yoelValue, setYoelValue] = useState(50);
  const [lauraValue, setLauraValue] = useState(50);

  useEffect(() => {
    socket.on('updateValues', ({ yoel, laura }) => {
      setYoelValue(yoel);
      setLauraValue(laura);
    });
  }, []);

  const handleYoelChange = (value) => {
    const newValue = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    setYoelValue(newValue);
    socket.emit('updateYoel', newValue);
  };

  const handleLauraChange = (value) => {
    const newValue = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    setLauraValue(newValue);
    socket.emit('updateLaura', newValue);
  };

  const totalPercentage = yoelValue + lauraValue;
  const remainingPercentage = totalPercentage > 100 ? 0 : 100 - totalPercentage;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <BackgroundPattern />
      <View style={styles.container}>
        {totalPercentage > 100 && <Text style={styles.loveEmoji}>😍</Text>}
        <View style={styles.card}>
          <Text style={styles.title}>Nuestro % de estado emocional</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.name}>Yoel</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={yoelValue}
              onValueChange={handleYoelChange}
              minimumTrackTintColor="#FF0000"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FF0000"
            />
            <TextInput
              style={styles.input}
              value={yoelValue.toFixed(0)}
              onChangeText={handleYoelChange}
              keyboardType="numeric"
            />
            <Text style={styles.percentageSymbol}>%</Text>
          </View>
          <View style={styles.sliderContainer}>
            <Text style={styles.name}>Laura</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={lauraValue}
              onValueChange={handleLauraChange}
              minimumTrackTintColor="#FF0000"
              maximumTrackTintColor="#000000"
              thumbTintColor="#FF0000"
            />
            <TextInput
              style={styles.input}
              value={lauraValue.toFixed(0)}
              onChangeText={handleLauraChange}
              keyboardType="numeric"
            />
            <Text style={styles.percentageSymbol}>%</Text>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Suma total: {totalPercentage.toFixed(0)}%</Text>
            <Text style={styles.summaryText}>Falta para 100%: {remainingPercentage.toFixed(0)}%</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F3FF', // Color azul pastel
    paddingVertical: 20,
  },
  patternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  patternEmoji: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  loveEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  name: {
    width: 50,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  input: {
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
  },
  percentageSymbol: {
    marginLeft: 5,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
});