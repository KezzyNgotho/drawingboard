import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Card } from 'react-native-elements';
import firebase from '../components/firebase';
import CustomAlert from '../components/CustomAlert';

const TaskReminderScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);

  const user = firebase.auth().currentUser; // Get the current authenticated user

  const firestore = firebase.firestore();
  const tasksCollection = firestore.collection('tasks');

  // Function to fetch tasks for the logged-in user
  const fetchTasks = async () => {
    if (user) {
      try {
        // Fetch tasks for the logged-in user only
        const snapshot = await tasksCollection.where('userId', '==', user.uid).get();

        const fetchedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks from Firestore:', error);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]); // Fetch tasks when the user changes

  const handleAddTask = async () => {
    if (taskText && selectedDate && user) {
      try {
        const task = {
          text: taskText,
          date: selectedDate,
          completed: false,
          userId: user.uid, // Associate task with the logged-in user
        };

        // Check if the selected date is in the past
        const currentDate = new Date();
        const selectedTaskDate = new Date(selectedDate);

        if (selectedTaskDate < currentDate) {
          Alert.alert('Error', 'Selected date is in the past. Cannot add this task.');
          return; // Prevent adding tasks for past dates
        }

        // Add the task to Firestore
        await tasksCollection.add(task);

        setTaskText('');
        setSelectedDate('');
        setModalVisible(false);
        setCustomAlertMessage('Task added successfully.');
        setCustomAlertVisible(true);
        // Fetch updated tasks
        fetchTasks();
      } catch (error) {
        Alert.alert('Error', 'Error adding task to Firestore: ' + error.message);
      }
    }
  };

  const handleEditTask = (index) => {
    setEditingIndex(index);
    const taskToEdit = tasks[index];
    setTaskText(taskToEdit.text);
    setSelectedDate(taskToEdit.date);
    setModalVisible(true);
  };
  

  const handleDeleteTask = async (taskId) => {
    try {
      // Delete the task from Firestore using the task's ID
      await tasksCollection.doc(taskId).delete();
  
      // Fetch updated tasks
      fetchTasks();
  
      // Close the modal and reset editingIndex
      setEditingIndex(-1);
      setModalVisible(false);
      setCustomAlertMessage('Task deleted successfully.');
      setCustomAlertVisible(true);
    } catch (error) {
      setCustomAlertMessage('Error deleting task from Firestore: ' + error.message);
      setCustomAlertVisible(true);
    }
  };
  
  
  
// Fetch tasks when the user or tasks collection changes

  const toggleTaskCompletion = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };


  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [customAlertVisible, setCustomAlertVisible] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState('');


 
  return (
    <View style={styles.container}>
         <Text style={styles.header}>Tasks and Reminders</Text>
        <Card>
   
    <ScrollView style={styles.taskContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.taskItemContainer}>
            <View style={styles.taskItem}>
              <TouchableOpacity
                style={[
                  styles.taskItemContent,
                  task.completed && styles.completedTask,
                ]}
                onPress={() => toggleTaskCompletion(index)}>
                <Text style={styles.taskText}>{task.text}</Text>
                <Text style={styles.dateText}>Date: {task.date}</Text>
              </TouchableOpacity>
              <View style={styles.editDeleteButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditTask(index)}>
                  <Text style={styles.buttonText1}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
  style={styles.deleteButton}
  onPress={() => handleDeleteTask(task.id)}>
  <Text style={styles.buttonText}>Delete</Text>
</TouchableOpacity>

              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingIndex(-1);
            setModalVisible(true);
          }}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
      </View>
      
      <Modal visible={isModalVisible} animationType="slide">
      
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>
            {editingIndex !== -1 ? 'Edit Task' : 'Add Task'}
          </Text>
          <Card style={styles.Card1}>
          <TextInput
            style={styles.input}
            placeholder="Enter task text"
            value={taskText}
            onChangeText={setTaskText}
          />
          <Text style={styles.inputLabel}>Date</Text>
          <TouchableOpacity
            onPress={() => setCalendarVisible(true)}
            style={styles.dateInput}>
            <Text style={styles.dateText}>
              {selectedDate || 'Select date'}
            </Text>
          </TouchableOpacity>
          {isCalendarVisible && (
            <DateTimePicker
              value={selectedDate ? new Date(selectedDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  const dateString = selectedDate.toISOString().split('T')[0];
                  setSelectedDate(dateString);
                }
                setCalendarVisible(false);
              }}
            />
          )}
          <View style={styles.buttonContainer1}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              if (editingIndex !== -1) {
                const updatedTasks = [...tasks];
                updatedTasks[editingIndex].text = taskText;
                updatedTasks[editingIndex].date = selectedDate;
                setTasks(updatedTasks);
                setEditingIndex(-1);
              } else {
                handleAddTask();
              }
            }}>
            <Text style={styles.buttonText}>
              {editingIndex !== -1 ? 'Save Task' : 'Add Task'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setTaskText('');
              setSelectedDate('');
              setEditingIndex(-1);
              setModalVisible(false);
            }}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          
          </View>
          </Card>
        </View>
      </Modal>
      </Card>
      <CustomAlert
        visible={customAlertVisible}
        message={customAlertMessage}
        onClose={() => setCustomAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
      
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  taskContainer: {
    marginBottom: 20,
  },
  taskItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskItem: {
    flex: 1,
    backgroundColor: '#E1E9F0',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#C1C0B9',
    borderRadius: 5,
  },
  completedTask: {
    backgroundColor: 'white',
  },
  taskText: {
    fontSize: 16,
    color:'black',
    fontWeight:'bold',
  },
  dateText: {
    fontSize: 14,
    marginTop: 5,
    color: 'black',
    fontWeight:'bold',
  },
  editDeleteButtons: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 5,
    width:100,
    marginTop:19,
    marginRight:75,
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
    width:100,
    marginTop:19,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  buttonContainer1: {
    alignItems: 'flex-end',
    flexDirection:'row',
  },
  addButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    width:100,
    marginTop:19,
    marginRight:75,
  
   
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width:130,
    marginTop:19,
    marginRight:75,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    width:130,
    marginTop:19,
   
  },
  taskButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  taskButton: {
    flex: 1,
    paddingVertical: 5,
   
    borderRadius: 5,
    alignItems: 'center',
    width:180,
  },
  Card1:{
  color:'blue',
  }
});

export default TaskReminderScreen;
