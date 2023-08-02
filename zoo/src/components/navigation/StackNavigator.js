import React from "react";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
//import DepositScreen from "../screens/DepositScreen";

//import WithdrawScreen from "../screens/WithdrawScreen";
//import PendingScreen from "../screens/PendingScreen";
//import FirstScreen from "../screens/FirstScreen";

//import OpenScreen from "../screens/OpenScreen";
import BottomTabNavigator from "./TabNavigator";
//import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../../screens/HomeScreen";

import cattleScreen from "../../screens/cattleScreen";
import MilkScreen from "../../screens/MilkScreen";/* 
import SalesScreen from '../../screens/SalesScreen'; */
import ExpensesScreen from '../../screens/ExpensesScreen';
import NotificationScreen from '../../screens/NotificationScreen';
/* import SidebarDrawer from '../../Screens/SidebarDrawer'; */
import SignupScreen from "../../screens/SignupScreen";
import LoginScreen from "../../screens/LoginScreen";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
  },
  headerShown: false,
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} initialRouteName={"HomeScreen"}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Cattle" component={cattleScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Milk" component={MilkScreen} />
    {/*   <Stack.Screen options={{ headerShown: false }} name="Sales" component={SalesScreen} /> */}
      <Stack.Screen options={{ headerShown: false }} name="Expenses" component={ExpensesScreen} />
       <Stack.Screen options={{ headerShown: false }} name="Notification" component={NotificationScreen} />
 {/*      <Stack.Screen options={{ headerShown: false }} name="SidebarDrawer" component={SidebarDrawer} /> */}
     
    </Stack.Navigator>
  );
}

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} >
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
     
      <Stack.Screen name="Main" component={BottomTabNavigator} />



    </Stack.Navigator>
  );
}

export { MainStackNavigator, LoginStackNavigator };