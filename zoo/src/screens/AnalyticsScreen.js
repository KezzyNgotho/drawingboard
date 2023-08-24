import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const AnalyticsScreen = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([
    { month: 'Jan', sales: 1200, expenses: 800 },
    { month: 'Feb', sales: 1400, expenses: 900 },
    { month: 'Mar', sales: 1000, expenses: 700 },
    { month: 'Apr', sales: 1600, expenses: 1000 },
    { month: 'May', sales: 1800, expenses: 1200 },
    { month: 'Jun', sales: 2000, expenses: 1500 },
  ]);

  const [yearlySalesData, setYearlySalesData] = useState([
    { year: 2021, sales: 10000, expenses: 6000 },
    { year: 2022, sales: 12000, expenses: 7500 },
    { year: 2023, sales: 9000, expenses: 5000 },
  ]);

  const [monthlyProductionData, setMonthlyProductionData] = useState([
    { month: 'Jan', production: 5000 },
    { month: 'Feb', production: 5500 },
    { month: 'Mar', production: 5200 },
    { month: 'Apr', production: 6000 },
    { month: 'May', production: 6200 },
    { month: 'Jun', production: 6500 },
  ]);

  const [yearlyProductionData, setYearlyProductionData] = useState([
    { year: 2021, production: 45000 },
    { year: 2022, production: 50000 },
    { year: 2023, production: 48000 },
  ]);

  const currentMonth = new Date().getMonth();
  const lastThreeMonthsSalesData = monthlySalesData.slice(currentMonth - 2, currentMonth + 1);
  const lastThreeMonthsProductionData = monthlyProductionData.slice(currentMonth - 2, currentMonth + 1);

  const renderSalesChart = (data, title, color) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={{
          labels: data.map((item) => item.month || item.year.toString()),
          datasets: [
            {
              data: data.map((item) => item.sales),
            },
            {
              data: data.map((item) => item.expenses),
            },
          ],
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(${color}, ${opacity})`,
        }}
      />
    </View>
  );

  const renderProductionChart = (data, title, color) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={{
          labels: data.map((item) => item.month || item.year.toString()),
          datasets: [
            {
              data: data.map((item) => item.production),
            },
          ],
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(${color}, ${opacity})`,
        }}
      />
    </View>
  );

  const printStatements = () => {
    // Implement printing functionality here
    // You might need to integrate with a printing library or service
    console.log('Statements printed');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Analytics Dashboard</Text>

      {renderSalesChart(lastThreeMonthsSalesData, 'Last Three Months Sales and Expenses', '0, 128, 0')}
      {renderSalesChart(monthlySalesData, 'Monthly Sales and Expenses', '0, 0, 255')}
      {renderSalesChart(yearlySalesData, 'Yearly Sales and Expenses', '255, 0, 0')}

      {renderProductionChart(lastThreeMonthsProductionData, 'Last Three Months Milk Production', '128, 0, 0')}
      {renderProductionChart(monthlyProductionData, 'Monthly Milk Production', '0, 128, 128')}
      {renderProductionChart(yearlyProductionData, 'Yearly Milk Production', '0, 128, 0')}

      <TouchableOpacity style={styles.printButton} onPress={printStatements}>
        <Text style={styles.printButtonText}>Print Statements</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  printButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 80, // Add padding to create space for the button
  },
});

export default AnalyticsScreen;
