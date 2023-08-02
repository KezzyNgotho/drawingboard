import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose any icon library you prefer

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Your App Logo */}
      <Text style={styles.logo}>Your App Logo</Text>

      {/* Function description */}
      <Text style={styles.description}>Welcome to Your zoo app.Keep records of your dairy farm</Text>

      {/* Get Started Arrow */}
      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="arrow-right" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 30,
  },
  arrowContainer: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 50,
  },
});

export default LandingScreen;
