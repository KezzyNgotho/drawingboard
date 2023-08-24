import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView,Image } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';

const ExpenseScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2023-08-01', description: 'Groceries', amount: 50 },
    { id: 2, date: '2023-08-02', description: 'Gas', amount: 30 },
    // ... other initial expenses
  ]);
  useEffect(() => {
    // Get the currently authenticated user
    const user = firebase.auth().currentUser;
  
    if (user) {
      const userId = user.uid;
      const expensesCollection = firebase.firestore().collection('expenses');
  
      // Query expenses for the current user
      expensesCollection
        .where('userId', '==', userId)
        .get()
        .then((querySnapshot) => {
          const fetchedExpenses = [];
  
          querySnapshot.forEach((doc) => {
            fetchedExpenses.push(doc.data());
          });
  
          // Update the expenses state with fetched data
          setExpenses(fetchedExpenses);
        })
        .catch((error) => {
          console.error('Error fetching expenses:', error.message);
        });
    }
  }, []);
  
  const [newExpenseDescription, setNewExpenseDescription] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [showNewExpenseFields, setShowNewExpenseFields] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleAddExpense = () => {
    if (newExpenseDescription && newExpenseAmount) {
      const user = firebase.auth().currentUser;
  
      if (user) {
        const userId = user.uid;
        const newExpense = {
          userId, // Associate the expense with the current user
          id: expenses.length + 1,
          date: selectedDate,
          description: newExpenseDescription,
          amount: parseFloat(newExpenseAmount),
        };
  
        // Save the new expense to Firestore
        const expensesCollection = firebase.firestore().collection('expenses');
        expensesCollection.add(newExpense)
          .then(() => {
            // Update the local expenses state with the new expense
            setExpenses([...expenses, newExpense]);
            setNewExpenseDescription('');
            setNewExpenseAmount('');
            setShowNewExpenseFields(false);
          })
          .catch((error) => {
            console.error('Error adding expense:', error.message);
          });
      }
    }
  };
  

  const handleSearch = () => {
    const filteredExpenses = expenses.filter(expense =>
      moment(expense.date).isSame(selectedDate, 'day') && expense.description.includes(searchText)
    );
    setSearchResults(filteredExpenses);
  };

  const totalMonthExpense = expenses.reduce((total, expense) => {
    if (moment(expense.date).isSame(selectedDate, 'month')) {
      return total + expense.amount;
    }
    return total;
  }, 0);
  const handleonCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
       <TouchableOpacity style={styles.backButton}  onPress={handleonCancel}>
       <Image source={require('../assets/icons8-back-64.png')} style={styles.logo} resizeMode="contain" />
        </TouchableOpacity>
      <Text style={styles.header}>Expense Tracker</Text>

      {!showNewExpenseFields ? (
        <TouchableOpacity
          style={styles.addExpenseButton}
          onPress={() => setShowNewExpenseFields(true)}
        >
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.newExpenseContainer}>
          <TextInput
            style={styles.newExpenseInput}
            placeholder="Expense Description"
            value={newExpenseDescription}
            onChangeText={setNewExpenseDescription}
          />
          <TextInput
            style={styles.newExpenseInput}
            placeholder="Amount"
            keyboardType="numeric"
            value={newExpenseAmount}
            onChangeText={setNewExpenseAmount}
          />
          <TouchableOpacity style={styles.addExpenseButton} onPress={handleAddExpense}>
            <Text style={styles.buttonText}>Save Expense</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.totalText}>Total Expenses for Month: ${totalMonthExpense}</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by description"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
  data={searchResults.length > 0 ? searchResults : expenses.filter(expense =>
    moment(expense.date).isSame(selectedDate, 'month')
  )}
  renderItem={({ item }) => (
    <View style={styles.expenseItem}>
      <Text style={styles.totalText}>{item.date}</Text>
      <Text   style={styles.totalText}>{item.description}</Text>
      <Text   style={styles.totalText}>${item.amount}</Text>
    </View>
  )}
  keyExtractor={(item) => item.id.toString()}
/>
       {/*  renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <Text>{item.date}</Text>
            <Text>{item.description}</Text>
            <Text>${item.amount}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      /> */}

      <TouchableOpacity style={styles.printButton}>
        <Text style={styles.buttonText}>Print Statement</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 34,
   height: 34, 
  marginLeft:0, // Added marginRight for spacing
 },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color:'black',
  },
  newExpenseContainer: {
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
  },
  newExpenseInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
  },
  addExpenseButton: {
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color:'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#3498DB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 5,
  },
  printButton: {
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ExpenseScreen;
