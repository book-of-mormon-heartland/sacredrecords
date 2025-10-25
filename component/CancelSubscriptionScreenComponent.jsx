import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput,  TouchableOpacity, ScrollView } from 'react-native';
import Spacer from './Spacer';
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');



const CancelSubscriptionScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  // Use state to manage the input values
  const [validationError, setValidationError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(true);
  const {  jwtToken  } = useContext(AuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  


  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/subscriptions/isUserSubscribed"; // Example endpoint
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ 
          subscription: "quetzal-condor" 
        }),
      });
      if (!response.ok) {
        console.log("response was not okay");
      } else {
        const json = await response.json();
        //console.log(json);
        //console.log("isSubscribed")
        //console.log(json.isSubscribed);
        setIsSubscribed(json.isSubscribed);
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


  const cancelSubscription = async() => {
    //console.log("cancel subscription");
    // check all three values to see if there is content.
    let names={
      subscription: "quetzal-condor"
    };
    try {
      const response = await fetch(serverUrl + '/payments/cancelSubscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify(names),
      });
      if (!response.ok) {
        console.log("response was not okay");
      } else {
        const json = await response.json();
        setValidationError(json.message);
      }
    } catch (error) {
      console.log("Error");
      console.log(error);
    }
  }

  if(isSubscribed) {
    return (
      <ScrollView>
        <View style={styles.container}>

          <Text>{translate('cancel_subscription_text')}</Text>
          <Spacer size={20} /> 

          <TouchableOpacity style={styles.submitButton} onPress={() => cancelSubscription() }>
            <Text style={styles.submitButtonText}>{translate('cancel_subscription_button')}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      </ScrollView>
    );
  } else {
    
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text>{translate('cancel_subscription_text_not_needed')}</Text>
        </View>
      </ScrollView>
    );


  }

 
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

export default CancelSubscriptionScreenComponent;