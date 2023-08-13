import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity,StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
const RegisterNewCattle = ({ isVisible, onRegister }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [isMale, setIsMale] = useState(true);
    const [isPregnant, setIsPregnant] = useState(false);
    const [isFertile, setIsFertile] = useState(true);
  
    if (!isVisible) {
      return null;
    }
  
    const handleRegister = () => {
      const newCattle = {
        name,
        age,
        breed,
        isMale,
        isPregnant,
        isFertile,
      };
      onRegister(newCattle);
      setName('');
      setAge('');
      setBreed('');
      setIsMale(true);
      setIsPregnant(false);
      setIsFertile(true);
    };
  
    return (
      <View style={styles.card}>
        <Text style={styles.title}>Register New Cattle</Text>
        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Age"
          style={styles.input}
          value={age}
          onChangeText={setAge}
        />
        <View style={styles.pickerContainer}>
          <Text  style={styles.buttonText1}>Breed:</Text>
          <Picker
            selectedValue={breed}
            onValueChange={(itemValue) => setBreed(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Breed" value="" />
            <Picker.Item label="Angus" value="Angus" />
            <Picker.Item label="Hereford" value="Hereford" />
            {/* Add more breed options */}
          </Picker>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text  style={styles.buttonText1}>Gender:</Text>
          <CheckBox
            disabled={false}
            value={isMale}
            onValueChange={() => setIsMale(!isMale)}
          />
          <Text  style={styles.buttonText1}>Male</Text>
          <CheckBox
            disabled={false}
            value={!isMale}
            onValueChange={() => setIsMale(!isMale)}
          />
          <Text style={styles.buttonText1}>Female</Text>
        </View>
        <View style={styles.checkBoxContainer}>
          <Text  style={styles.buttonText1}>Pregnant?</Text>
          <CheckBox
            disabled={false}
            value={isPregnant}
            onValueChange={setIsPregnant}
          />
        </View>
        <View style={styles.checkBoxContainer}>
          <Text style={styles.buttonText1}>Fertile?</Text>
          <CheckBox
            disabled={false}
            value={isFertile}
            onValueChange={setIsFertile}
          />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  };
const styles= StyleSheet.create({
    card: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 20,
      },
      registerButton: {
        backgroundColor: '#E1E9F0',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
      },
      buttonText: {
        textAlign: 'center',
        color:'black',
        fontWeight:'bold',
      },
      buttonText1: {
        color:'black',
        fontWeight:'bold',
      },
      input: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'black',
      },
      picker: {
        backgroundColor:'#E1E9F0',
        borderRadius: 8,
        borderWidth: 4,
        borderColor:'black',
        color:'black',
        paddingVertical: 12,
        paddingHorizontal: 10,
      },
});







  export default RegisterNewCattle;