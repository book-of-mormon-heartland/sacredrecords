import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Linking, TouchableOpacity, ScrollView } from 'react-native';
import Spacer from './Spacer';
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');



const DonateScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  
  // Use state to manage the input values
  const [validationError, setValidationError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(true);
  const { jwtToken,  setJwtToken, refreshJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  


  const fetchData = async () => {

  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );


  const donate = async() => {
    
    try {
      await Linking.openURL('https://sacred-records-node-prod-376185747738.us-central1.run.app/donate');
    } catch (err) {
      Alert.alert('Error', 'Unable to open donations page.');
    }
  }



    
    return (
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.topImageContainerWithoutBanner}>
            <Text style={styles.title}>{translate('supporting')}</Text>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />
            <Text style={styles.bomhTitle}>{translate('book_of_mormon_heartland')}</Text>

          </View>
          <Text style={styles.text}>{translate('donate_text')}</Text>
          <TouchableOpacity style={styles.submitButton} onPress={() => donate() }>
            <Text style={styles.submitButtonText}>{translate('donate_button')}</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bomhTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  loginScreenImage: {
    padding: 20,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 10,
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
  topImageContainerWithoutBanner: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topImage: {
    width: '270', // Take up the full width of the item container
    height: '80', // Take up the full width of the item container
    //aspectRatio: 1, // Maintain a square aspect ratio for thumbnails
    borderRadius: 8,
    paddingBottom: 0,
    marginBottom: 0,
  },
});

export default DonateScreenComponent;