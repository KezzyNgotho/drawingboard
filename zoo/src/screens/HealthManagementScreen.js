import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  editingIndex,
  TouchableOpacity,
  index
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Card} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import {Calendar} from 'react-native-calendars';
import Slider from '@react-native-community/slider';
import firebase from '../components/firebase';

import DateTimePicker from '@react-native-community/datetimepicker';

const HealthManagementScreen = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    eventType: '',
    medicineType: '',
    age: '',
    date: '',
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false); // Add this state for edit mode
  const [editRecordIndex, setEditRecordIndex] = useState(-1); // Add this state to track the index of the record being edited

  // Use the current user's ID for Firestore data
  const userId = firebase.auth().currentUser.uid;

  const handleAddRecord = async () => {
    try {
      if (isEditMode) {
        // Update health record in Firestore if in edit mode
        const recordId = healthRecords[editRecordIndex].id;
        await firebase.firestore().collection('healthRecords').doc(recordId).update({
          ...formData,
        });

        setEditMode(false); // Exit edit mode
      } else {
        // Add health record to Firestore if not in edit mode
        await firebase.firestore().collection('healthRecords').add({
          userId,
          ...formData,
        });
      }

      // Fetch and update the list of health records
      fetchHealthRecords();

      setModalVisible(false);
      setFormData({
        eventType: '',
        medicineType: '',
        age: '',
        date: '',
      });
    } catch (error) {
      console.error('Error adding/editing health record:', error);
    }
  };

  // Rest of your code...

  const handleEdit = (index) => {
    // Set the edit mode and the index of the record being edited
    setEditMode(true);
    setEditRecordIndex(index);

    // Populate the form with the data of the selected health record
    const selectedRecord = healthRecords[index];
    setFormData({
      eventType: selectedRecord.eventType,
      medicineType: selectedRecord.medicineType,
      age: selectedRecord.age,
      date: selectedRecord.date,
    });

    // Show the modal
    setModalVisible(true);
  };

  const handleDelete = async (index) => {
    try {
      if (index >= 0 && index < healthRecords.length) {
        // Get the recordId from the healthRecords array at the specified index
        const recordId = healthRecords[index].id;

        // Delete health record from Firestore
        await firebase.firestore().collection('healthRecords').doc(recordId).delete();

        // Fetch and update the list of health records
        fetchHealthRecords();
      } else {
        console.error('Record not found at index:', index);
      }
    } catch (error) {
      console.error('Error deleting health record:', error);
    }
  };
 
    const [editingIndex, setEditingIndex] = useState(-1); // Initialize with -1 since no record is being edited initially
  
    const fetchHealthRecords = async () => {
      try {
        const snapshot = await firebase
          .firestore()
          .collection('healthRecords')
          .where('userId', '==', userId)
          .get();
  
        const records = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setHealthRecords(records);
      } catch (error) {
        console.error('Error fetching health records:', error);
      }
    };
  
    useEffect(() => {
      fetchHealthRecords();
    }, []);
  



  const isEditing = index === editingIndex;

/*   const [editingStates, setEditingStates] = useState([]); */
  const [index, setIndex] = useState(-1); // Initialize with -1 since no record is being edited initially
 
const openEditModal = (index) => {
  setEditMode(true);
  setEditRecordIndex(index);

  const selectedRecord = healthRecords[index];
  setFormData({
    eventType: selectedRecord.eventType,
    medicineType: selectedRecord.medicineType,
    age: selectedRecord.age,
    date: selectedRecord.date,
  });

  setModalVisible(true);
};
  
  const [editingStates, setEditingStates] = useState([]);
 
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Health Management</Text>

      <View style={styles.recordContainer}>
      <HealthTable
          healthRecords={healthRecords}
          onEditRecord={openEditModal} // Pass the openEditModal function
          onDeleteRecord={handleDelete}
        />
      </View>
      <View style={styles.buttoncontainer}>
        <View style={styles.buttoncontainer}>
        <TouchableOpacity
    style={styles.addButton}
    onPress={() => setModalVisible(true)}>
    <Text style={styles.buttonText}>Add Health Record</Text>
  </TouchableOpacity>
 
        </View>

</View>



      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>
            {isEditing ? 'Edit Health Record' : 'Add Health Record'}
          </Text>
         {/*  <Text style={styles.modalHeader}>Add Health Record</Text> */}
          <Text style={styles.inputLabel}>Event type </Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={formData.eventType}
              onValueChange={value =>
                setFormData(prevData => ({...prevData, eventType: value}))
              }>
              <Picker.Item label="Select Event Type" value="" />
              <Picker.Item label="Vaccination" value="Vaccination" />
              <Picker.Item label="Dipping" value="Dipping" />
              <Picker.Item label="Deworming" value="Deworming" />
              {/* Add more event types as needed */}
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Cattle Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={formData.cattleType}
              onValueChange={value =>
                setFormData(prevData => ({...prevData, cattleType: value}))
              }>
              <Picker.Item label="Select Cattle Type" value="" />
              <Picker.Item label="Milked" value="Milked" />
              <Picker.Item label="Pregnant" value="Pregnant" />
              <Picker.Item
                label="Pregnant and Milked"
                value="Pregnant and Milked"
              />
              <Picker.Item label="Dry Male" value="Dry Male" />
              <Picker.Item label="Calves" value="Calves" />
              <Picker.Item label="Infertile" value="Infertile" />
            </Picker>
          </View>

          <Text style={styles.inputLabel}>Age:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Age range"
            value={formData.age}
            onChangeText={value =>
              setFormData(prevData => ({...prevData, age: value}))
            }
          />

          <Text style={styles.inputLabel}>Dosage:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Dosage"
            value={formData.dosage}
            onChangeText={value =>
              setFormData(prevData => ({...prevData, dosage: value}))
            }
          />

          <Text style={styles.inputLabel}>Medicine Type</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Medicine Type"
            value={formData.medicineType}
            onChangeText={value =>
              setFormData(prevData => ({...prevData, medicineType: value}))
            }
          />

          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity
            onPress={() => setCalendarVisible(true)}
            style={styles.dateInput}>
            <Text>{formData.date || 'Select date'}</Text>
          </TouchableOpacity>
          {isCalendarVisible && (
            <DateTimePicker
              value={new Date()} // Set initial value here
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setCalendarVisible(false);
                  if (selectedDate) {
                    const dateString = selectedDate.toISOString().split('T')[0];
                    setFormData(prevData => ({...prevData, date: dateString}));
                  }
                } else {
                  if (selectedDate) {
                    const dateString = selectedDate.toISOString().split('T')[0];
                    setFormData(prevData => ({...prevData, date: dateString}));
                  }
                }
              }}
            />
          )}

          <View style={styles.buttoncontainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddRecord}>
              <Text style={styles.buttonText}>Add Record</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const HealthTable = ({ healthRecords, onEditRecord, onDeleteRecord }) => {
    const [index, setIndex] = useState(-1); // Initialize with -1 since no record is being edited initially
    const [editingIndex, setEditingIndex] = useState(-1);
    const isEditing = index === editingIndex;


  const toggleEditingState = (index) => {
    const updatedEditingStates = [...editingStates];
    updatedEditingStates[index] = !updatedEditingStates[index];
    setEditingStates(updatedEditingStates);
  };
    return (
      <ScrollView horizontal>
  <View style={styles.table}>
    <View style={styles.tableHeader}>
      <Text style={styles.columnHeader}>Event Type</Text>
      <Text style={styles.columnHeader}>Cattle Type</Text>
      <Text style={styles.columnHeader}>Age</Text>
      <Text style={styles.columnHeader}>Medicine Type</Text>
      <Text style={styles.columnHeader}>Dosage</Text>
      <Text style={styles.columnHeader}>Date</Text>
      <Text style={styles.columnHeader}>Actions</Text>
    </View>
    {healthRecords.map((record, index) => (
      <HealthRow
        key={index}
        record={record}
        index={index}
        onEditRecord={() => onEditRecord(index)}
        onDeleteRecord={() => onDeleteRecord(index)}
      />
    ))}
  </View>
</ScrollView>

       
        
    );
  };
  
  const HealthRow = ({ record, index, onEditRecord, onDeleteRecord }) => {
    const isEditing = index === editingIndex;
  
/*     const [index, setIndex] = useState(-1); */ // Initialize with -1 since no record is being edited initially
const [editingIndex, setEditingIndex] = useState(-1); // Initialize with -1 since no record is being edited initially

  
    return (
      <View style={styles.tableRow}>
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.eventType}
        </Text>
  
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.cattleType}
        </Text>
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.age}
        </Text>
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.medicineType}
        </Text>
  
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.dosage}
        </Text>
  
        <Text style={[styles.columnData, isEditing && styles.editingCell]}>
          {record.date}
        </Text>
        <TouchableOpacity
        style={styles.editButton1}
        onPress={() => onEditRecord(index)}
      >
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDeleteRecord(index)}
      >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  
      
    );
  };
  


  const styles = StyleSheet.create({
    
  
    // Style for the "Delete" button
    
    container: {
      flex: 1,
      backgroundColor: '#F0F0F0',
      padding: 10,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'black',
    },
    recordContainer: {
      marginBottom: 20,
    },
    addButton: {
      backgroundColor: '#40F8FF',
      borderRadius: 8,
      paddingVertical: 10,
      width: '78%', // Adjust button width
      alignSelf: 'center',
      marginBottom: 10,
    },
    addButton1: {
      backgroundColor: '#27AE60',
      borderRadius: 8,
      paddingVertical: 10,
      width: '40', // Adjust button width
      alignSelf: 'center',
      marginBottom: 10,
    },
    editButton1: {
      flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderColor: 'black',
    width: 40, // Reduce the width of the button
    alignSelf: 'center',
    backgroundColor: 'purple',
    borderRadius: 8,
    paddingVertical: 6, 
    marginLeft:20,
    },
  
    // Style for the "Delete" button
    deleteButton: {
      flex: 0.4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e74c3c',
      borderRadius: 8,
      paddingVertical: 6, // Reduce vertical padding
      marginLeft: 5, // Add some margin to separate from the "Edit" button
     
    },
  
    buttonText: {
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      elevation: 25, // Add a shadow effect
    },
    modalHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    
   
    inputLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      color: 'black',
    },
    input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 5,
      width: '100%',
    },
    submitButton: {
      backgroundColor: '#27AE60',
      borderRadius: 8,
      paddingVertical: 10,
      width: '45%', // Adjust button width
      alignSelf: 'center',
      marginTop: 10,
      marginRight: 10,
    },
    closeButton: {
      backgroundColor: 'red',
      borderRadius: 8,
      paddingVertical: 10,
      width: '45%', // Adjust button width
      alignSelf: 'center',
      marginTop: 10,
    },
    closeButton1: {
      backgroundColor: 'red',
      borderRadius: 8,
      paddingVertical: 10,
      width: '40', // Adjust button width
      alignSelf: 'center',
      marginTop: 10,
    },
    table: {
      borderWidth: 1,
      borderColor: 'black',
      marginBottom: 20,
      width: 1000, // Set a fixed width to enable horizontal scrolling
      overflowX: 'scroll', // Enable horizontal scrolling
    },
    
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#f1f8ff',
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderColor: 'black',
    },
    columnHeader: {
      flex: 1,
      fontWeight: 'bold',
      color: 'black',
      textAlign: 'center', // Center-align column headers
    },
    tableRow: {
      flexDirection: 'row',
      paddingHorizontal: 22,
      paddingVertical: 10, // Increase vertical padding
      borderBottomWidth: 1,
      borderColor: 'black',
      // Adjust the width of each row
    },
    columnData: {
      flex: 1,
      borderRightWidth: 3,
      borderColor: 'black',
      paddingRight: 10,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingVertical: 6, // Increase vertical padding
    },
    
    editingCell: {
      backgroundColor: '#f0f0f0',
      
    },
    editButton: {
      flex: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderColor: 'black',
      width: '20%', // Adjust button width
      alignSelf: 'center',
    },
   
    dropdown: {
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 16,
      width: '100%',
    },
    dropdownText: {
      fontSize: 16,
      color: 'black', // Text color of the selected event
      fontFamily: 'YourCustomFont', // Replace with your custom font
    },
    dropdownOptions: {
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 5,
      marginTop: 2,
      width: '40%',
      backgroundColor: '#FFFFFF',
      fontSize: 19, // Background color of the dropdown options
    },
    dateInput: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 5,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    calendar: {
      marginBottom: 15,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      width: '100%',
    },
  
    sliderContainer: {
      marginBottom: 15,
    },
    slider: {
      width: '100%',
    },
    buttoncontainer: {
      flexDirection: 'row',
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#C1C0B9',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      width: '100%',
    },
    picker: {
      /* marginBottom: 10,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 16, */
      width: '100%',
    },
    card: {
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 20,
    },
  
   
   
    
    
   
  });
  
   
  
  


export default HealthManagementScreen;
