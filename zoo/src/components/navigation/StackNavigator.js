import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";

import BottomTabNavigator from "./TabNavigator";
import HomeScreen from "../../screens/HomeScreen";
import cattleScreen from "../../screens/cattleScreen";
import MilkScreen from "../../screens/MilkScreen";
import ExpensesScreen from '../../screens/ExpensesScreen';
import NotificationScreen from '../../screens/NotificationScreen';
import SignupScreen from "../../screens/SignupScreen";
import LoginScreen from "../../screens/LoginScreen";

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {
      // You can set header background color here if needed
    },
    headerShown: false,
    headerTintColor: colors.primary, // Use primary color for header text
    headerBackTitle: "Back",
  };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName={"HomeScreen"}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Cattle" component={cattleScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Milk" component={MilkScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Expenses" component={ExpensesScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  );
}

const LoginStackNavigator = () => {
  const { colors } = useTheme();

  const screenOptionStyle = {
    headerStyle: {
      // You can set header background color here if needed
    },
    headerShown: false,
    headerTintColor: colors.primary, // Use primary color for header text
  };

  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
}

export { MainStackNavigator, LoginStackNavigator };
