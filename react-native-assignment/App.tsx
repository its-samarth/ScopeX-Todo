import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Homescreen from './HomeScreen'
import { NavigationContainer } from '@react-navigation/native';
import { Login } from './Login';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Test from './test';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import Profile from './Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} 
     tabBarOptions={{
      activeTintColor: 'blue', // Color of tab when pressed
      inactiveTintColor: 'gray', // Color of tab when not pressed
      style: {
        backgroundColor: 'blue', // Background color of tab bar
      },
      labelStyle: {
        fontSize: 12, // Font size of tab labels
      },
    }}>
      <Tab.Screen
        name="Home"
        component={Homescreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHome} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test" component={Test} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" component={HomeTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;