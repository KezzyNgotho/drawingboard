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
import CattleDetailsScreen from "../../screens/CattleDetailsScreen";
import FeedManagementScreen from "../../screens/FeedManagementScreen"; 
import HealthManagementScreen from "../../screens/HealthManagementScreen";
import TaskReminderScreen from "../../screens/TaskReminderScreen";
import StatementsScreen from "../../screens/StatementsScreen";
import AnalyticsScreen from "../../screens/AnalyticsScreen";
import SalesScreen from "../../screens/SalesScreen";
import SettingsScreen from "../../screens/SettingsScreen";
import ProfileScreen from "../../screens/ProfileScreen";
  import EditCattleDetailsScreen from "../../screens/EditCattleDetailsScreen";

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
      <Stack.Screen options={{ headerShown: false }} name="CattleDetails" component={CattleDetailsScreen} />
      <Stack.Screen options={{ headerShown: false }} name="EditCattleDetails" component={EditCattleDetailsScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Feed" component={FeedManagementScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Health" component={HealthManagementScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Tasks" component={TaskReminderScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Statements" component={StatementsScreen} />
      
      <Stack.Screen options={{ headerShown: false }} name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Sales" component={SalesScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Settings" component={SettingsScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Profile" component={ProfileScreen} />
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
