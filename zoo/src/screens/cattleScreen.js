import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,Image, ScrollView ,RadioButton} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';
import RegisterNewCattle from '../components/RegisterNewCattle';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';




  const CattleDetails = ({ cattle,setCattleList }) => {
    if (!cattle) {
      return null;
    }
 
 
  const navigation = useNavigation();

  const handleEditDetails = () => {
    navigation.navigate('CattleDetails', { cattle });
  };
  
  const handleDeleteCattle = async (cattleId) => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const cattleRef = firebase.firestore().collection('cattle').doc(cattleId);
        await cattleRef.delete();
        // After successful deletion, update your local cattleList state to remove the deleted cattle.
        setCattleList((prevCattleList) => prevCattleList.filter((cattle) => cattle.id !== cattleId));
      } else {
        console.log('No user found.');
      }
    } catch (error) {
      console.error('Error deleting cattle:', error.message);
    }
  };


  return (
    <View style={styles.card}>
      
      <Text style={styles.header}>Cattle Details</Text>
      <Text style={styles.buttonText}>Name: {cattle.name}</Text>
      <Text style={styles.buttonText}>ID: {cattle.id}</Text>
      <Text style={styles.buttonText}>Age: {cattle.age}</Text>
      <Text style={styles.buttonText}>Breed: {cattle.breed}</Text>
      <Text style={styles.buttonText}>Gender: {cattle.isMale ? 'Male' : 'Female'}</Text>
      <Text style={styles.buttonText}>Pregnant: {cattle.isPregnant ? 'Yes' : 'No'}</Text>
      <Text style={styles.buttonText}>Fertile: {cattle.isFertile ? 'Yes' : 'No'}</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.editButton} onPress={handleEditDetails}>
        <Text style={styles.buttonText1}>Edit Details</Text>
      </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCattle(cattle.id)}>
          <Text style={styles.buttonText1}>Delete Cattle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CattleSummary = ({ cattleList }) => {
  const maleCount = cattleList.filter(cattle => cattle.isMale).length;
  const femaleCount = cattleList.filter(cattle => !cattle.isMale).length;
  const pregnantCount = cattleList.filter(cattle => cattle.isPregnant).length;
  const infertileCount = cattleList.filter(cattle => !cattle.isFertile).length;

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Cattle Summary</Text>
      <Text style={styles.buttonText}>Total Cattle: {cattleList.length}</Text>
      <Text style={styles.buttonText}>Male: {maleCount}</Text>
      <Text style={styles.buttonText}>Female: {femaleCount}</Text>
      <Text style={styles.buttonText}>Pregnant: {pregnantCount}</Text>
      <Text style={styles.buttonText}>Infertile: {infertileCount}</Text>
    </View>
  );
};

const GenerateStatement = () => {
  const handleGenerateStatement = () => {
    // Generate and show the statement
    // You can use a library or custom logic to generate the statement
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Generate Statement</Text>
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateStatement}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};

const CattleScreen = () => {
  const [cattleList, setCattleList] = useState([]); // Initialize as an empty array
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);
  const navigation = useNavigation();

  const handleRegisterCattle = (newCattle) => {
    setCattleList([...cattleList, newCattle]);
    setIsRegisterVisible(false);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const filteredCattle = cattleList.filter(cattle =>
    cattle.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchCattleData = async () => {
      try {
        const user = firebase.auth().currentUser;
        console.log('Current User:', user);
  
        if (user) {
          const cattleCollection = firebase.firestore().collection('cattle');
          const querySnapshot = await cattleCollection.where('userId', '==', user.uid).get();
          const fetchedCattle = querySnapshot.docs.map(doc => doc.data());
  
          console.log('Fetched cattle data:', fetchedCattle);
  
          // Update cattleList with fetched data
          setCattleList(fetchedCattle);
        } else {
          console.log('No user found.');
        }
      } catch (error) {
        console.error('Error fetching cattle data:', error.message);
      }
    };
  
    // Call the function to fetch cattle data
    fetchCattleData();
  }, []); // Empty dependency array to fetch data only once when the component mounts
 
  


  const handleonCancel = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handleonCancel}> 
       <Image source={require('../assets/icons8-back-64.png')} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.header}>Cattle Management</Text>
      </View>
      
      <View style={styles.searchInputContainer}>
        <TextInput
          placeholder="Search by Name"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')}>
        <Image source={require('../assets/icons8-search-50.png')} resizeMode="contain" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        {cattleList.map((cattle, index) => (
        <CattleDetails key={index} cattle={cattle} setCattleList={setCattleList} />

        ))}
        </ScrollView>
        <TouchableOpacity
        style={styles.registerNewButton}
        onPress={() => setIsRegisterVisible(true)} // Set to true when button is pressed
      >
        <Text style={styles.buttonText1}>Register New Cattle</Text>
       {/*  <RegisterNewCattle isVisible={isRegisterVisible} onRegister={handleRegisterCattle} /> */}
       <RegisterNewCattle
  isVisible={isRegisterVisible}
  onRegister={handleRegisterCattle}
  onCancel={handleonCancel}
  cattleList={cattleList}
  setCattleList={setCattleList}
/>

      
      </TouchableOpacity>
        <CattleSummary cattleList={cattleList} />
        
       {/*  <GenerateStatement /> */}
       <TouchableOpacity style={styles.generateButton}><Text style={styles.buttonText1}>GENERATE STATEMENTS</Text></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
     width: 34,
    height: 34, 
   marginLeft:0, // Added marginRight for spacing
  },
  headerContainer: {
    flexDirection: 'row',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              alignItems: 'center', 
    paddingHorizontal: 1,
    backgroundColor: 'white',
  },

  buttonText: {
    textAlign: 'center',
    color:'black',
    fontWeight:'bold',
  },
 
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'black',
   
  },
 /*  searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
    color:'black',
    marginBottom: 16,
  }, */
  searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 10,
    color:'black',
    marginBottom: 10,
    width: '100%', // Adjust the width as needed
  },
  
  content: {
    marginBottom: 16,
  },
  card: {
    padding: 20,
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    marginBottom: 20,
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  deleteButton: {
    backgroundColor: 'lightcoral',
    borderRadius: 8,
    padding: 10,
    width: '48%',
  },
  buttonText: {
  
    color:'black',
    fontWeight:'bold',
  },
  buttonText1: {
    textAlign: 'center',
    color:'black',
    fontWeight:'bold',
  },
  registerButton: {
    backgroundColor: 'lightblue',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  generateButton: {
    backgroundColor: '#E1E9F0',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
 searchInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width:310,
  },
  searchInputContainer: {
    borderWidth: 0, // Change this from 1 to 0
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  registerNewButton: {
    backgroundColor: '#E1E9F0',

    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default CattleScreen;
