import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView ,RadioButton} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
import RegisterNewCattle from '../components/RegisterNewCattle';



const CattleDetails = ({ cattle }) => {
  
  if (!cattle) {
    return null; // or render a placeholder if needed
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cattle Details</Text>
      <Text>Name: {cattle.name}</Text>
      <Text>Age: {cattle.age}</Text>
      <Text>Breed: {cattle.breed}</Text>
      <Text>Gender: {cattle.isMale ? 'Male' : 'Female'}</Text>
      <Text>Pregnant: {cattle.isPregnant ? 'Yes' : 'No'}</Text>
      <Text>Fertile: {cattle.isFertile ? 'Yes' : 'No'}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete Cattle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CattleSummary = ({ cattleList }) => {
  const totalCattle = cattleList.length;
  // Calculate counts of different cattle types (male, female, pregnant, infertile)
  // For the sake of example, let's assume you have these counts available
  const maleCount = 10;
  const femaleCount = 15;
  const pregnantCount = 5;
  const infertileCount = 2;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Cattle Summary</Text>
      <Text>Total Cattle: {totalCattle}</Text>
      <Text>Male: {maleCount}</Text>
      <Text>Female: {femaleCount}</Text>
      <Text>Pregnant: {pregnantCount}</Text>
      <Text>Infertile: {infertileCount}</Text>
    </View>
  );
};

const GenerateStatement = () => {
  const handleGenerateStatement = () => {
    // Generate and show the statement
    // You can use a library or custom logic to generate the statement
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Generate Statement</Text>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateStatement}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};

const CattleScreen = () => {
  const [cattleList, setCattleList] = useState([]);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false); // Initially not visible

  const handleRegisterCattle = (newCattle) => {
    setCattleList([...cattleList, newCattle]);
    setIsRegisterVisible(false); // Hide the registration form after registering
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cattle Management</Text>
      <TextInput
        placeholder="Search by Name"
        style={styles.searchInput}
      />
      <ScrollView style={styles.content}>
        {cattleList.map((cattle, index) => (
          <CattleDetails key={index} cattle={cattle} />
        ))}
        </ScrollView>
        <TouchableOpacity
        style={styles.registerNewButton}
        onPress={() => setIsRegisterVisible(true)} // Set to true when button is pressed
      >
        <Text style={styles.buttonText}>Register New Cattle</Text>
        <RegisterNewCattle isVisible={isRegisterVisible} onRegister={handleRegisterCattle} />
      </TouchableOpacity>
        <CattleSummary cattleList={cattleList} />
       {/*  <GenerateStatement /> */}
       <TouchableOpacity style={styles.generateButton}><Text style={styles.buttonText}>GENERATE STATEMENTS</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    color:'black',
    fontWeight:'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor:'red',
    
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  content: {
    marginBottom: 16,
  },
  card: {
    padding: 20,
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  deleteButton: {
    backgroundColor: 'lightcoral',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  buttonText: {
    textAlign: 'center',
    color:'black',
    fontWeight:'bold',
  },
  registerButton: {
    backgroundColor: 'lightblue',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  generateButton: {
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
 searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  registerNewButton: {
    backgroundColor: '#E1E9F0',

    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CattleScreen;
