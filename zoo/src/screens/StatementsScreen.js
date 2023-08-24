import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput,Button } from 'react-native';
import firebase from '../components/firebase'; // Import Firebase

const StatementsScreen = () => {
  const [salesStatements, setSalesStatements] = useState([]);
  const [expenseStatements, setExpenseStatements] = useState([]);
  const [searchDate, setSearchDate] = useState('');

  const calculateBalance = (statements) => {
    return statements.reduce((total, statement) => total + statement.amount, 0);
  };

  const filteredSalesStatements = salesStatements.filter(
    (statement) => !searchDate || statement.date === searchDate
  );

  const filteredExpenseStatements = expenseStatements.filter(
    (statement) => !searchDate || statement.date === searchDate
  );

  useEffect(() => {
    // Fetch financial statements for the logged-in user
    const fetchStatements = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userId = user.uid;
          
          // Fetch sales statements
          const salesCollection = await firebase.firestore().collection('sales')
            .where('userId', '==', userId)
            .get();
          const salesData = salesCollection.docs.map(doc => doc.data());
          console.log('Sales Statements:', salesData);
          setSalesStatements(salesData);
          
          // Fetch expense statements
          const expenseCollection = await firebase.firestore().collection('expenses')
            .where('userId', '==', userId)
            .get();
          const expenseData = expenseCollection.docs.map(doc => doc.data());
          console.log('Expense Statements:', expenseData);
          setExpenseStatements(expenseData);
        }
      } catch (error) {
        console.error('Error fetching statements:', error);
      }
    };
    

    fetchStatements();
  }, []); // Fetch statements when the component mounts

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Statements</Text>
      <TextInput
        style={styles.dateSearchInput}
        placeholder="Search by date (YYYY-MM-DD)"
        value={searchDate}
        onChangeText={setSearchDate}
      />
      <ScrollView style={styles.statementsContainer}>
        <Text style={styles.statementType}>Sales Statements</Text>
        {filteredSalesStatements.map((statement) => (
          <View key={statement.id} style={styles.statementItem}>
            <View style={styles.statementInfo}>
              <Text style={styles.statementDate}>{statement.date}</Text>
            </View>
            <Text
              style={[
                styles.statementAmount,
                { color: 'green' },
              ]}>
              +${Math.abs(statement.amount).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <Text style={styles.statementType}>Expense Statements</Text>
        {filteredExpenseStatements.map((statement) => (
          <View key={statement.id} style={styles.statementItem}>
            <View style={styles.statementInfo}>
              <Text style={styles.statementDate}>{statement.date}</Text>
            </View>
            <Text
              style={[
                styles.statementAmount,
                { color: 'red' },
              ]}>
              -${Math.abs(statement.amount).toFixed(2)}
            </Text>
          </View>
        ))}
       <Button
  title="Generate Statements"
 /*  onPress={generateStatements} */
  color="#007AFF" // Set the background color of the button
  style={styles.generateButton} // Apply custom styles
/>

      </ScrollView>
      <Text style={styles.totalBalance}>Total Sales: ${calculateBalance(salesStatements).toFixed(2)}</Text>
      <Text style={styles.totalBalance}>Total Expenses: ${calculateBalance(expenseStatements).toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  dateSearchInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#C1C0B9',
    borderRadius: 5,
  },
  statementsContainer: {
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#007AFF', // Background color
    color: 'white', // Text color
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
    marginTop:80,
  },
  statementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statementInfo: {
    flex: 1,
  },
  statementType: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statementDate: {
    fontSize: 14,
    color: 'black',
    fontWeight:'bold',
  },
  statementAmount: {
    fontSize: 16,
  },
  totalBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default StatementsScreen;
