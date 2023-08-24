import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import firebase from '../components/firebase';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigation = useNavigation();
  const [totalCows, setTotalCows] = useState(null);
  useEffect(() => {
    // Fetch user profile data from Firestore when the component mounts
    const fetchUserProfile = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userId = user.uid;
          const userDoc = await firebase.firestore().collection('users').doc(userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserProfile(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    // Fetch "Total Cows" data from the Firestore "cattle" collection
    const fetchTotalCows = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userId = user.uid;
          const cattleDoc = await firebase.firestore().collection('cattle').doc(userId).get();
          if (cattleDoc.exists) {
            const cattleData = cattleDoc.data();
            // Check if totalCows is null or undefined and provide a default value if necessary
            setTotalCows(cattleData?.totalCows || 'N/A');
          } else {
            // Handle the case where the document doesn't exist
            setTotalCows('N/A');
          }
        }
      } catch (error) {
        console.error('Error fetching Total Cows data:', error);
        // Handle the error here
        setTotalCows('N/A');
      }
    };
  
    fetchUserProfile();
    fetchTotalCows(); // Call the function to fetch Total Cows data
  }, []);
  

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedData({
      displayName: userProfile.displayName || '',
      age: userProfile.age || '',
      location: userProfile.location || '',
      interests: userProfile.interests || '',
      farmSize: userProfile.farmSize || '',
    });
  };

  const handleSaveProfile = async () => {
    // Update user profile with editedData
    const user = firebase.auth().currentUser;
    if (user) {
      const userId = user.uid;
      await firebase.firestore().collection('users').doc(userId).update({
        displayName: editedData.displayName,
        age: editedData.age,
        location: editedData.location,
        interests: editedData.interests,
        farmSize: editedData.farmSize,
      });

      // Update local state with edited data
      setUserProfile({
        ...userProfile,
        displayName: editedData.displayName,
        age: editedData.age,
        location: editedData.location,
        interests: editedData.interests,
        farmSize: editedData.farmSize,
      });

      setIsEditing(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card containerStyle={styles.cardContainer}>
        {userProfile && (
          <>
            <Image
              source={{ uri: userProfile.profileImage || 'https://media.geeksforgeeks.org/wp-content/uploads/20220608214420/galaryImage5-300x300.png' }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{userProfile.displayName || ''}</Text>
            <Text style={styles.email}>{userProfile.email || ''}</Text>
          </>
        )}

        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <InfoRow label="Age" value={isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.age || ''}
              onChangeText={(text) => setEditedData({ ...editedData, age: text })}
            />
          ) : (
            userProfile?.age || 'N/A'
          )} />

          <InfoRow label="Location" value={isEditing ? (
            <TextInput
              style={styles.input}
              value={editedData.location || ''}
              onChangeText={(text) => setEditedData({ ...editedData, location: text })}
            />
          ) : (
            userProfile?.location || 'N/A'
          )} />

<InfoRow label="Total Cows" value={isEditing ? (
  <TextInput
    style={styles.input}
    value={editedData.totalCows || ''}
    onChangeText={(text) => setEditedData({ ...editedData, totalCows: text })}
  />
) : (
  totalCows !== null ? totalCows : 'N/A'
)} /> 

        </View>

        <Divider style={styles.divider} />

        <Text style={styles.sectionHeader}>Dairy Information</Text>

        <View style={styles.dairyInfoContainer}>
        <InfoRow label="Total Cows" value={totalCows !== null ? totalCows : 'N/A'} />

        <InfoRow label="Milk Production" value={isEditing ? (
  <TextInput
    style={styles.input}
    value={editedData.milkProduction || ''}
    onChangeText={(text) => setEditedData({ ...editedData, milkProduction: text })}
  />
) : (
  userProfile?.milkProduction || 'N/A'
)} />

<InfoRow label="Farm Size" value={isEditing ? (
  <TextInput
    style={styles.input}
    value={editedData.farmSize || ''}
    onChangeText={(text) => setEditedData({ ...editedData, farmSize: text })}
  />
) : (
  userProfile?.farmSize || 'N/A'
)} />

        </View>

        <Divider style={styles.divider} />

        {isEditing ? (
          <Button title="Save Profile" onPress={handleSaveProfile} />
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </Card>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    {typeof value === 'string' ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      value
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: 'green',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#DDD',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  infoValue: {
    flex: 2,
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    textDecorationLine: 'underline',
  },
  dairyInfoContainer: {
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
  },
});

export default ProfileScreen;
