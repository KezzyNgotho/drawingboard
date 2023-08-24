import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../components/firebase';
import {Alert} from 'react-native';
import {Card} from 'react-native-elements';

const MilkScreen = () => {
  const [femaleCattle, setFemaleCattle] = useState([]);
  const [isCollectingMilk, setIsCollectingMilk] = useState(false);
  const [cattleData, setCattleData] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [dailyProduction, setDailyProduction] = useState(0);
  const [weeklyProduction, setWeeklyProduction] = useState(0);
  const [thisMonthProduction, setThisMonthProduction] = useState(0);
  const [todayProduction, setTodayProduction] = useState(0);
  const [thisWeekProduction, setThisWeekProduction] = useState(0);
  const [isUsageModalVisible, setUsageModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // To store the selected date
  const [selectedTime, setSelectedTime] = useState([]); // To store the selected time
  const usageCollectionRef = firebase.firestore().collection('usageCollection');
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [pricePerLitre, setPricePerLitre] = useState(''); // State to manage the price input
  const [currentPrice, setCurrentPrice] = useState(0); // State to display the current price from the database

  const [usageData, setUsageData] = useState({
    calves: 0,
    home: 0,
    dairy: 0,
  });
  const [totalUsage, setTotalUsage] = useState({
    home: {today: 0, thisWeek: 0, thisMonth: 0},
    calves: {today: 0, thisWeek: 0, thisMonth: 0},
    dairy: {today: 0, thisWeek: 0, thisMonth: 0},
  });
  const addNewUsageEntry = () => {
    setUsageData([...usageData, 0]);
  };

  const [totalProduction, setTotalProduction] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    selectedCattle: '',
    selectedTime: '',
    milkQuantity: '',
  });
  const userId = firebase.auth().currentUser.uid;
  console.log('User ID:', userId);

  const firestore = firebase.firestore();

  useEffect(() => {
    const fetchAllCattle = async () => {
      try {
        const cattleCollectionRef = firebase.firestore().collection('cattle');
        const querySnapshot = await cattleCollectionRef.get();
        const cattleData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCattleData(cattleData);
      } catch (error) {
        console.error('Error fetching cattle:', error);
      }
    };

    fetchAllCattle();
  }, []);

  // ...

  const handleMilkCollection = async () => {
    if (!userId) {
      return;
    }

    const {date, selectedCattle, selectedTime, milkQuantity} = formData;

    if (!date || !selectedCattle || !selectedTime || !milkQuantity) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    const milkCollectionRef = firestore.collection('milkCollection');

    try {
      const milkData = {
        userId: userId,
        date: date,
        selectedCattle: selectedCattle, // Use formData.selectedCattle
        selectedTime: selectedTime,
        milkQuantity: parseFloat(milkQuantity),
      };

      await milkCollectionRef.add(milkData);

      // Clear the form data after successful submission
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        selectedCattle: '',
        selectedTime: '',
        milkQuantity: '',
      });

      Alert.alert('Success', 'Milk collection recorded successfully!', [
        {
          text: 'OK',
          onPress: () => {
            toggleCollectingMilk();
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding milk collection:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      const milkCollectionRef = firestore.collection('milkCollection');

      // Calculate the start and end dates for the current day
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      // Query the milk collection data for the logged-in user for the current day
      milkCollectionRef
        .where('userId', '==', userId)
        .where('date', '>=', startDate.toISOString().split('T')[0])
        .where('date', '<', endDate.toISOString().split('T')[0])
        .get()
        .then(querySnapshot => {
          const milkCollectionData = querySnapshot.docs.map(doc => doc.data());
          const dailyTotal = milkCollectionData.reduce(
            (total, data) => total + parseFloat(data.milkQuantity),
            0,
          );
          setDailyProduction(dailyTotal);
        })
        .catch(error => {
          console.error('Error fetching milk collection data:', error);
        });
    }
  }, [userId]);

  const fetchMilkProduction = async timePeriod => {
    const milkCollectionRef = firebase.firestore().collection('milkCollection');
    const currentDate = new Date();
    let startDate, endDate;

    if (timePeriod === 'today') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (timePeriod === 'thisWeek') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay(),
      );
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    } else if (timePeriod === 'thisMonth') {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
    }

    console.log('Start Date:', startDate.toISOString());
    console.log('End Date:', endDate.toISOString());

    try {
      const querySnapshot = await milkCollectionRef
        .where('userId', '==', userId)
        .where('date', '>=', startDate.toISOString())
        .where('date', '<', endDate.toISOString())
        .get();

      let totalProduction = 0;

      if (timePeriod === 'today') {
        querySnapshot.docs.forEach(doc => {
          const milkData = doc.data();
          console.log('Milk Data:', milkData);
          totalProduction += parseFloat(milkData.milkQuantity);
        });
        setTodayProduction(totalProduction);
      } else {
        totalProduction = querySnapshot.docs.reduce((total, doc) => {
          const milkData = doc.data();
          return total + parseFloat(milkData.milkQuantity);
        }, 0);

        if (timePeriod === 'thisWeek') {
          setThisWeekProduction(totalProduction);
        } else if (timePeriod === 'thisMonth') {
          setThisMonthProduction(totalProduction);
        }
      }

      console.log(`Total Production (${timePeriod}):`, totalProduction);
    } catch (error) {
      console.error('Error fetching milk production:', error);
    }
  };

  useEffect(() => {
    // Fetch production for today
    fetchMilkProduction('today');

    // Fetch production for this week
    fetchMilkProduction('thisWeek');

    // Fetch production for this month
    fetchMilkProduction('thisMonth');
  }, []);

  const toggleCollectingMilk = () => {
    setIsCollectingMilk(!isCollectingMilk);
  };

  // State to store the selected date
  const [isCalendarVisible, setCalendarVisible] = useState(false); // State to control calendar visibility
  const handleDayPress = day => {
    setSelectedDate(day.dateString); // Update the selected date when a day is pressed
    setCalendarVisible(false); // Close the calendar after selecting a date
  };

  const calculateTotalConsumption = () => {
    const timeMultiplier =
      selectedTime === 'Morning'
        ? 1.0
        : selectedTime === 'Afternoon'
        ? 0.5
        : 0.25;
    return (
      (usageData.calves + usageData.home + usageData.dairy) * timeMultiplier
    );
  };
  const handleSaveUsageData = async () => {
    // Ensure that date and time are selected
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Date and time cannot be empty.');
      return;
    }
  
    // Declare usageDataObject outside the try block
    let usageDataObject;
    let totalDailySales; // Declare totalDailySales here
  
    try {
      // Get the user's ID
      const userId = firebase.auth().currentUser.uid;
  
      // Get references to the usage and sales collections
      const usageCollectionRef = firebase.firestore().collection('usageCollection');
      const salesCollectionRef = firebase.firestore().collection('sales');
  
      // Prepare the usage data object
      usageDataObject = {
        userId: userId,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime, // Update 'time' with the selected time
        calves: parseFloat(usageData.calves),
        home: parseFloat(usageData.home),
        dairy: parseFloat(usageData.dairy),
      };
  
      console.log('Usage Data Object:', usageDataObject);
  
      // Add the usage data to the "usageCollection"
      await usageCollectionRef.add(usageDataObject);
  
      // Fetch the price per dairy unit from the "prices" collection
      const pricesCollectionRef = firebase.firestore().collection('prices');
      const priceSnapshot = await pricesCollectionRef.doc(userId).get();
  
      if (priceSnapshot.exists) {
        const priceData = priceSnapshot.data();
        const pricePerDairyUnit = priceData.dairyPrice; // Replace 'dairyPrice' with your actual price field name
  
        // Calculate the total price for the dairy usage
        totalDailySales = usageDataObject.dairy * pricePerDairyUnit;
  
        // Prepare the sales data object for dairy
        const dairySalesDataObject = {
          userId: userId,
          date: selectedDate.toISOString().split('T')[0],
          liters: usageDataObject.dairy, // Assuming 'dairy' represents liters
          price: totalDailySales, // Use totalDailySales here
          timestamp: new Date().toLocaleString(),
          type: 'Dairy', // Indicate the type of sale (e.g., 'Dairy')
        };
  
        // Add the dairy sales data to the "salesCollection"
        await salesCollectionRef.add(dairySalesDataObject);
  
        console.log('Usage and Dairy Sales data added successfully.');
      } else {
        console.error('Price data not found.');
        Alert.alert('Error', 'Price data not found.');
      }
    } catch (error) {
      console.error('Error adding data:', error);
      Alert.alert('Error', 'Failed to save data.');
    }
  
    // Log the "Total Daily Sales" outside the try-catch block
    console.log('Total Daily Sales:', totalDailySales);
  
    try {
      // Calculate total usage for today, this week, and this month
      const dailyUsage = await calculateTotalUsage('today', usageCollectionRef);
      const weeklyUsage = await calculateTotalUsage('thisWeek', usageCollectionRef);
      const monthlyUsage = await calculateTotalUsage('thisMonth', usageCollectionRef);
  
      // Check if total consumption exceeds total production
      if (
        dailyUsage + usageDataObject.home <= todayProduction &&
        weeklyUsage + usageDataObject.home <= thisWeekProduction &&
        monthlyUsage + usageDataObject.home <= thisMonthProduction &&
        dailyUsage + usageDataObject.calves <= todayProduction &&
        weeklyUsage + usageDataObject.calves <= thisWeekProduction &&
        monthlyUsage + usageDataObject.calves <= thisMonthProduction
      ) {
        // If consumption is within limits, add the usage data
        await usageCollectionRef.add(usageDataObject);
  
        // Close the modal
        setUsageModalVisible(false);
        console.log('Usage data saved successfully.');
        Alert.alert('Success', 'Usage data saved successfully!');
      } else {
        console.error('Total consumption exceeds total production.');
        Alert.alert(
          'Error',
          'Total consumption exceeds total production for today, this week, or this month.'
        );
      }
    } catch (error) {
      console.error('Error handling usage data:', error);
      // You can handle the error here, for example, show an error message to the user
      Alert.alert('Error', 'Failed to save usage data.');
    }
  };
  
  const fetchTotalUsage = async () => {
    const todayHome = await calculateTotalUsage(
      'today',
      'home',
      usageCollectionRef,
    );
    const thisWeekHome = await calculateTotalUsage(
      'thisWeek',
      'home',
      usageCollectionRef,
    );
    const thisMonthHome = await calculateTotalUsage(
      'thisMonth',
      'home',
      usageCollectionRef,
    );

    const todayCalves = await calculateTotalUsage(
      'today',
      'calves',
      usageCollectionRef,
    );
    const thisWeekCalves = await calculateTotalUsage(
      'thisWeek',
      'calves',
      usageCollectionRef,
    );
    const thisMonthCalves = await calculateTotalUsage(
      'thisMonth',
      'calves',
      usageCollectionRef,
    );

    const todayDairy = await calculateTotalUsage(
      'today',
      'dairy',
      usageCollectionRef,
    );
    const thisWeekDairy = await calculateTotalUsage(
      'thisWeek',
      'dairy',
      usageCollectionRef,
    );
    const thisMonthDairy = await calculateTotalUsage(
      'thisMonth',
      'dairy',
      usageCollectionRef,
    );

    setTotalUsage({
      home: {
        today: todayHome,
        thisWeek: thisWeekHome,
        thisMonth: thisMonthHome,
      },
      calves: {
        today: todayCalves,
        thisWeek: thisWeekCalves,
        thisMonth: thisMonthCalves,
      },
      dairy: {
        today: todayDairy,
        thisWeek: thisWeekDairy,
        thisMonth: thisMonthDairy,
      },
    });
  };

  // ...

  const calculateTotalUsage = async (timePeriod, category, collectionRef) => {
    const currentDate = new Date();
    let startDate, endDate;

    if (timePeriod === 'today') {
      // Calculate the start and end dates for today
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      );
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (timePeriod === 'thisWeek') {
      // Calculate the start and end dates for this week
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay(),
      );
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 7);
    } else if (timePeriod === 'thisMonth') {
      // Calculate the start and end dates for this month
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
    }

    try {
      // Query the Firestore collection to fetch relevant documents
      const querySnapshot = await collectionRef
        .where('userId', '==', userId) // Replace 'userId' with your actual field name
        .where('date', '>=', startDate.toISOString())
        .where('date', '<', endDate.toISOString())
        .get();

      let totalUsage = 0;

      // Calculate the total usage based on the fetched documents
      querySnapshot.docs.forEach(doc => {
        const usageData = doc.data();
        totalUsage += parseFloat(usageData[category]);
      });

      console.log(`Total ${category} Usage (${timePeriod}):`, totalUsage);
      return totalUsage;
    } catch (error) {
      console.error(`Error fetching ${category} usage data:`, error);
      return 0;
    }
  };

  // Use useEffect to fetch data when the component mounts or when relevant data changes
  useEffect(() => {
    fetchTotalUsage();
  }, []); // You might want to add dependencies if needed

  const openPriceModal = () => {
    setPriceModalVisible(true);
  };

  // Function to close the price setting modal
  const closePriceModal = () => {
    setPriceModalVisible(false);
  };

  // Function to save the updated price to the database
  const savePriceToDatabase = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
  
      // Reference to the Firestore collections
      const priceCollectionRef = firebase.firestore().collection('prices');
      const salesCollectionRef = firebase.firestore().collection('sales');
  
      // Check if the user already has a price document and fetch the price
      const priceDocSnapshot = await priceCollectionRef.doc(userId).get();
      const setPrice = priceDocSnapshot.exists ? priceDocSnapshot.data().price : 0;
  
      // Create or update the price data for the user
      await priceCollectionRef.doc(userId).set({
        price: parseFloat(pricePerLitre), // Save the set price
      });
  
      // Update the 'currentPrice' state with the new price
      setCurrentPrice(parseFloat(pricePerLitre));
  
      // Check if the user has existing sales data and update it
      const salesQuerySnapshot = await salesCollectionRef
        .where('userId', '==', userId)
        .where('type', '==', 'Dairy') // Adjust this condition as per your data structure
        .get();
  
      salesQuerySnapshot.forEach(async (doc) => {
        const salesDocRef = salesCollectionRef.doc(doc.id);
        const salesData = doc.data();
  
        // Update the sales data with the fetched price
        const updatedAmount = salesData.liters * setPrice;
  
        await salesDocRef.update({
          setPrice: setPrice, // Save the set price in sales
          amount: updatedAmount, // Save the calculated amount in sales
        });
      });
  
      // Close the modal
      closePriceModal();
    } catch (error) {
      console.error('Error saving price to the database:', error);
    }
  };
  
  // Function to fetch the current price from the database
  const fetchPriceFromDatabase = async () => {
    try {
      // Reference to the Firestore collection where you store price data
      const priceCollectionRef = firebase.firestore().collection('prices');

      // Get the user's price document by user ID
      const userPriceDocRef = priceCollectionRef.doc(userId);

      // Fetch the price data
      const docSnapshot = await userPriceDocRef.get();

      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        setCurrentPrice(userData.price);
      } else {
        // Handle the case where the user doesn't have a price document yet
        setCurrentPrice(0); // Set a default price if needed
      }
    } catch (error) {
      console.error('Error fetching price from the database:', error);
    }
  };

  // Fetch the current price when the component mounts
  useEffect(() => {
    fetchPriceFromDatabase();
  }, []);

  const currentHour = new Date().getHours();
  let greeting = '';
  if (currentHour >= 0 && currentHour < 12) {
    greeting = 'Good morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good afternoon!';
  } else {
    greeting = 'Good evening!';
  }
// Pseudo code for updating the "sales" collection
const updateSales = async (userId, litersSold, pricePerLiter) => {
  try {
    const salesCollectionRef = firebase.firestore().collection('sales');
    const saleItem = {
      userId: userId,
      liters: litersSold,
      totalPrice: litersSold * pricePerLiter,
      timestamp: new Date().toLocaleString(),
    };

    await salesCollectionRef.add(saleItem);
  } catch (error) {
    console.error('Error updating sales:', error);
  }
};

// Replace this with your actual data retrieval logic for litersSold
const fetchLitersSold = async () => {
  try {
    // Implement your logic to retrieve the quantity sold (litersSold)
    // For example, you might query a "usage" collection to get this value
    // Ensure you assign the correct value to litersSold here
    const litersSold = 10; // Replace this with your data retrieval logic
    return litersSold;
  } catch (error) {
    console.error('Error fetching litersSold:', error);
    return 0; // Default to 0 if there's an error
  }
};

// Call this function whenever a new "milkUsage" under "dairy" is added or updated
const handleMilkUsageUpdate = async () => {
  const userId = firebase.auth().currentUser.uid;
  const pricePerLiter = parseFloat(pricePerLiter); // Ensure pricePerLiter is a valid number

  // Fetch the current quantity sold (litersSold)
  const litersSold = await fetchLitersSold();

  if (litersSold > 0) {
    // Now, you can call the updateSales function to record the sale
    updateSales(userId, litersSold, pricePerLiter);
  }
};

// Calculate sales based on fetched data
const calculateSales = () => {
  if (pricePerLiter && totalQuantityUsage.today) {
    const todayTotal = totalQuantityUsage.today; // This is your litersSold value
    const totalSales = parseFloat(pricePerLiter) * todayTotal;
    setSales(totalSales);

    // Call handleMilkUsageUpdate to update sales when a new "milkUsage" is added or updated
    handleMilkUsageUpdate();

    const saleItem = {
      liters: todayTotal,
      price: parseFloat(pricePerLiter),
      timestamp: new Date().toLocaleString(),
    };
    setSalesList([saleItem, ...salesList]);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          {/* Add back button icon */}
        </TouchableOpacity>
        <Text style={styles.greeting}>{greeting}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          {/* Collect Milk Button */}
          <TouchableOpacity
            style={styles.collectButton}
            onPress={toggleCollectingMilk}>
            <Text style={styles.collectButtonText}>Collect Milk</Text>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setUsageModalVisible(true)}>
              <Text style={styles.buttonText}>Usage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                /* Handle sell */
              }}>
              <Text style={styles.buttonText}>Bluetooth</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.setPriceButton}
            onPress={openPriceModal}>
            <Text style={styles.setPriceButtonText}>Set Price</Text>
          </TouchableOpacity>
          <Text style={styles.setPriceButtonText}>
            Current Price Per Litre: Ksh {currentPrice.toFixed(2)}
          </Text>
        </View>
        <View style={styles.card}>
          {/* Total Production Summary */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Total Production Summary</Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.usageLabel}>Today:</Text>
                <Text style={styles.summaryValue}>
                  {todayProduction || 0} Litres
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.usageLabel}>This Week:</Text>
                <Text style={styles.summaryValue}>
                  {thisWeekProduction || '0'} Litres
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.usageLabel}>This Month:</Text>
                <Text style={styles.summaryValue}>
                  {' '}
                  {thisMonthProduction || '0'} Litres
                </Text>
              </View>
            </View>
          </View>

          {/* Total Usage Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Total Usage Summary</Text>
            <View style={styles.usageCard}>
              <View style={styles.usageRow}>
                {/* Consumption */}
                <View style={styles.card1}>
                  <Text style={styles.usageLabel}>Home</Text>
                  <Text style={styles.usageValue}>
                    Today:{totalUsage.home.today}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Week:{totalUsage.home.thisWeek}{' '}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Month:{totalUsage.home.thisMonth}
                  </Text>
                </View>

                {/* Calves */}
                <View style={styles.card1}>
                  <Text style={styles.usageLabel}>Calves</Text>
                  <Text style={styles.usageValue}>
                    Today: {totalUsage.calves.today}{' '}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Week: {totalUsage.calves.thisWeek}{' '}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Month: {totalUsage.calves.thisMonth}{' '}
                  </Text>
                </View>

                {/* Dairy */}
                <View style={styles.card1}>
                  <Text style={styles.usageLabel}>Dairy</Text>
                  <Text style={styles.usageValue}>
                    Today:{totalUsage.dairy.today}{' '}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Week:{totalUsage.dairy.thisWeek}
                  </Text>
                  <Text style={styles.usageValue}>
                    This Month:{totalUsage.dairy.thisMonth}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* Download Statements Section */}
        <TouchableOpacity style={styles.StatementsButton}>
          <Text style={styles.StatementsButttonText}>Download Statements</Text>
          {/* Add content and download buttons */}
        </TouchableOpacity>
      </ScrollView>
      {/* Milk Collection Modal */}

      <Modal visible={isCollectingMilk} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Card containerStyle={styles.cardContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleCollectingMilk}>
              {/* Add close icon */}
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Collect Milk</Text>

            {/* Date Picker */}
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
                      const dateString = selectedDate
                        .toISOString()
                        .split('T')[0];
                      setFormData(prevData => ({
                        ...prevData,
                        date: dateString,
                      }));
                    }
                  } else {
                    if (selectedDate) {
                      const dateString = selectedDate
                        .toISOString()
                        .split('T')[0];
                      setFormData(prevData => ({
                        ...prevData,
                        date: dateString,
                      }));
                    }
                  }
                }}
              />
            )}

            {/* Cattle Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Cattle:</Text>
              <Picker
                selectedValue={formData.selectedCattle}
                style={styles.picker}
                onValueChange={itemValue =>
                  setFormData(prevData => ({
                    ...prevData,
                    selectedCattle: itemValue,
                  }))
                }>
                {cattleData.map(cattle => (
                  <Picker.Item
                    key={cattle.id}
                    label={cattle.name} // Assuming your cattle data has a 'name' field
                    value={cattle.id} // Assuming your cattle data has a unique identifier
                  />
                ))}
              </Picker>
            </View>

            {/* Time Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Time:</Text>
              <Picker
                selectedValue={formData.selectedTime}
                style={styles.picker}
                onValueChange={itemValue =>
                  setFormData(prevData => ({
                    ...prevData,
                    selectedTime: itemValue,
                  }))
                }>
                <Picker.Item label="Morning" value="Morning" />
                <Picker.Item label="Afternoon" value="Afternoon" />
                <Picker.Item label="Evening" value="Evening" />
                {/* Add more time options as needed */}
              </Picker>
            </View>

            {/* Milk Quantity Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Milk Quantity (gallons):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.milkQuantity}
                onChangeText={text =>
                  setFormData(prevData => ({...prevData, milkQuantity: text}))
                }
              />
            </View>

            {/* Collect Milk Button */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.collectMilkButton}
                onPress={handleMilkCollection}>
                <Text style={styles.collectMilkButtonText}>Collect</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.collectMilkButton1}
                onPress={toggleCollectingMilk}>
                <Text style={styles.collectMilkButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </Modal>
      {/* usage */}
      <Modal visible={isUsageModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Card containerStyle={styles.cardContainer}>
            {/* ... */}
            <Text style={styles.modalTitle}>Record Milk Usage</Text>

            {/* Date Picker */}
            <TouchableOpacity
              onPress={() => setCalendarVisible(true)}
              style={styles.dateInput}>
              <Text>
                {selectedDate
                  ? selectedDate.toISOString().split('T')[0]
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {isCalendarVisible && (
              <DateTimePicker
                value={selectedDate || new Date()} // Default to the current date
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setCalendarVisible(false);
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
              />
            )}

            {/* Time Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Time:</Text>
              <Picker
                selectedValue={selectedTime}
                style={styles.picker}
                onValueChange={itemValue => setSelectedTime(itemValue)}>
                <Picker.Item label="Morning" value="Morning" />
                <Picker.Item label="Afternoon" value="Afternoon" />
                <Picker.Item label="Evening" value="Evening" />
              </Picker>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Calves Usage (gallons):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={usageData.calves.toString()}
                onChangeText={text => {
                  setUsageData({
                    ...usageData,
                    calves: parseFloat(text) || 0,
                  });
                }}
              />
              <Text>Total Consumption: {usageData.calves} gallons</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Home Usage (gallons):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={usageData.home.toString()}
                onChangeText={text => {
                  setUsageData({
                    ...usageData,
                    home: parseFloat(text) || 0,
                  });
                }}
              />
              <Text>Total Consumption: {usageData.home} gallons</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dairy Usage (gallons):</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={usageData.dairy.toString()}
                onChangeText={text => {
                  setUsageData({
                    ...usageData,
                    dairy: parseFloat(text) || 0,
                  });
                }}
              />
              <Text>Total Consumption: {usageData.dairy} gallons</Text>
            </View>
            {/* Error Message */}
            {(!selectedDate || !selectedTime) && (
              <Text style={{color: 'red'}}>Date and time cannot be empty.</Text>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={styles.collectMilkButton}
              onPress={handleSaveUsageData}>
              <Text style={styles.collectMilkButtonText}>Save</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity
              style={styles.collectMilkButton1}
              onPress={() => setUsageModalVisible(false)}>
              <Text style={styles.collectMilkButtonText}>Close</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPriceModalVisible}>
        <View style={styles.modalContainer}>
          <Card containerStyle={styles.cardContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.usageLabel}>Set Price Per Litre</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter price per litre"
                keyboardType="numeric"
                value={pricePerLitre}
                onChangeText={text => setPricePerLitre(text)}
              />
              <Button title="Save Price" onPress={savePriceToDatabase} />
              <Button title="Cancel" onPress={closePriceModal} />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const colors = {
  background: '#F5F6F8', // Light gray
  primary: '#E1E9F0', // Green
  text: '#333333', // Dark gray
  headerBackground: '#E1E9F0', // Dark blue
};

const styles = StyleSheet.create({
  successMessage: {
    backgroundColor: '#4CAF50', // Background color
    color: '#fff', // Text color
    padding: 10, // Padding around the message
    borderRadius: 5, // Border radius for rounded corners
    textAlign: 'center', // Text alignment
    fontWeight: 'bold', // Text weight (bold)
    fontSize: 16, // Text font size
    marginBottom: 10, // Margin at the bottom of the message
  },

  dateInput: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F5F6F8',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6F8',
  },
  calendar: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  picker: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: 'black',
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
  },
  collectMilkButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    width: 130,
    borderRadius: 3,
    marginTop: 20,
    borderColor: 'black',
  },
  collectMilkButton1: {
    backgroundColor: 'black',
    paddingVertical: 10,
    width: 130,
    borderRadius: 3,
    marginTop: 20,
  },

  collectMilkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContainer: {
    width: '90%',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    // Add close icon style
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  cardSection: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  usageColumn: {
    flex: 1,
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
  },
  usageValue: {
    fontSize: 14,
    color: 'green',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.headerBackground,
  },
  backButton: {
    // Add back button styles
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
    color: 'black',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 3,
    elevation: 4,
    padding: 20,
    margin: 20,
    borderColor: 'black',
  },
  card1: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderColor: 'black',
    elevation: 4,
    padding: 10,
    margin: 10,
    width: 90,
  },
  collectButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 1,
    alignSelf: 'center',
    marginBottom: 20,
    borderColor: 'black',
  },
  collectButton1: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  StatementsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  StatementsButttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  collectButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  setPriceButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  setPriceButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Add more styles for additional components
});

export default MilkScreen;
