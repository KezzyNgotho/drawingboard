import React from 'react';
import { View, Text, StyleSheet, Image,TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import WeatherCard from '../components/WeatherCard';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
// Add a function to handle button presses
const handleButton1Press = () => {
  // Code to execute when Button 1 is pressed
  console.log('Button 1 pressed!');
};

const handleButton2Press = () => {
  // Code to execute when Button 2 is pressed
  console.log('Button 2 pressed!');
};

  // Sample data for the grouped bar chart
  const summaryData = [
    { name: 'Milk', quantity: 255, color: '#FF5733' },     // Red color for Milk
    { name: 'Cattle', quantity: 175, color: '#33FF69' },   // Green color for Cattle
    { name: 'Expenses', quantity: 130, color: '#337EFF' }, // Blue color for Expenses
    { name: 'Sales', quantity: 90, color: '#FF33C2' },     // Pink color for Sales
  ];
  const temperature = 25; // in Celsius
  const humidity = 65; // in percentage
  const wind = 15;// in km/h
  const precipitation = 5; 
  const isFavorableForCattle = true; // Modify this based on your weather conditions

  return (
    <View style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        {/* Farm Logo and Name */}
        <View style={styles.farmInfoContainer}>
          <Image source={require('../assets/gardening.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.farmName}>Farm Name</Text>
        </View>

        {/* Notification Menu and User Profile */}
        <View style={styles.notificationContainer}>
          <Image source={require('../assets/active.png')} style={styles.icon} resizeMode="contain" />
          <Image source={require('../assets/menu.png')} style={styles.icon} resizeMode="contain" />
          <Image source={require('../assets/user.png')} style={styles.icon} resizeMode="contain" />
        </View>
      </View>
 {/* Quick Access Buttons */}

 <View   style={styles.buttonContainer1}>
  
 <TouchableOpacity style={styles.buttonContainer}
 onPress={() => navigation.navigate('Milk')}>
            <Text style={styles.buttonText}>Milk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}
          onPress={() => navigation.navigate('cattle')}>
            <Text style={styles.buttonText}>Cattle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}
          onPress={() => navigation.navigate('Expenses')}>
            <Text style={styles.buttonText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}
         onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.buttonText}>Sales</Text>
          </TouchableOpacity>
 </View>
 {/* Weather Card */}
 <WeatherCard
        temperature={temperature}
        humidity={humidity}
        wind={wind}
        precipitation={precipitation}
        isFavorableForCattle={isFavorableForCattle}
      />
  {/* Pie Chart */}
  <View style={styles.chartContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <PieChart
          data={summaryData}
          width={300}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="quantity"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>


    
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 6,
  },
  buttonContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Text color for the buttons
    marginLeft: 10, // Spacing between the buttons
  },
  container: {
    flex: 1,
    backgroundColor: '#D3D3D3',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  farmInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  farmName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});
export default HomeScreen;