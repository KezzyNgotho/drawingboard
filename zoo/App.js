import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { MainStackNavigator, LoginStackNavigator } from '../zoo/src/components/navigation/StackNavigator';

const Lighttheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    primary: 'black',
    secondary:'#66b2ff',
    accent: 'black',
  },
};

const Darktheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'red',
    primary: 'black',
    accent: 'black',
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
