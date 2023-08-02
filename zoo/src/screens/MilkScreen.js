import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, FlatList } from 'react-native';

const MilkScreen = () => {
  const [cattle, setCattle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [milkProduced, setMilkProduced] = useState('');
  const [milkUsage, setMilkUsage] = useState('');
  const [milkRecords, setMilkRecords] = useState([]);

  const handleRecordMilk = () => {
    // Save milk production and usage records to state or database
    const newRecord = {
      cattle,
      date,
      time,
      milkProduced,
      milkUsage,
    };
    setMilkRecords((prevRecords) => [...prevRecords, newRecord]);
    // Reset input fields after recording
    setCattle('');
    setDate('');
    setTime('');
    setMilkProduced('');
    setMilkUsage('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.record}>
      <Text>Cattle: {item.cattle}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Time: {item.time}</Text>
      <Text>Milk Produced: {item.milkProduced} liters</Text>
      <Text>Milk Usage: {item.milkUsage} liters</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Milk Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Cattle"
        value={cattle}
        onChangeText={setCattle}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Milk Produced (liters)"
        value={milkProduced}
        onChangeText={setMilkProduced}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Milk Usage (liters)"
        value={milkUsage}
        onChangeText={setMilkUsage}
        keyboardType="numeric"
      />
      <Button title="Record Milk" onPress={handleRecordMilk} />
      <FlatList
        data={milkRecords}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 8,
  },
  record: {
    marginBottom: 12,
  },
});

export default MilkScreen;
