import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const GoogleSignOutButton = ({ onPress }) => {
  const handleSignOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      onPress(); // Call the onPress function provided by parent component
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <FontAwesomeIcon icon={faSignOutAlt} size={20} color={'black'} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GoogleSignOutButton;
