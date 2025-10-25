import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput,  TouchableOpacity, ScrollView } from 'react-native';
import Spacer from './Spacer';
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');
import { useNavigation, navigate } from '@react-navigation/native';




const DeleteProfileScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  const {  } = useContext(AuthContext);
  
  // Use state to manage the input values
  const [validationError, setValidationError] = useState('');
  const {  jwtToken, setGoogleMessage, setUserProfile, setJwtToken, setRefreshToken, deleteJwtToken, setTemporaryJwtToken, setTemporaryRefreshToken } = useContext(AuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  

  useFocusEffect(
    React.useCallback(() => {
      //fetchData();
      return () => {
      };
    }, [])
  );


  const deleteAccount = async() => {
    
    try {
      const response = await fetch(serverUrl + '/profiles/deleteAccount', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
      });
      if (!response.ok) {
        console.log("response was not okay");
      } else {
        const json = await response.json();
        if(json.message==="success"){
          setValidationError("Successfully deleted account.");
          setGoogleMessage('Not Signed In'); 
          setUserProfile(undefined);
          setJwtToken("");
          setRefreshToken("");
          deleteJwtToken();
          setTemporaryJwtToken("");
          setTemporaryRefreshToken("");
        } 
      }
    } catch (error) {
      console.log("Error");
      console.log(error);
    } 
  }


  return (
    <ScrollView>
      <View style={styles.container}>

        <Text style={styles.headerTitle}>{translate('delete_account_data_title')}</Text>
        <Text style={styles.text}>{translate('delete_account_text')}</Text>
        <TouchableOpacity style={styles.submitButton} onPress={() => deleteAccount() }>
          <Text style={styles.submitButtonText}>{translate('delete_account_button')}</Text>
        </TouchableOpacity>
        <Text style={styles.errorText}>{validationError}</Text>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },

  input: {
    borderWidth: 1,          // adds the border
    borderColor: '#ccc',     // border color
    borderRadius: 8,         // rounded corners
    padding: 12,             // inner spacing
    fontSize: 18,            // larger text
    marginBottom: 16,        // space between inputs
    backgroundColor: '#fff', // optional, looks nice on gray backgrounds
  },

  text: {
    fontSize: 14,
    paddingBottom: 20
  },
  errorText: {
    color: "#ff0000",
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  settingTitle: {
    paddingTop: 10,
    fontSize: 18,
    textAlign: 'center',
  },
  settingDev: {
    color: "#ff0000",
    paddingTop: 10,
    fontSize: 14,
    textAlign: 'left',
  },
  label: {
    fontSize: 16,
    marginBottom: 0,
    fontWeight: 'bold',
  },
  submitButton: {
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
  submitButtonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },


});

export default DeleteProfileScreenComponent;