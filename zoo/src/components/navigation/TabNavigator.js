import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import React from "react";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";

import cattleScreen from "../../screens/cattleScreen";
import MilkScreen from "../../screens/MilkScreen";
import { MainStackNavigator, ContactStackNavigator } from "./StackNavigator";

const Tab = createMaterialBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      activeColor={colors.primary}
      inactiveColor={colors.onBackground}
      barStyle={{ backgroundColor: colors.background }} // Use background color from theme
      initialRouteName='Homescreen'
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons8-home-642.png')}
              style={{ tintColor: color, width: 37, height: 30 }}
            />
          ),
        }}
        name="Homescreen" component={MainStackNavigator} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Cattle',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons8-menu-50.png')}
              style={{ tintColor: color, width: 37, height: 30 }}
            />
          ),
        }}
        name="cattle" component={cattleScreen} />
      <Tab.Screen
        options={{
          tabBarLabel: 'Milk',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons8-drink-50.png')}
              style={{ tintColor: color, width: 37, height: 30 }}
            />
          ),
        }}
        name="Milk" component={MilkScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
