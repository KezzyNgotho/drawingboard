import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList, TouchableOpacity,Image} from 'react-native';
import Modal from 'react-native-modal';
import CalendarPicker from 'react-native-calendar-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const MilkScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [cattle, setCattle] = useState('');
  const [time, setTime] = useState('');
  const [milkProduced, setMilkProduced] = useState('');
  const [milkUsage, setMilkUsage] = useState('');
  const [milkRecords, setMilkRecords] = useState([]);
  const [visibleIcons, setVisibleIcons] = useState(4); // Maximum number of visible icons in the row
  const [showAllModal, setShowAllModal] = useState(false);

  const handleAddRecord = () => {
    setModalVisible(true);
  };

  const handleRecordMilk = () => {
    // Save milk production and usage records to state
    const newRecord = {
      cattle,
      date: selectedDate.toISOString().split('T')[0],
      time,
      milkProduced: milkProduced !== '' ? parseFloat(milkProduced) : 0,
      milkUsage: milkUsage !== '' ? parseFloat(milkUsage) : 0,
    };
    setMilkRecords((prevRecords) => [...prevRecords, newRecord]);
    // Reset input fields after recording
    setCattle('');
    setSelectedDate(null);
    setTime('');
    setMilkProduced('');
    setMilkUsage('');
    setModalVisible(false);
  };

  const totalProduced = milkRecords.reduce((acc, record) => acc + record.milkProduced, 0);
  const totalUsage = milkRecords.reduce((acc, record) => acc + record.milkUsage, 0);

  const iconsData = [
    { image: require('../assets/icons8-week-40.png'),label:'This Week' },
    { image: require('../assets/icons8-month-48.png'), label: 'This Month' },
    { image: require('../assets/icons8-add-50.png'), label: 'New Records' },
    { image: require('../assets/icons8-sales-50.png'), label: 'Sales' },
  ];
  
  const renderIconItem = ({ item }) => (
    <TouchableOpacity style={styles.iconContainer}>
      <Image source={item.image} style={styles.iconImage} resizeMode="contain" />
      <Text style={styles.iconLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
  
  const renderAllIcons = ({ item }) => (
    <TouchableOpacity style={styles.iconContainer}>
      <Image source={item.image} style={styles.iconImage} resizeMode="contain" />
      <Text style={styles.iconLabel}>{item.label}</Text>
    </TouchableOpacity>
  );
  
  const toggleShowAllModal = () => {
    setShowAllModal(true);
  };

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
      <View style={styles.totalContainer}>
        <View>
        <Text style={[styles.totalText, styles.whiteText]}>Production Today: {totalProduced} liters</Text>
        </View>
       
        <Text style={[styles.totalText, styles.whiteText]}>Usage Today: {totalUsage} liters</Text>
      </View>

       {/* Container for Icons */}
       <View style={styles.iconsContainer}>
        {iconsData.slice(0, visibleIcons).map((item, index) => (
          <TouchableOpacity key={index} style={styles.iconContainer}>
            <Image source={item.image} style={styles.iconImage} resizeMode="contain" />
            <Text style={styles.iconLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {iconsData.length > visibleIcons && (
          <TouchableOpacity style={styles.moreIconContainer} onPress={toggleShowAllModal}>
            <Image source={require('../assets/icons8-more-25.png')} style={styles.moreIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
      </View>

      {/* Reports */}
      <View style={styles.reportsContainer}>
        <Text>REPORTS</Text>
        {/* Add your report components here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor:'white'
  },
  iconImage: {
    width: 48,
    height: 48,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F8', // Set the background color to black
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black', // Set text color to white
  },
  totalText: {
    fontSize: 16,
    color: 'black', // Set text color to white
  },
  iconLabel: {
    marginTop: 8,
    color: 'black',
    fontSize: 16,
    fontWeight:'bold',
    // Set text color to white
  },
  
  totalContainer: {
    marginBottom: 20,
    flexDirection:'row',
  },
  whiteText: {
    color: 'black',
    fontWeight:'bold', // Set text color to white
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 24,
  },
  iconLabel: {
    marginTop: 8,
  },
  moreIconContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  allIconsContainer: {
    justifyContent: 'center',
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
  flatListsContainer: {
    flex: 1,
    marginBottom: 16, 
    backgroundColor: '#f9f9f9',// Add some margin to separate the reports container
  },
  reportsContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9', // Set background color for the reports container
  },
});

export default MilkScreen;
