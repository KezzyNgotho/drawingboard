import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SettingsScreen = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  const [units, setUnits] = useState('Metric');
  const [currency, setCurrency] = useState('USD');
  const [fontSize, setFontSize] = useState('Medium');
  const [autoBackup, setAutoBackup] = useState(true);

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isUnitsModalVisible, setUnitsModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [isFontSizeModalVisible, setFontSizeModalVisible] = useState(false);

  const settingsCollection = firestore().collection('userSettings');

  useEffect(() => {
    // Load user settings from Firestore when the screen mounts
    const loadSettings = async () => {
      try {
        const settingsDoc = await settingsCollection.doc('userSettings').get();
        if (settingsDoc.exists) {
          const data = settingsDoc.data();
          setNotificationEnabled(data.notificationEnabled);
          setDarkModeEnabled(data.darkModeEnabled);
          setLanguage(data.language);
          setUnits(data.units);
          setCurrency(data.currency);
          setFontSize(data.fontSize);
          setAutoBackup(data.autoBackup);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    // Save user settings to Firestore
    try {
      await settingsCollection.doc('userSettings').set({
        notificationEnabled,
        darkModeEnabled,
        language,
        units,
        currency,
        fontSize,
        autoBackup,
      });
      Alert.alert('Settings Saved', 'Your settings have been saved successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again later.');
      console.error('Error saving settings:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationEnabled}
          onValueChange={(value) => setNotificationEnabled(value)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={(value) => setDarkModeEnabled(value)}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Language</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setLanguageModalVisible(true)}>
          <Text style={styles.settingButtonText}>{language}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Units</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setUnitsModalVisible(true)}>
          <Text style={styles.settingButtonText}>{units}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Currency</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setCurrencyModalVisible(true)}>
          <Text style={styles.settingButtonText}>{currency}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Font Size</Text>
        <TouchableOpacity
          style={styles.settingButton}
          onPress={() => setFontSizeModalVisible(true)}>
          <Text style={styles.settingButtonText}>{fontSize}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Auto Backup</Text>
        <Switch
          value={autoBackup}
          onValueChange={(value) => setAutoBackup(value)}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      {/* Language Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLanguageModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Language</Text>
            {/* Add your language selection UI here */}
            <TouchableOpacity
              onPress={() => {
                setLanguageModalVisible(false);
                // Update the language state here
              }}>
              <Text style={styles.modalOption}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLanguageModalVisible(false);
                // Update the language state here
              }}>
              <Text style={styles.modalOption}>Spanish</Text>
            </TouchableOpacity>
            {/* Add more language options */}
          </View>
        </View>
      </Modal>

      {/* Units Modal */}
      {/* Add similar modals for Units, Currency, and Font Size */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E9F0',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingButton: {
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  settingButtonText: {
    fontSize: 16,
    color: 'black',
  },
  saveButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
   modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
  },
});

export default SettingsScreen;
