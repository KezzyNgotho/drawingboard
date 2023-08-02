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
      barStyle={{ backgroundColor: 'white' }}
      initialRouteName='Homescreen'
    >
      <Tab.Screen
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons8-home-64.png')}
              style={{ tintColor: color, width: 26, height: 26 }}
            />
          ),
        }}
        name="Homescreen" component={MainStackNavigator} />
      <Tab.Screen
        options={{
          tabBarLabel: 'cattle',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/menu.png')}
              style={{ tintColor: color, width: 26, height: 26 }}
            />
          ),
        }}
        name="cattle" component={cattleScreen} />

      {/* navigationOptions:()=>{
          return {
            tabBarVisible:false,
          };
      */}
      <Tab.Screen
        options={{
          tabBarLabel: 'Milk',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/icons8-milk-50.png')}
              style={{ tintColor: color, width: 26, height: 26 }}
            />
          ),
        }}
        name="Milk" component={MilkScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
