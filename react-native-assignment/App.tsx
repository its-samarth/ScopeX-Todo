import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Homescreen from './HomeScreen'
import { NavigationContainer } from '@react-navigation/native';
import { Login } from './Login';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '475127014593-jqua44j0nk8uikk6mtlkigqnqk043eqn.apps.googleusercontent.com',
});
const Stack = createStackNavigator();
const App = () => {
  return (
   
      <NavigationContainer>
         <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" component={Homescreen} />
      </Stack.Navigator>
      </NavigationContainer>
      
   
  )
}

export default App

const styles = StyleSheet.create({})