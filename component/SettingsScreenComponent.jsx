import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, Linking, ScrollView, TouchableOpacity, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useI18n } from '.././context/I18nContext'; 



const SettingsScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signOut,  refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  //const [signedIn, setSignedIn] = useState(jwtToken ? true : false);
  const [userSignedIn, setUserSignedIn] = useState(false);
  
  const isIOS = ( Platform.OS === 'ios' );
  const { language, setLanguage, translate } = useI18n();
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  const updateProfile = () => {
    navigation.navigate('EditProfile', {});
  }

  const deletePersonalData = () => {
    console.log("delete personal data");
    navigation.navigate('DeleteProfile', {});    
  }

  const deleteAccount = () => {
    console.log("delete account");
    navigation.navigate('DeleteAccount', {});
  }

  const viewTermsOfUse = async() => {
    navigation.navigate('ViewTerms', {});    
/*
    try {
      await Linking.openURL('https://sacred-records-node-prod-376185747738.us-central1.run.app/terms');
    } catch (err) {
      Alert.alert('Error', 'Unable to open terms of use page.');
    }
      */
  }

  const viewPrivacyPolicy = async() => {
    try {
      await Linking.openURL('https://sacred-records-node-prod-376185747738.us-central1.run.app/privacy');
    } catch (err) {
      Alert.alert('Error', 'Unable to open privacy policy page.');
    }
  }


  const cancelSubscription = () => {
    console.log("Cancel Subscription");
    navigation.navigate('CancelSubscription', {});    
  }


  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const myJwtToken = await retrieveJwtToken();

        if(myJwtToken) {
          setUserSignedIn(true)
          const isSubscribedResult = await checkIfSubscribed();
          //console.log(isSubscribedResult);
          // the effect is the opposite of what I am use to.
          setIsSubscribed(!isSubscribedResult);
        } else {
          setUserSignedIn(false);
        }
      };
      loadData();

      return () => {
        // cleanup logic
      };
    }, []) // Dependencies array
  );

  const checkIfSubscribed = async() => {
    const myJwtToken = await retrieveJwtToken()
    try {
      const response = await fetch(serverUrl + "/subscriptions/checkIfSubscribed", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              subscription: "quetzal-condor"
          }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            setJwtToken();
            deleteJwtToken();
          }
        } else {
          console.log("Other error in subscriptions/subscribe");
        }
      } else {
        const responseData = await response.json();
        const obj = JSON.parse(responseData);
        if(obj.isSubscribed) {
          return true;
        } else {
          return false;
        }
      }
    } catch (error) {
       return false;
    }
  }

  const handleSubscribeToggle = (newValue) => {
      //console.log(`New value for subscribed: ${newValue}`);
      setIsSubscribed(newValue); // Update the state with the new value
  };

  const  setLanguageEndpoint = serverUrl + "/rest/POST/setLanguage"; // Example endpoint  
  const saveLanguage = async (selectedLanguage) => {
    setLoading(true);    
    const myJwtToken = await retrieveJwtToken();
    try {
      const response = await fetch(setLanguageEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${myJwtToken}`
        },
        body: JSON.stringify({ language: selectedLanguage }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            await saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            await deleteJwtToken();
          }
        }
      } else {
        const json = await response.json();
      }
    } catch (error) {
      console.log("Error in settingsScreenComponent");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const selectLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    saveLanguage(selectedLanguage);
  }

  const signOutOfApp = async() => {
    console.log("attempting signout");
    await signOut();
    setUserSignedIn(false);
    console.log("signed out");
  }

  const signInToApp = async() => {
    console.log("attempting signin");
    navigation.navigate('SignIn', {});
    //console.log("signed in");
  }



  return (
    <ScrollView>
      <>
        <View  style={styles.container}>
          <View style={styles.settingItem}>
            <Text style={styles.settingTitle}>{translate('signed_in')}</Text>
         {userSignedIn ? (
          // 👇 Render when signed in
          <TouchableOpacity style={styles.googleButton} onPress={() => signOutOfApp()}>
            <Text style={styles.googleButtonText}>{translate('sign_out')}</Text>
          </TouchableOpacity>
        ) : (
          // 👇 Render when not signed in
          <TouchableOpacity style={styles.googleButton} onPress={() => signInToApp()}>
            <Text style={styles.googleButtonText}>{translate('sign_in')}</Text>
          </TouchableOpacity>
        )}

          </View>
        </View>
      </>
    {userSignedIn ? (
      <>
      <View  style={styles.container}>
        <View style={{ height: 200, justifyContent: 'top' }}>
          <View style={styles.pickerContainer}>
            <Text style={styles.settingTitle}>{translate('select_language')}</Text>
            <Picker
            selectedValue={language}
            onValueChange={(itemValue) => selectLanguage(itemValue)}
            style={styles.picker}
          >
              <Picker.Item
                key={"en"}
                label={"English"}
                value={"en"}
              />
              <Picker.Item
                key={"es"}
                label={"Español"}
                value={"es"}
              />
            </Picker>
          </View>
        </View>
      </View>
      </>
  ) : (  
     <></>
  )}
    {userSignedIn ? (

      <>
      <View  style={styles.container}>
        <Text style={styles.settingTitle}>{translate('unsubscribe')}</Text>
        <Text style={styles.text}>{translate('unsubscribe_text')}</Text>
        <TouchableOpacity style={styles.googleButton} onPress={() => cancelSubscription() }>
          <Text style={styles.googleButtonText}>{translate('unsubscribe_button_text')}</Text>
        </TouchableOpacity>
      </View>
      </>
  ) : (  
     <></>
  )}
    {userSignedIn ? (

      <>
      <View  style={styles.container}>
        <Text style={styles.settingTitle}>Profile</Text>
        <Text style={styles.text}>{translate('profile_settings_text')}</Text>
        <TouchableOpacity style={styles.googleButton} onPress={() => updateProfile() }>
          <Text style={styles.googleButtonText}>{translate('update_profile')}</Text>
        </TouchableOpacity>
      </View>
      </>
  ) : (  
     <></>
  )}
    {userSignedIn ? (

      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('delete_personal_data_title')}</Text>
          <Text style={styles.text}>{translate('delete_personal_data_text')}</Text>
          <TouchableOpacity style={styles.googleButton} onPress={() => deletePersonalData() }>
            <Text style={styles.googleButtonText}>{translate('delete_personal_data_button_text')}</Text>
          </TouchableOpacity>
      </View>
      </>
  ) : (  
     <></>
  )}
    {userSignedIn ? (

      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('delete_account_title')}</Text>
          <Text style={styles.text}>{translate('delete_account_text')}</Text>
          <TouchableOpacity style={styles.googleButton} onPress={() => deleteAccount() }>
            <Text style={styles.googleButtonText}>{translate('delete_account_button_text')}</Text>
          </TouchableOpacity>
      </View>
      </>
  ) : (  
     <></>
  )}
      
      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('terms_of_use_title')}</Text>
          <Text style={styles.text}>{translate('terms_of_use_text')}</Text>
          <TouchableOpacity style={styles.googleButton} onPress={() => viewTermsOfUse() }>
            <Text style={styles.googleButtonText}>{translate('terms_of_use_button_text')}</Text>
          </TouchableOpacity>
      </View>
      </>
      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('privacy_policy_title')}</Text>
          <Text style={styles.text}>{translate('privacy_policy_text')}</Text>
          <TouchableOpacity style={styles.googleButton} onPress={() => viewPrivacyPolicy() }>
            <Text style={styles.googleButtonText}>{translate('privacy_policy_button_text')}</Text>
          </TouchableOpacity>
      </View>
      </>

      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('about')}</Text>
          <Text style={styles.text}>{translate('about_trisummit')}</Text>
      </View>
      </>
      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('version')}</Text>
          <Text style={styles.text}>{translate('build')}</Text>
      </View>
      </>

      <>
      <View  style={styles.container}>
          <Text style={styles.settingTitle}>{translate('beta_testing')}</Text>
          <Text style={styles.text}>{translate('beta_testing_text')}</Text>
      </View>
      </>


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
  },
  text: {
    fontSize: 14,
  },
  centeredText: {
    fontSize: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  pickerContainer: {
    borderColor: '#ccc',
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
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


});

export default SettingsScreenComponent;


/*

<Switch
              trackColor={{ false: '#767577', true: '#3FDD57FF' }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3fdd57"
              onValueChange={ signOut() }
              value={false}
            />
*/