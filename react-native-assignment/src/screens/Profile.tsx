import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const [user, setUser] = useState<{ user: { photo: string; name: string; givenName: string; familyName: string; email: string; id: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '475127014593-jqua44j0nk8uikk6mtlkigqnqk043eqn.apps.googleusercontent.com', // Replace with your web client ID
    });

    const fetchUserProfile = async () => {
      try {
        const userInfo = await GoogleSignin.getCurrentUser();
        setUser(userInfo);
      } catch (error) {
        console.log('Error fetching user info: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignOutComplete = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null); 
      navigation.replace('Test');
      console.log(' signing out success ',user);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.profileContainer}>
          <Image source={{ uri: user.user.photo }} style={styles.profileImage} />
          <Text style={styles.profileName}>{user.user.name}</Text>
          <Text style={styles.profileText}>{user.user.givenName}</Text>
          <Text style={styles.profileText}>{user.user.familyName}</Text>
          <Text style={styles.profileText}>{user.user.email}</Text>
          <Text style={styles.profileText}>{user.user.id}</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOutComplete}>
            <FontAwesomeIcon icon={faRightFromBracket} size={20} color={'black'} />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.notLoggedInText}>Not Logged in</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  profileText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 20,
  },
  signOutButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#999',
  },
});

export default Profile;
