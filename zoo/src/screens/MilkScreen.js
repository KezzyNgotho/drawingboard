import React, {useState}from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView,Modal,TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
const MilkScreen = () => {

  const [isCollectingMilk, setIsCollectingMilk] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCattle, setSelectedCattle] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [milkQuantity, setMilkQuantity] = useState('');

  const toggleCollectingMilk = () => {
    setIsCollectingMilk(!isCollectingMilk);
  };

  const handleMilkCollection = () => {
    // Logic to handle milk collection and record details
    // You can use the selectedDate, selectedCattle, and milkQuantity here
    toggleCollectingMilk();
  };

  const currentHour = new Date().getHours();
  let greeting = '';
  if (currentHour >= 0 && currentHour < 12) {
    greeting = 'Good morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good afternoon!';
  } else {
    greeting = 'Good evening!';
  }

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
          <TouchableOpacity style={styles.collectButton} onPress={toggleCollectingMilk}>
            <Text style={styles.collectButtonText}>Collect Milk</Text>
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={() => {/* Handle usage */}}>
              <Text style={styles.buttonText}>Usage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {/* Handle sell */}}>
              <Text style={styles.buttonText}>Sell</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.setPriceButton} onPress={() => {/* Handle set price */}}>
            <Text style={styles.setPriceButtonText}>Set Price</Text>
          </TouchableOpacity>
        </View>
      <View style={styles.card}>
      {/* Total Production Summary */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Total Production Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Today:</Text>
            <Text style={styles.summaryValue}>XXX gallons</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>This Week:</Text>
            <Text style={styles.summaryValue}>XXX gallons</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>This Month:</Text>
            <Text style={styles.summaryValue}>XXX gallons</Text>
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
              <Text style={styles.usageValue}>Today: XXX </Text>
              <Text style={styles.usageValue}>This Week: XXX </Text>
              <Text style={styles.usageValue}>This Month: XXX </Text>
            </View>

            {/* Calves */}
            <View style={styles.card1}>
              <Text style={styles.usageLabel}>Calves</Text>
              <Text style={styles.usageValue}>Today: XXX </Text>
              <Text style={styles.usageValue}>This Week: XXX </Text>
              <Text style={styles.usageValue}>This Month: XXX </Text>
            </View>

            {/* Dairy */}
            <View style={styles.card1}>
              <Text style={styles.usageLabel}>Dairy</Text>
              <Text style={styles.usageValue}>Today: XXX </Text>
              <Text style={styles.usageValue}>This Week: XXX </Text>
              <Text style={styles.usageValue}>This Month: XXX </Text>
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
    <TouchableOpacity style={styles.closeButton} onPress={toggleCollectingMilk}>
      {/* Add close icon */}
    </TouchableOpacity>
    <Text style={styles.modalTitle}>Collect Milk</Text>
   {/*  <Calendar
      onDayPress={(day) => setSelectedDate(day.dateString)}
      // Customize calendar appearance here
    /> */}

    {/* Cattle Selection */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Select Cattle:</Text>
      <Picker
        selectedValue={selectedCattle}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCattle(itemValue)}
      >
        <Picker.Item label="Rahab" value="Rahab" />
        <Picker.Item label="Lesly" value="Lesly" />
        {/* Add more cattle options as needed */}
      </Picker>
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Select Time:</Text>
      <Picker
        selectedValue={selectedTime}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
      >
        <Picker.Item label="Morning" value="Morning" />
        <Picker.Item label="Afternoon" value="Afternoon" />
        <Picker.Item label="Evening" value="Evening" />
        {/* Add more cattle options as needed */}
      </Picker>
    </View>
    {/* Milk Quantity Input */}
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>Milk Quantity (gallons):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={milkQuantity}
        onChangeText={(text) => setMilkQuantity(text)}
      />
    </View>

    {/* Collect Milk Button */}
    <TouchableOpacity style={styles.collectMilkButton} onPress={handleMilkCollection}>
      <Text style={styles.collectMilkButtonText}>Collect</Text>
    </TouchableOpacity>
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
    color:'black',
  },
  picker: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    borderWidth: 4,
    borderColor:'black',
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
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  collectMilkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
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
  },
  usageValue: {
    fontSize: 14,
    color: colors.text,
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
    color:'black',
    fontStyle:'italic',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 4,
    padding: 20,
    margin: 20,
    
  },
  card1: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    elevation: 4,
    padding: 10,
    margin: 10,
    width:90,
  },
  collectButton: {
    backgroundColor: colors.primary,
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
