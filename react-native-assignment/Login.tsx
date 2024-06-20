import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

export const Login = () => {
  function PhoneSignIn() {
    // If null, no SMS has been sent
    const [confirm, setConfirm] = useState(null);

    // Verification code (OTP - One-Time-Passcode)
    const [code, setCode] = useState('');

    // Handle login
    function onAuthStateChanged(user) {
      if (user) {
        console.log('User has logged in:', user);
        // Hide the component(s) for entering the code or navigate away from this screen
        // Display a success message
      }
    }

    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return () => subscriber(); // Unsubscribe on unmount
    }, []);

    // Handle the button press
    async function signInWithPhoneNumber(phoneNumber) {
      console.log('Attempting to sign in with phone number:', phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    }

    async function confirmCode() {
      try {
        console.log('Attempting to confirm code:', code);
        await confirm.confirm(code);
      } catch (error) {
        console.log('Invalid code.', error);
      }
    }

    if (!confirm) {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('Phone Number Sign In button pressed');
            signInWithPhoneNumber('+91 70467 55055');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Phone Number Sign In</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <TextInput
          value={code}
          onChangeText={text => {
            console.log('Code input changed:', text);
            setCode(text);
          }}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={() => {
            console.log('Confirm Code button pressed');
            confirmCode();
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Confirm Code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <PhoneSignIn />;
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default Login;
