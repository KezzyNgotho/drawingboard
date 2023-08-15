import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const HealthDetailsForm = ({ onSave }) => {
    const [healthCondition, setHealthCondition] = useState('');
    const [treatmentDate, setTreatmentDate] = useState(new Date());
    const [status, setStatus] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const handleSaveHealthDetails = () => {
      // Save health details to backend or state
      const newHealthDetail = {
        healthCondition,
        treatmentDate,
        status,
      };
      onSave(newHealthDetail); // Call the parent component's onSave function
      // Clear input fields
      setHealthCondition('');
      setTreatmentDate(new Date());
      setStatus('');
    };
  
    const handleDateChange = (event, selectedDate) => {
      if (event.type === 'dismissed') {
        setShowDatePicker(false);
      } else {
        setShowDatePicker(false);
        if (selectedDate) {
          setTreatmentDate(selectedDate);
        }
      }
    };
  
    return (
      <View style={styles.card}>
        <Text style={styles.header}>Health Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Health Condition"
          value={healthCondition}
          onChangeText={setHealthCondition}
        />
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text>{`Last Day of Treatment: ${treatmentDate.toDateString()}`}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DatePicker
            value={treatmentDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()} // Optional, to restrict selecting future dates
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={status}
          onChangeText={setStatus}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveHealthDetails}>
          <Text style={styles.buttonText1}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const CattleDetailsScreen = ({ route }) => {
    const { cattle } = route.params;
    const [showHealthForm, setShowHealthForm] = useState(false);
    const [healthDetails, setHealthDetails] = useState([]); // Added state for health details
    const [showEditForm, setShowEditForm] = useState(false); // New state for edit form
   
    const [editedCattle, setEditedCattle] = useState(cattle); // New state for edited cattle
    const navigation = useNavigation();
  
  
    const handleShowHealthForm = () => {
      setShowHealthForm(!showHealthForm);
    };
    const handleEditDetails = () => {
      // Navigate to EditCattleDetailsScreen with the selected cattle details as params
      navigation.navigate('EditCattleDetails', { cattle });
    };
  
    const handleSaveCattleDetails = () => {
      // Handle saving edited cattle details
      setEditedCattle({
        ...editedCattle,
        // Update edited fields here
      });
      setShowEditForm(false);
    };
    const handleSaveHealthDetails = (newHealthDetail) => {
      setHealthDetails([...healthDetails, newHealthDetail]);
    };
    const handleClose = () => {
      // Navigate back to CattleDetailsScreen
      navigation.navigate('Cattle', { cattle: editedCattle });
    };
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* ... (other cattle details) */}
        <View style={styles.card}>
        <Text style={styles.header}>Cattle Details</Text>
        <Text style={styles.buttonText}>Name: {cattle.name}</Text>
        <Text style={styles.buttonText}>Age: {cattle.age}</Text>
        <Text style={styles.buttonText}>Breed: {cattle.breed}</Text>
        <Text style={styles.buttonText}>Gender: {cattle.isMale ? 'Male' : 'Female'}</Text>
        <Text style={styles.buttonText}>Pregnant: {cattle.isPregnant ? 'Yes' : 'No'}</Text>
        <Text style={styles.buttonText}>Fertile: {cattle.isFertile ? 'Yes' : 'No'}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditDetails}>
            <Text style={styles.buttonText1}>Edit Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleClose}>
          <Text style={styles.buttonText1}>Close</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.editButton} onPress={handleShowHealthForm}>
            <Text style={styles.buttonText1}>Health Details</Text>
          </TouchableOpacity>
         
        </View>
      </View>
        {showHealthForm && <HealthDetailsForm onSave={handleSaveHealthDetails} />}
  
        {/* Display health details */}
        {healthDetails.map((detail, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.header}>Health Detail</Text>
            <Text style={styles.buttonText}>Condition: {detail.healthCondition}</Text>
            <Text style={styles.buttonText}>Treatment Date: {detail.treatmentDate.toDateString()}</Text>
            <Text style={styles.buttonText}>Status: {detail.status}</Text>
          </View>
        ))}
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
  // ... (rest of your styles)
  datePicker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default CattleDetailsScreen;
