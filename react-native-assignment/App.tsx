import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { NavigationContainer } from '@react-navigation/native';
import { Login } from './src/screens/Login';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Test from './src/screens/test';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import Profile from './src/screens/Profile';
import Homescreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} >
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
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '475127014593-jqua44j0nk8uikk6mtlkigqnqk043eqn.apps.googleusercontent.com', // Replace with your web client ID
    });

    const checkUserLoggedIn = async () => {
      try {
        const userInfo = await GoogleSignin.getCurrentUser();
        setInitialRoute(userInfo ? 'HomeScreen' : 'Test');
      } catch (error) {
        console.log('Error checking user login status: ', error);
        setInitialRoute('Test');
      }
    };

    checkUserLoggedIn();
  }, []);

  if (initialRoute === null) {
    return null; // or a loading screen
  }
 
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Test" component={Test} />
      
        <Stack.Screen name="HomeScreen" component={HomeTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;