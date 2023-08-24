import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView,Modal,TextInput,TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { Table, Row, TableWrapper } from 'react-native-table-component';
import moment from 'moment';
import CheckBox from '@react-native-community/checkbox';

const FeedManagementScreen = () => {
  
  const [feedSchedule, setFeedSchedule] = useState([
    // ... Feed schedule entries for different cattle categories ...
  ]);
  const handleFormSubmit = () => {
    // Here, you can update the feed schedule with the form data
    // and update the state accordingly.
    const updatedSchedule = feedSchedule.map(item => {
      if (item.category === selectedCategory) {
        return { ...item, ...formData };
      }
      return item;
    });
    setFeedSchedule(updatedSchedule);
    handleModalClose();
  };
  const handleModalOpen = (category) => {
    setSelectedCategory(category);
    setFormData(feedSchedule.find(item => item.category === category) || {
      productionRate: '',
      feedType: '',
      quantity: '',
      times: '',
    });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedCategory('');
    setFormData({
      productionRate: '',
      feedType: '',
      quantity: '',
      times: '',
    });
  };
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    productionRate: '',
    feedType: '',
    quantity: '',
    times: '',
  });

  const handleFormChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Cattle Feeding Management</Text>

      <View style={styles.categoryContainer}>
        <CategoryCard category="Milked" feedSchedule={feedSchedule} handleModalOpen={handleModalOpen}  />
        <CategoryCard category="Pregnant" feedSchedule={feedSchedule}  handleModalOpen={handleModalOpen}  />
        <CategoryCard category="Calves" feedSchedule={feedSchedule}   handleModalOpen={handleModalOpen}/>
        <CategoryCard category="Bulls" feedSchedule={feedSchedule}  handleModalOpen={handleModalOpen} />
        <CategoryCard category="Infertile" feedSchedule={feedSchedule}  handleModalOpen={handleModalOpen} />
      </View>

      <Modal visible={isModalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <Text style={styles.modalHeader}>Set Feeding Schedule for {selectedCategory} Cattle</Text>

    <TextInput
      style={styles.input}
      placeholder="Production Rate (e.g. High, Low)"
      value={formData.productionRate}
      onChangeText={value => handleFormChange('productionRate', value)}
    />

    <TextInput
      style={styles.input}
      placeholder="Feed Type"
      value={formData.feedType}
      onChangeText={value => handleFormChange('feedType', value)}
    />

    <TextInput
      style={styles.input}
      placeholder="Quantity"
      value={formData.quantity}
      onChangeText={value => handleFormChange('quantity', value)}
    />

<TextInput
  style={styles.input}
  placeholder="Feeding Times (comma separated)"
  value={formData.times}
  onChangeText={value => handleFormChange('times', value)}
/>

<View style={styles.feedingTimesContainer}>
  <Text style={styles.feedingTimesHeader}>Feeding Times:</Text>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={formData.morning}
      onValueChange={value => handleFormChange('morning', value)}
    />
    <Text>Morning</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={formData.midday}
      onValueChange={value => handleFormChange('midday', value)}
    />
    <Text>Midday</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <CheckBox
      value={formData.evening}
      onValueChange={value => handleFormChange('evening', value)}
    />
    <Text>Evening</Text>
  </View>
</View>

    <TouchableOpacity style={styles.submitButton} onPress={handleFormSubmit}>
      <Text style={styles.buttonText}>Submit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.closeButton} onPress={handleModalClose}>
      <Text style={styles.buttonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>

    </ScrollView>
  );
};const CategoryCard = ({ category, feedSchedule,handleModalOpen}) => {
  const filteredSchedule = feedSchedule.filter(item => item.category === category);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    productionRate: '',
    feedType: '',
    quantity: '',
    times: '',
  });
  

  return (
    <Card containerStyle={styles.feedCard}>
    <Text style={styles.categoryHeader}>{category} Cattle</Text>
    <Table borderStyle={styles.tableBorderStyle}>
      <Row
        data={['Production', 'Feed Type', 'Quantity', 'Feeding Times']}
        style={styles.head}
        textStyle={styles.textHeader}
      />
      {filteredSchedule.map((item, index) => (
        <TableWrapper key={index} style={styles.row}>
          <CellRenderer data={item.productionRate || ''} />
          <CellRenderer data={item.feedType || ''} />
          <CellRenderer data={item.quantity || ''} />
          <CellRenderer data={item.times.join(', ') || ''} />
        </TableWrapper>
      ))}
    </Table>
    <TouchableOpacity style={styles.editButton} onPress={() => handleModalOpen(category)}>
      <Text style={styles.buttonText}>Set Schedule</Text>
    </TouchableOpacity>
  </Card>
  );
};

const CellRenderer = ({ data }) => (
  <TableWrapper style={styles.cell}>
    <Text style={styles.cellText}>{data}</Text>
  </TableWrapper>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedCard: {
    borderRadius: 10,
  },
  tableBorderStyle: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  textHeader: {
    margin: 6,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF1C1',
  },
  cell: {
    flex: 1,
  },
  cellText: {
    margin: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default FeedManagementScreen;