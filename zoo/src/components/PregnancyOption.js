// PregnancyOption.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const PregnancyOption = ({ label, value, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        { backgroundColor: isSelected ? '#3498DB' : '#E1E9F0' },
      ]}
      onPress={onSelect}
    >
      <Text style={styles.optionButtonText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PregnancyOption;
