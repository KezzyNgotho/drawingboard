import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';
// ... (other imports and code)

const EditCattleDetailsScreen = ({ route }) => {
  const { cattleId } = route.params; // Use cattleId passed as a parameter
  const [editedCattle, setEditedCattle] = useState({});
  const navigation = useNavigation();
  const firestore = firebase.firestore();

  useEffect(() => {
    const fetchCattleData = async () => {
      try {
        const user = firebase.auth().currentUser;
        console.log('Current User:', user);

        if (user) {
          const cattleCollection = firestore.collection('cattle');
          const docRef = cattleCollection.doc(cattleId); // Use cattleId to fetch the cattle document
          const docSnapshot = await docRef.get();

          if (docSnapshot.exists) {
            const cattleData = docSnapshot.data();
            setEditedCattle({ ...cattleData, id: cattleId }); // Include the ID in the editedCattle object
          } else {
            console.log('Cattle document not found. Cattle ID:', cattleId);
          }
        } else {
          console.log('No user found.');
        }
      } catch (error) {
        console.error('Error fetching cattle data:', error.message);
      }
    };

    // Call the function to fetch cattle data
    fetchCattleData();
  }, [cattleId, firestore]);

  const handleSaveEditedCattleDetails = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const cattleCollection = firestore.collection('cattle');
        console.log('Cattle ID:', cattleId);
// Use cattleId to fetch the cattle document

        const docRef = cattleCollection.doc(cattleId); // Use cattleId to update the specific cattle document

        // Remove the 'id' field from editedCattle to avoid updating it
        const { id, ...editedData } = editedCattle;

        // Update the cattle document with the editedCattle data
        await docRef.update(editedData);
        console.log('Document updated successfully.');

        // Navigate to the CattleDetails screen with the updated cattle details
        navigation.navigate('CattleDetails', { cattle: editedCattle });
      }
    } catch (error) {
      console.error('Error updating cattle details:', error.message);
    }
  };

  const handleClose = () => {
    // Handle closing the screen without saving
    navigation.navigate('CattleDetails', { cattle: editedCattle });
  };
 

  
  
  const handleSaveHealthDetails = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Implement logic to save health details to Firebase here
        // You can use a similar approach as saving cattle details
        console.log('Health details saved successfully.');
      }
    } catch (error) {
      console.error('Error saving health details:', error.message);
    }
  };

  /* const handleClose = () => {
    // Handle saving edited cattle details
    // You can use an API call or state management library to update the cattle details
    console.log('Edited Cattle Details:', editedCattle);
    // Navigate to CattleDetailsScreen
    navigation.navigate('CattleDetails', { cattle: editedCattle });
  }; */

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
            value={editedCattle.age ? editedCattle.age.toString() : ''}
            onChangeText={(value) =>
              setEditedCattle({ ...editedCattle, age: parseInt(value) || 0 })
            }
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
          <Text style={styles.checkboxLabel}>
            {editedCattle.isMale ? 'Male' : 'Female'}
          </Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fertile:</Text>
          <CheckBox
            value={editedCattle.isFertile}
            onValueChange={(value) =>
              setEditedCattle({ ...editedCattle, isFertile: value })
            }
          />
          <Text style={styles.checkboxLabel}>
            {editedCattle.isFertile ? 'Fertile' : 'Not Fertile'}
          </Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pregnant:</Text>
          <CheckBox
            value={editedCattle.isPregnant}
            onValueChange={(value) =>
              setEditedCattle({ ...editedCattle, isPregnant: value })
            }
          />
          <Text style={styles.checkboxLabel}>
            {editedCattle.isPregnant ? 'Pregnant' : 'Not Pregnant'}
          </Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleClose}>
          <Text style={styles.buttonText1}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveEditedCattleDetails}>
          <Text style={styles.buttonText1}>Save Edited Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveHealthDetails}>
          <Text style={styles.buttonText1}>Save Health Details</Text>
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
