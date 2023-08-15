import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,  ScrollView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
const EditCattleDetailsScreen = ({ route }) => {
  const { cattle } = route.params;
  const [editedCattle, setEditedCattle] = useState(cattle);
  const navigation = useNavigation();
  const handleSaveEditedCattleDetails = () => {
    // Handle saving edited cattle details
    // You can use an API call or state management library to update the cattle details
    console.log('Edited Cattle Details:', editedCattle);
    // Navigate to CattleDetailsScreen
    navigation.navigate('CattleDetails', { cattle: editedCattle });
  };
  const handleClose = () => {
    // Handle saving edited cattle details
    // You can use an API call or state management library to update the cattle details
    console.log('Edited Cattle Details:', editedCattle);
    // Navigate to CattleDetailsScreen
    navigation.navigate('CattleDetails', { cattle: editedCattle });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display input fields for editing cattle details */}
      <View style={styles.card}>
        <Text style={styles.header}>Edit Cattle Details</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editedCattle.name}
            onChangeText={(value) => setEditedCattle({ ...editedCattle, name: value })}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={editedCattle.age.toString()}
            onChangeText={(value) => setEditedCattle({ ...editedCattle, age: parseInt(value) })}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Breed:</Text>
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={editedCattle.breed}
            onChangeText={(value) => setEditedCattle({ ...editedCattle, breed: value })}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender:</Text>
          <CheckBox
            value={editedCattle.isMale}
            onValueChange={(value) => setEditedCattle({ ...editedCattle, isMale: value })}
          />
          <Text style={styles.checkboxLabel}>{editedCattle.isMale ? 'Male' : 'Female'}</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fertile:</Text>
          <CheckBox
            value={editedCattle.isFertile}
            onValueChange={(value) => setEditedCattle({ ...editedCattle, isFertile: value })}
          />
          <Text style={styles.checkboxLabel}>{editedCattle.isFertile ? 'Fertile' : 'Not Fertile'}</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pregnant:</Text>
          <CheckBox
            value={editedCattle.isPregnant}
            onValueChange={(value) => setEditedCattle({ ...editedCattle, isPregnant: value })}
          />
          <Text style={styles.checkboxLabel}>{editedCattle.isPregnant ? 'Pregnant' : 'Not Pregnant'}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleClose}>
          <Text style={styles.buttonText1}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEditedCattleDetails}>
          <Text style={styles.buttonText1}>Save Edited Details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  inputGroup: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    flex: 1,
  },
  checkboxLabel: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EditCattleDetailsScreen;
