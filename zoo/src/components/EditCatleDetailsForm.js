import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firebase from '../components/firebase';

const EditCattleDetailsForm = ({ cattle, onSave }) => {
  const [editedCattle, setEditedCattle] = useState({ ...cattle });
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const handleSave = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (user) {
        const cattleRef = firebase.firestore().collection('cattle').doc(cattle.id);

        await cattleRef.update(editedCattle);

        onSave(editedCattle);

        setIsSuccessMessageVisible(true);

        setTimeout(() => {
          setIsSuccessMessageVisible(false);
        }, 5000); // Hide the success message after 5 seconds (adjust as needed)
      } else {
        console.log('No user found.');
      }
    } catch (error) {
      console.error('Error updating cattle details:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Cattle Details</Text>
      <Text style={styles.label}>Cattle ID:</Text>
      <TextInput
        style={styles.readOnlyInput}
        value={cattle.id}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={editedCattle.name}
        onChangeText={(value) => setEditedCattle({ ...editedCattle, name: value })}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={editedCattle.age ? editedCattle.age.toString() : ''}
        onChangeText={(value) =>
          setEditedCattle({ ...editedCattle, age: parseInt(value) || 0 })
        }
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={editedCattle.breed}
        onChangeText={(value) => setEditedCattle({ ...editedCattle, breed: value })}
      />
      <View style={styles.genderContainer}>
        <Text style={styles.label}>Gender:</Text>
        <TouchableOpacity
          style={styles.genderButton}
          onPress={() => setEditedCattle({ ...editedCattle, isMale: true })}
        >
          <Text style={styles.genderButtonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.genderButton}
          onPress={() => setEditedCattle({ ...editedCattle, isMale: false })}
        >
          <Text style={styles.genderButtonText}>Female</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Pregnant:</Text>
        <TouchableOpacity
          style={styles.checkboxButton}
          onPress={() => setEditedCattle({ ...editedCattle, isPregnant: true })}
        >
          <Text style={styles.checkboxButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxButton}
          onPress={() => setEditedCattle({ ...editedCattle, isPregnant: false })}
        >
          <Text style={styles.checkboxButtonText}>No</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <Text style={styles.label}>Fertile:</Text>
        <TouchableOpacity
          style={styles.checkboxButton}
          onPress={() => setEditedCattle({ ...editedCattle, isFertile: true })}
        >
          <Text style={styles.checkboxButtonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.checkboxButton}
          onPress={() => setEditedCattle({ ...editedCattle, isFertile: false })}
        >
          <Text style={styles.checkboxButtonText}>No</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      {isSuccessMessageVisible && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Cattle details updated successfully!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  readOnlyInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#F4F4F4',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3498DB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genderButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#3498DB',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#3498DB',
  },
  checkboxButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  successMessage: {
    backgroundColor: '#27AE60',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  successText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EditCattleDetailsForm;
