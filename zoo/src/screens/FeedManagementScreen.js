  import React, { useState } from 'react';
  import { View, Text, StyleSheet, ScrollView } from 'react-native';
  import { Card } from 'react-native-elements';
  import { Table, Row, TableWrapper } from 'react-native-table-component';
  import moment from 'moment';

  const FeedManagementScreen = () => {
    const feedSchedule = [
      { category: 'Milked', productionRate: 'High', feedType: 'Milk', quantity: '2 liters', times: ['Morning', 'Evening'] },
      { category: 'Milked', productionRate: 'Low', feedType: 'Formula', quantity: '1 liter', times: ['Afternoon'] },
      { category: 'Pregnant', months: '1-3', feedType: 'Grains', quantity: '2 kg', times: ['Morning'] },
      { category: 'Pregnant', months: '4-6', feedType: 'Hay', quantity: '3 kg', times: ['Evening'] },
      // ... Add more feed schedule entries
    ];

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Feed Management</Text>

        <Text style={styles.scheduleHeader}>Feeding Schedule</Text>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Milked Cattle</Text>
          <Card containerStyle={styles.feedCard}>
            <View style={styles.feedCardContent}>
              <Table borderStyle={styles.tableBorderStyle}>
                <Row
                  data={['Production', 'Feed Type', 'Quantity', 'Feeding Times']}
                  style={styles.head}
                  textStyle={styles.textHeader}
                />
                {feedSchedule.filter(item => item.category === 'Milked').map((item, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    <CellRenderer data={item.productionRate} />
                    <CellRenderer data={item.feedType} />
                    <CellRenderer data={item.quantity} />
                    <CellRenderer data={item.times.join(', ')} />
                  </TableWrapper>
                ))}
              </Table>
            </View>
          </Card>
        </View>

        <View style={styles.categoryContainer}>
          <Text style={styles.categoryHeader}>Pregnant Cattle</Text>
          <Card containerStyle={styles.feedCard}>
            <View style={styles.feedCardContent}>
              <Table borderStyle={styles.tableBorderStyle}>
                <Row
                  data={['Months', 'Feed Type', 'Quantity', 'Feeding Times']}
                  style={styles.head}
                  textStyle={styles.textHeader}
                />
                {feedSchedule.filter(item => item.category === 'Pregnant').map((item, index) => (
                  <TableWrapper key={index} style={styles.row}>
                    <CellRenderer data={item.months} />
                    <CellRenderer data={item.feedType} />
                    <CellRenderer data={item.quantity} />
                    <CellRenderer data={item.times.join(', ')} />
                  </TableWrapper>
                ))}
              </Table>
            </View>
          </Card>
        </View>
      </ScrollView>
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
    scheduleHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
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
    feedCardContent: {
      paddingHorizontal: 16,
      paddingVertical: 12,
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
  });

  export default FeedManagementScreen;
 