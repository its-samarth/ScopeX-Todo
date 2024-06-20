import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';

export const Login = () => {
  const navigation = useNavigation();
  auth()
  .createUserWithEmailAndPassword('samarthbackup21@gmail.com', 'Wei5Sohniech4sae')
  .then(() => {
    console.log('User account created & signed in!');
  })
  .catch(error => {
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });
  const onGoogleButtonPress = async () => {
    try {
      console.log('Checking Google Play Services availability...');
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      console.log('Google Play Services are available');

      console.log('Attempting to sign in...');
      //const userInfo = await GoogleSignin.signIn();
      //console.log('User info obtained:', userInfo);

      //console.log('Creating Google credential...');
      //const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);

      const {idToken} = await GoogleSignin.signIn();
        console.log("idtoken");
        
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
      navigation.navigate('HomeScreen');

      console.log('Signing in with Google credential...');
      //await auth().signInWithCredential(googleCredential);

      console.log('Signed in with Google! Navigating to HomeScreen...');
      
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google sign in is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Play services are not available');
      } else {
        Alert.alert('Error', 'Unknown error occurred');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={onGoogleButtonPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
  },
  googleButton: {
    width: 192,
    height: 48,
    marginTop: 20,
  },
});

export default Login;
