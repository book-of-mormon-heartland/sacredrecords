import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput,  TouchableOpacity, ScrollView } from 'react-native';
import Spacer from './Spacer';
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');



const EditNamesScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  // Use state to manage the input values
  const [validationError, setValidationError] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [billingName, setBillingName] = useState('');
  const {  setJwtToken, setRefreshToken, saveJwtToken, temporaryJwtToken, setTemporaryJwtToken, temporaryRefreshToken, setTemporaryRefreshToken, userProfile, setUserProfile  } = useContext(AuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  


  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/profiles/getUserName"; // Example endpoint
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${temporaryJwtToken}`
        }
      });
      if (!response.ok) {
        console.log("response was not okay");
      } else {
        const json = await response.json();
        console.log(json);
        //setData(json);
        setGivenName(json.givenName);
        setFamilyName(json.familyName);
        setBillingName(json.name);
      }
    } catch (error) {
      console.log("Error");
      console.log(error);
    } 
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );


  const saveProfile = async() => {
    console.log("saveProfile");
    // check all three values to see if there is content.
    setValidationError("");
    if(givenName==undefined || givenName==="") {
      setValidationError("All items must have value");
    }
    if(familyName==undefined || familyName==="") {
      setValidationError("All items must have value");
    }
    if(billingName==undefined || billingName==="") {
      setValidationError("All items must have value");
    }
    if(validationError==="") {
      // now we can save it.
      let names = {
        givenName: givenName,
        familyName: familyName,
        name: billingName
      }
      try {
        const response = await fetch(serverUrl + '/profiles/saveUserName', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${temporaryJwtToken}`
            },
            body: JSON.stringify(names),
        });
        if (!response.ok) {
          console.log("response was not okay");
        } else {
          const json = await response.json();
          if(json.message==="success"){
            setValidationError("Successfully Saved. Login again.");
            userProfile.givenName=givenName;
            userProfile.familyName=familyName;
            userProfile.name=billingName;
            setUserProfile(userProfile);

            console.log("userProfile");
            console.log(userProfile);
            console.log("temporaryJwtToken");
            console.log(temporaryJwtToken);
            console.log("temporaryRefreshToken");
            console.log(temporaryRefreshToken);

            setJwtToken(temporaryJwtToken);
            setRefreshToken(temporaryRefreshToken)
            saveJwtToken(temporaryJwtToken);
            setTemporaryJwtToken("");
            setTemporaryRefreshToken("");
          }
        }
      } catch (error) {
        console.log("Error");
        console.log(error);
      }
    } else {
      console.log("cannot save");
    }
  }


  return (
    <ScrollView>
      <View style={styles.container}>

        <Text>{translate('proper_billing')}</Text>
         <Spacer size={20} /> 
        <Text>{translate('given_name')}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setGivenName} // Function to update the state
          value={givenName}          // The current state value
          placeholder={translate('enter_given_name')}
          keyboardType="default"     // Best for names/text
          autoCapitalize="words"     // Capitalize the first letter of each word
        />
        <Text>{translate('family_name')}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFamilyName}
          value={familyName}
          placeholder={translate('enter_family_name')}
          keyboardType="default"
          autoCapitalize="words"
        />
        <Text>{translate('billing_name')}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setBillingName}
          value={billingName}
          placeholder={translate('enter_billing_name')}
          keyboardType="default"
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.submitButton} onPress={() => saveProfile() }>
          <Text style={styles.submitButtonText}>{translate('save')}</Text>
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

export default EditNamesScreenComponent;