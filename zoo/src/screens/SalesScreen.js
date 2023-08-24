import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Button, Alert, StyleSheet } from 'react-native';
import { Print } from 'react-native-print';
import moment from 'moment';
import firebase from '../components/firebase' // Import Firebase

const SalesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [summary, setSummary] = useState({ today: 0, week: 0, month: 0 });

  useEffect(() => {
    // Function to fetch sales data from Firestore
    
const fetchSalesData = async () => {
  try {
    const userId = firebase.auth().currentUser.uid;
    const salesCollectionRef = firebase.firestore().collection('sales');

    // Fetch sales data for the user
    const salesQuerySnapshot = await salesCollectionRef.where('userId', '==', userId).get();

    const salesDataArray = [];
    salesQuerySnapshot.forEach((doc) => {
      const salesItem = doc.data();
      const id = doc.id; // Get the document ID as the item's ID
      salesItem.id = id; // Add the ID to the salesItem
      salesDataArray.push(salesItem);
    });

    setSalesData(salesDataArray);

    // Calculate summary
    const today = moment().format('YYYY-MM-DD');
    const thisWeekStart = moment().startOf('week').format('YYYY-MM-DD');
    const thisMonthStart = moment().startOf('month').format('YYYY-MM-DD');

    const todayTotal = salesDataArray
      .filter((item) => item.date === today)
      .reduce((total, item) => total + item.amount, 0);

    const weekTotal = salesDataArray
      .filter((item) => moment(item.date).isSameOrAfter(thisWeekStart))
      .reduce((total, item) => total + item.amount, 0);

    const monthTotal = salesDataArray
      .filter((item) => moment(item.date).isSameOrAfter(thisMonthStart))
      .reduce((total, item) => total + item.amount, 0);

    setSummary({ today: todayTotal, week: weekTotal, month: monthTotal });

  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};
    
    fetchSalesData(); // Call the fetchSalesData function
    
  }, []); // Run this effect only once when the component mounts

  // Rest of your component code remains unchanged...
  useEffect(() => {
    // Function to fetch price data from Firestore
    const fetchPriceData = async () => {
      try {
        const userId = firebase.auth().currentUser.uid;
        const pricesCollectionRef = firebase.firestore().collection('prices');

        // Fetch price data for the user
        const priceDocSnapshot = await pricesCollectionRef.doc(userId).get();

        if (priceDocSnapshot.exists) {
          const priceData = priceDocSnapshot.data();
          const pricePerLitre = priceData.price; // Assuming you have a 'price' field in priceData
          // Calculate the amount based on the fetched price
          const updatedSalesData = salesData.map((item) => ({
            ...item,
            amount: item.liters * pricePerLitre,
          }));
          setSalesData(updatedSalesData);
        }
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData(); // Fetch price data

    // Calculate summary as before
  }, []);


  const handleSearch = () => {
    const filteredData = salesData.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSalesData(filteredData);
  };

  const printStatements = async () => {
    try {
      const response = await Print.printToFile({ html: '<h1>Sales Statements</h1>' });
      if (response) {
        Alert.alert('Printed Successfully', `File saved at ${response.uri}`);
      } else {
        Alert.alert('Printing Failed', 'An error occurred while printing.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Printing Error', 'An error occurred while printing.');
    }
  };

  const renderSalesItem = ({ item }) => (
    <View style={styles.salesItem}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.amount}>Amount: ${item.amount}</Text>
      <Text style={styles.date}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Screen</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.date}>Today:   Ksh: {summary.today}</Text>
        <Text style={styles.date}  >This Week: Ksh: {summary.week}</Text>
        <Text  style={styles.date}>This Month:  Ksh: {summary.month}</Text>
      </View>
      <FlatList
        data={filteredSalesData.length > 0 ? filteredSalesData : salesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSalesItem}
        style={styles.salesList}
      />
      <Button title="Print Statements" onPress={printStatements} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'black'
  },
  searchInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color:'black',
    textDecorationLine:'underline'
  },
  salesList: {
    flex: 1,
  },
  salesItem: {
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    color:'black',
    fontWeight:'bold'
  },
  date: {
    fontSize: 14,
    color: 'green',
    fontWeight:'bold'
  },
});

export default SalesScreen;
