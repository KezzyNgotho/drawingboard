import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity ,ScrollView} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  // Get the current date
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentDay = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Determine the greeting based on the current hour
  let greeting = '';
  if (currentHour >= 0 && currentHour < 12) {
    greeting = 'Good morning!!';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good afternoon!!';
  } else {
    greeting = 'Good evening!!';
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <View style={styles.farmInfoContainer}>
          <Image source={require('../assets/icons8-farm-40.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.farmName}>Farm Name</Text>
        </View>
        <View style={styles.notificationContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Image source={require('../assets/icons8-bell-50.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Image source={require('../assets/icons8-menu-50.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../assets/icons8-user-48.png')} style={styles.icon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Greeting */}
      <Text style={styles.greetingContainer}>
  <Text style={styles.greeting}>{`${greeting}`}</Text>
  {/* <Text style={styles.currentDay}>{` ${currentDay}`}</Text> */}
</Text>

      {/* Quick Access Buttons */}
      <View style={styles.card}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Milk')}>
            <Image source={require('../assets/icons8-drink-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Collect Milk</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Cattle')}>
            <Image source={require('../assets/cow.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>My Cattle</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Expenses')}>
            <Image source={require('../assets/icons8-low-price-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Sales')}>
            <Image source={require('../assets/icons8-sales-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Sales</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Statements')}>
            <Image source={require('../assets/icons8-financial-statements-64.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Statements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Analytics')}>
            <Image source={require('../assets/icons8-analytics-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Analytics</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Feed')}>
            <Image source={require('../assets/icons8-dog-bowl-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Feed Management</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Health')}>
            <Image source={require('../assets/icons8-health-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Health Management</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Tasks')}>
            <Image source={require('../assets/icons8-task-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Tasks & Reminders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAccessButton} onPress={() => navigation.navigate('Settings')}>
            <Image source={require('../assets/icons8-settings-50.png')} style={styles.icon} resizeMode="contain" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
        {/* Add more buttons here as needed */}
      </View>
    </ScrollView>
  );

  
};
const colors = {
  background: '#E1E9F0', // Cool light gray
  primary: '#4CAF50', // Green
  text: '#333333', // Dark gray
};

const styles = StyleSheet.create({
  // ... (existing styles)
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  currentDay: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },


  card: {
    backgroundColor: colors.background,
    borderRadius: 8,
    elevation: 2,
    margin: 16,
    padding: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 75,
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
    width: 33,
    height: 29,
    marginHorizontal: 10,
  },
  quickAccessButton: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
