import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { MainStackNavigator, LoginStackNavigator } from '../zoo/src/components/navigation/StackNavigator';

const Tab = createMaterialBottomTabNavigator();

const Lighttheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',   // Green
    accent: '#FF6347',    // Red
    background: 'white', // Light gray
    surface: '#FFFFFF',   // White
    text: '#333333',      // Dark gray
    secondary: '#E8C547', // Yellow
  },
};

const Darktheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'black',   // Green
    accent: '#FF6347',    // Red
    background: 'white', // Dark gray
    surface: '#1E1E1E',   // Dark surface color
    text: '#FFFFFF',      // White
  },
};


const App = () => {
  const isDarkTheme = 'dark';

  return (
    <PaperProvider theme={isDarkTheme === 'dark' ? Darktheme : Lighttheme}>
      <NavigationContainer>
        <LoginStackNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
