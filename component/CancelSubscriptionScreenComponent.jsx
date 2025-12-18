import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, Linking, TouchableOpacity, ScrollView } from 'react-native';
import Spacer from './Spacer';
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');
import { RevenueCatContext } from '.././context/RevenueCatContext';
import RevenueCatUI from "react-native-purchases-ui";



const CancelSubscriptionScreenComponent = ( {navigation} ) => {

  const { language, setLanguage, translate } = useI18n();
  // Use state to manage the input values
  const [validationError, setValidationError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isStripeSubscribed, setIsStripeSubscribed] = useState(false);
  const { jwtToken, setJwtToken, refreshJwtToken, saveJwtToken, deleteJwtToken, checkIfStripeSubscribed } = useContext(AuthContext);
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const {    checkIfSubscribed  } = useContext(RevenueCatContext);
  


  const fetchData = async () => {
    const isSubscribed = await checkIfSubscribed();
    setIsSubscribed(isSubscribed);
    const stripeSubscribed = await checkIfStripeSubscribed();
    setIsStripeSubscribed(stripeSubscribed);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [])
  );


  const cancelAppleSubscription = async() => {
    
    let names={
      subscription: "quetzal-condor"
    };
    try {
      const response = await fetch(serverUrl + '/payments/cancelAppleSubscription', {
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

    try {
      await Linking.openURL('https://apps.apple.com/account/subscriptions');
    } catch (err) {
      Alert.alert('Error', 'Unable to open subscriptions page.');
    }
  }

  const cancelAndroidRevenueCatSubscription = async() => {
    try {
      await Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.sacredrecords');
    } catch (err) {
      Alert.alert('Error', 'Unable to open subscriptions page.');
    }
  }

  const cancelAndroidSubscription = async() => {
        //console.log("cancel subscription");
    // check all three values to see if there is content.
    if(jwtToken) {
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

    try {
      await Linking.openURL('https://play.google.com/store/account/subscriptions?package=com.sacredrecords');
    } catch (err) {
      Alert.alert('Error', 'Unable to open subscriptions page.');
    }
  }



  if(isIOS && isSubscribed) {
    return (
      <ScrollView>
        <View style={styles.container}>

          <Text>{translate('cancel_subscription_text')}</Text>
          <Spacer size={20} /> 

          <TouchableOpacity style={styles.submitButton} onPress={() => cancelAppleSubscription() }>
            <Text style={styles.submitButtonText}>{translate('cancel_subscription_button')}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{validationError}</Text>
        </View>
      </ScrollView>
    );

   } else if(!isIOS)  {
    
    return (
      <ScrollView>
        <View style={styles.container}>

          <Text>{translate('cancel_subscription_text')}</Text>
          <Spacer size={20} /> 

          <TouchableOpacity style={styles.submitButton} onPress={() => cancelAndroidSubscription() }>
            <Text style={styles.submitButtonText}>{translate('cancel_subscription_button')}</Text>
          </TouchableOpacity>

          <Text style={styles.errorText}>{validationError}</Text>

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


/*
          <Text>{translate('cancel_android_revenue_cat_subscription_text')}</Text>
          <Spacer size={20} /> 

          <TouchableOpacity style={styles.submitButton} onPress={() => cancelAndroidRevenueCatSubscription() }>
            <Text style={styles.submitButtonText}>{translate('cancel_subscription_button')}</Text>
          </TouchableOpacity>
*/