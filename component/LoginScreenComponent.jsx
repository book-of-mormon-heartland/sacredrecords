import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { useI18n } from '.././context/I18nContext'; 
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { useNavigation, navigate } from '@react-navigation/native';
import CognitoLoginScreenComponent from './CognitoLoginScreenComponent.jsx';
import AsyncStorage from '@react-native-async-storage/async-storage';




const LoginScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { googleSignIn, appleSignIn, cognitoSignIn } = useContext(AuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  const { language, setLanguage, translate } = useI18n();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  

  useEffect(() => {
  }, []); 



  async function onAppleButtonPress() {
    try {
      // Performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Retrieve the credential state for the user
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user
      );

      if (credentialState === appleAuth.State.AUTHORIZED) {
        //Extract name/email the first time
        const { user, email, fullName, identityToken } = appleAuthRequestResponse;

        let userData = { user, email, fullName };

        // Check if name/email are provided (first login)
        if (fullName?.givenName || fullName?.familyName) {
          // Store them locally for later
          await AsyncStorage.setItem('apple_user_data', JSON.stringify(userData));
        } else {
          // If not provided (subsequent login), load from storage
          const storedData = await AsyncStorage.getItem('apple_user_data');
          if (storedData) {
            userData = JSON.parse(storedData);
          }
        }

        let message = await appleSignIn( appleAuthRequestResponse, userData);

      } else if (credentialState === appleAuth.State.NOT_FOUND) {
        console.log("User Not found.");
        //console.log('Apple Auth Response:', appleAuthRequestResponse);
        //console.log(credentialState);
        Alert.alert("User Not Found");

      } else if (credentialState === appleAuth.State.REVOKED) {
        console.log("User Revoked");
        //console.log('Apple Auth Response:', appleAuthRequestResponse);
        //console.log(credentialState);
        Alert.alert("User Revoked");

        if(process.env.ENVIRONMENT === "development") {
          appleSignIn( appleAuthRequestResponse);
        }

      }

    } catch (error) {
      console.error(error);
      //Alert.alert('Apple Login Error', error.message);
    }
  }



  const signInToGoogle = async () => {
    //setLoading(true);
    await googleSignIn()
    //setLoading(false);
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if(isIOS) {
    return (
      <View style={styles.loginContainer}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{translate('greeting')}</Text>
        <Image source={require('.././assets/sacred-records-logo-200x200.png')} style={styles.loginScreenImage} />
        <TouchableOpacity style={styles.googleButton} onPress={() => signInToGoogle() }>
          <Image
            source={{ uri: 'https://storage.googleapis.com/sacred-records/google-sign-in.png'}} // Replace with your Google logo image path
            style={styles.logo}
          />
          <Text style={styles.googleButtonText}>{translate('google_login')}</Text>
        </TouchableOpacity>
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={ styles.appleButton }
          onPress={onAppleButtonPress}
        />
        <Text style={styles.warningText}>{translate('always_use_same_sign_in')}</Text>

      </View>
    );

  } else {
    // android, no apple button.
    return (
      <View style={styles.loginContainer}>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{translate('greeting')}</Text>
        <Image source={require('.././assets/sacred-records-logo-200x200.png')} style={styles.loginScreenImage} />
        <CognitoLoginScreenComponent />
      </View>
    );
  }

};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginScreenImage: {
    padding: 20,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row', // Arranges children horizontally
    justifyContent: 'space-around', // Distributes space evenly
    alignItems: 'center', // Aligns items vertically in the center
    padding: 10,
  },
  belowImageButton: {
    backgroundColor: '#007bff', 
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 0,
    marginTop: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
    padding: 5,
    marginRight: 5,
    marginLeft: 5,
    marginBottom: 5,
    marginTop: 0,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 12,
    fontWeight: 'bold',
  },
  appleButton: {
    marginTop: 15,
    width: 200,
    height: 44,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff', // White background for the button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light gray border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // For Android shadow
  },
  googleButtonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },
  warningText: {
    paddingTop: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '90%',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },

});

export default LoginScreenComponent;

