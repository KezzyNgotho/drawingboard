import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WeatherCard = ({ temperature, humidity, wind,precipitation, isFavorableForCattle }) => {
  return (
    <View style={styles.weatherCard}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <Image source={require('../assets/clouds.png')} style={styles.cloudIcon} resizeMode="contain" />
        <Text style={styles.temperatureLabel}>{temperature}°C</Text>
      </View>

      {/* Bottom Row */}
      <View style={styles.bottomRow}>
        <View style={styles.weatherElement}>
          <Image source={require('../assets/humidity.png')} style={styles.weatherIcon} resizeMode="contain" />
          <Text style={styles.weatherLabelText}>Humidity:</Text>
          <Text style={styles.weatherValueText}>{humidity}%</Text>
        </View>
        <View style={styles.weatherElement}>
          <Image source={require('../assets/wind.png')} style={styles.weatherIcon} resizeMode="contain" />
          <Text style={styles.weatherLabelText}>Wind:</Text>
          <Text style={styles.weatherValueText}>{wind} km/h</Text>
        </View>
        <View style={styles.weatherElement}>
          <Image source={require('../assets/cold.png')} style={styles.weatherIcon} resizeMode="contain" />
          <Text style={styles.weatherLabelText}>precipitation:</Text>
          <Text style={styles.weatherValueText}>{precipitation}mm</Text>
        </View>
        <View style={styles.weatherElement}>
          <Image source={require('../assets/cow.png')} style={styles.weatherIcon} resizeMode="contain" />
          <Text style={styles.weatherLabelText}>
            {isFavorableForCattle ? 'Weather is favorable for cattle.' : 'Weather is not favorable for cattle.'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginTop: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cloudIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  temperatureLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherElement: {
    flex: 1,
  },
  weatherLabelText: {
    fontSize: 16,
    color:'black',
  },
  weatherValueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});

export default WeatherCard;
