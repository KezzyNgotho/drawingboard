import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';

const SignupScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [farmName, setFarmName] = useState('');
  const [location, setLocation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
      // Sign up the user with email and password
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      // User signed up successfully, now you can add additional data to Firestore
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        await userRef.set({
          username,
          email,
          farmName,
          location,
          mobileNumber,
          position,
        });
      }

      navigation.navigate('Login'); // Redirect to the login screen after successful sign-up
    } catch (error) {
      // Handle the error, e.g., show an error message
      setError('Failed to sign up: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={text => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Farm Name"
        value={farmName}
        onChangeText={text => setFarmName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => setLocation(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={text => setMobileNumber(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Position"
        value={position}
        onChangeText={text => setPosition(text)}
      />
 {error !== '' && <Text style={styles.errorText}>{error}</Text>}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  signupButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    paddingVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
