import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';
import DatePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';
import EditCattleDetailsForm from '../components/EditCatleDetailsForm'; // Replace with the correct path


const HealthDetailsForm = ({ onSave, cattleId,onCloseForm }) => {
  const [healthCondition, setHealthCondition] = useState('');
  const [treatmentDate, setTreatmentDate] = useState(new Date());
  const [status, setStatus] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [healthDetails, setHealthDetails] = useState([]);

  useEffect(() => {
    // Fetch health details for the current cattle using cattleId
    const fetchHealthDetails = async () => {
      try {
        const healthDetailsCollection = firebase
          .firestore()
          .collection('healthDetails');
  
        const querySnapshot = await healthDetailsCollection
          .where('cattleId', '==', cattleId)
          .get();
  
        const fetchedHealthDetails = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedHealthDetails.push(data);
        });
  
        setHealthDetails(fetchedHealthDetails);
      } catch (error) {
        console.error('Error fetching health details:', error.message);
      }
    };
  
    fetchHealthDetails();
  }, [cattleId]);
  
  // ...
  

  const handleSaveHealthDetails = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Create a reference to the health details collection
        const healthDetailsCollection = firebase.firestore().collection('healthDetails');

        // Define the data to be saved
        const newHealthDetail = {
          userId: user.uid,
          cattleId: cattleId,
          healthCondition,
          treatmentDate,
          status,
        };

        // Save the data to Firestore
        await healthDetailsCollection.add(newHealthDetail);

        // Call the parent onSave function to update the health details list
        onSave(newHealthDetail);

        // Update the local health details state (setHealthDetails function)
        setHealthDetails((prevHealthDetails) => [...prevHealthDetails, newHealthDetail]);

        // Clear the form fields
        setHealthCondition('');
        setTreatmentDate(new Date());
        setStatus('');

        // Close the form
        onCloseForm();

        // Show a success message
        Alert.alert('Success', 'Health details saved successfully');
      } else {
        console.log('No user found.');
      }
    } catch (error) {
      console.error('Error saving health details:', error.message);
      // Show an error message
      Alert.alert('Error', 'Failed to save health details. Please try again later.');
    }
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

  const [healthDetails, setHealthDetails] = useState([]);
  const [editedCattle, setEditedCattle] = useState(null); // Track edited cattle separately
  const [showHealthForm, setShowHealthForm] = useState(false);
  const navigation = useNavigation();
  const handleGenerateStatements = () => {
    // Replace this with your statement generation logic
    // For example, you can fetch data and generate statements here
    // Then, display an alert or navigate to another screen to show the generated statements.
    Alert.alert('Generate Statements', 'Statements generated successfully.');
  };

  useEffect(() => {
    const fetchHealthDetails = async () => {
      try {
        const healthDetailsCollection = firebase.firestore().collection('healthDetails');

        const querySnapshot = await healthDetailsCollection
          .where('cattleId', '==', cattle.id)
          .get();

        const fetchedHealthDetails = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedHealthDetails.push(data);
        });

        setHealthDetails(fetchedHealthDetails);
      } catch (error) {
        console.error('Error fetching health details:', error.message);
      }
    };

    fetchHealthDetails();
  }, [cattle.id]);
  const handleSaveHealthDetails = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        // Create a reference to the health details collection
        const healthDetailsCollection = firebase.firestore().collection('healthDetails');

        // Define the data to be saved
        const newHealthDetail = {
          userId: user.uid,
          cattleId: cattleId,
          healthCondition,
          treatmentDate,
          status,
        };

        // Save the data to Firestore
        await healthDetailsCollection.add(newHealthDetail);

        // Call the parent onSave function to update the health details list
        onSave(newHealthDetail);

        // Update the local health details state (setHealthDetails function)
        setHealthDetails((prevHealthDetails) => [...prevHealthDetails, newHealthDetail]);
      } else {
        console.log('No user found.');
      }
    } catch (error) {
      console.error('Error saving health details:', error.message);
    }
  };


  useEffect(() => {
    // Fetch health details for the current cattle here
    // You can use a similar approach as fetching cattle details
  }, [cattle.id]); // Update when the cattle ID changes

  const handleSaveCattleDetails = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user && editedCattle) {
        // Use the cattle ID to reference the cattle document
        const cattleRef = firebase.firestore().collection('cattle').doc(cattle.id);
  
        // Check if the document exists
        const doc = await cattleRef.get();
        if (doc.exists) {
          // The document exists, so it's safe to update it.
          await cattleRef.update(editedCattle);
  
          // Navigate back to the previous screen
          navigation.goBack();
        } else {
          console.error('Cattle document does not exist:', cattle.id);
          // Handle the case where the document doesn't exist, e.g., show an error message.
        }
      } else {
        console.log('No user found or editedCattle is null.');
      }
    } catch (error) {
      console.error('Error updating cattle details:', error.message);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText1}>Back</Text>
        </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.header}>Cattle Details</Text>
        {editedCattle ? ( // Render edit fields if editedCattle is not null
          <>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editedCattle.name}
              onChangeText={(text) =>
                setEditedCattle({ ...editedCattle, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Age"
              value={String(editedCattle.age)}
              onChangeText={(text) =>
                setEditedCattle({ ...editedCattle, age: Number(text) })
              }
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={editedCattle.breed}
              onChangeText={(text) =>
                setEditedCattle({ ...editedCattle, breed: text })
              }
            />
            <Text style={styles.buttonText}>
              Gender: {editedCattle.isMale ? 'Male' : 'Female'}
            </Text>
            <Text style={styles.buttonText}>
              Pregnant: {editedCattle.isPregnant ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.buttonText}>
              Fertile: {editedCattle.isFertile ? 'Yes' : 'No'}
            </Text>
          </>
        ) : (
          // Render static fields if editedCattle is null
          <>
            <Text style={styles.buttonText}>Name: {cattle.name}</Text>
            <Text style={styles.buttonText}>Age: {cattle.age}</Text>
            <Text style={styles.buttonText}>Breed: {cattle.breed}</Text>
            <Text style={styles.buttonText}>
              Gender: {cattle.isMale ? 'Male' : 'Female'}
            </Text>
            <Text style={styles.buttonText}>
              Pregnant: {cattle.isPregnant ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.buttonText}>
              Fertile: {cattle.isFertile ? 'Yes' : 'No'}
            </Text>
          </>
        )}
        <View style={styles.buttonContainer}>
          {editedCattle ? ( // Render Save button if in edit mode
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleSaveCattleDetails}
            >
              <Text style={styles.buttonText1}>Save Cattle Details</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditedCattle({ ...cattle })} // Enter edit mode
            >
              <Text style={styles.buttonText1}>Edit Details</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowHealthForm(!showHealthForm)} // Toggle health form
          >
            <Text style={styles.buttonText1}>Health Details</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showHealthForm && ( // Render the health form when showHealthForm is true
       <HealthDetailsForm
       onSave={handleSaveHealthDetails}
       cattleId={cattle.id}
       setHealthDetails={setHealthDetails}
       onCloseForm={() => setShowHealthForm(false)}
     />
     
      )}
    {healthDetails.map((detail, index) => (
  <View key={index} style={styles.card}>
    <Text style={styles.header}>Health Detail</Text>
    <Text style={styles.buttonText}>Condition: {detail.healthCondition}</Text>
    {detail.treatmentDate && (
      <Text style={styles.buttonText}>
        Treatment Date: {new Date(detail.treatmentDate.seconds * 1000).toDateString()}
      </Text>
    )}
    <Text style={styles.buttonText}>Status: {detail.status}</Text>


  </View>
      ))}

<TouchableOpacity
          style={styles.editButton}
          onPress={handleGenerateStatements}
        >
          <Text style={styles.buttonText1}>Generate Statements</Text>
        </TouchableOpacity>
    </ScrollView>
  

  );
};
 

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#E74C3C', // Custom background color
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start', // Align button to the start (left) of the container
    marginTop: 0,
    marginBottom:9,
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
  },
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
