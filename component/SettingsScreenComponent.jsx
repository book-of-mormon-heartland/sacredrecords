import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Switch, Linking, ScrollView, TouchableOpacity, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useI18n } from '.././context/I18nContext'; 
import Purchases from "react-native-purchases";
import { RevenueCatContext } from '.././context/RevenueCatContext';




const SettingsScreenComponent = ( {navigation} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { signOut,  refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken, checkIfStripeSubscribed } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isStripeSubscribed, setIsStripeSubscribed] = useState(false);
  //const [signedIn, setSignedIn] = useState(jwtToken ? true : false);
  const [userSignedIn, setUserSignedIn] = useState(false);
   const {    checkIfSubscribed  } = useContext(RevenueCatContext);
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

  const viewTermsOfUseInApp = async() => {
    navigation.navigate('ViewTerms', {});
  }

  const viewTermsOfUseAppServer = async() => {
    try {
      await Linking.openURL("https://sacred-records-node-prod-376185747738.us-central1.run.app/terms");
    } catch (err) {
      Alert.alert('Error', 'Unable to open terms of use page.');
    }
  }

  const viewTermsOfUseTrisummitServer = async() => {
    try {
      await Linking.openURL("https://trisummit.io/sacred-records-terms-of-use/");
    } catch (err) {
      Alert.alert('Error', 'Unable to open terms of use page.');
    }
  }


  const viewTermsOfUseAppleServer = async() => {
    try {
      await Linking.openURL("");
    } catch (err) {
      Alert.alert('Error', 'Unable to open terms of use page.');
    }
  }


  const viewPrivacyPolicy = async() => {
    try {
      await Linking.openURL('https://trisummit.io/sacred-records-privacy-policy/');
    } catch (err) {
      Alert.alert('Error', 'Unable to open privacy policy page.');
    }
  }


  const cancelSubscription = () => {
    if(isIOS) {
      //Purchases.showManageSubscription();
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    } else {
      console.log("Cancel Subscription");
      navigation.navigate('CancelSubscription', {});
      //Revenue Cat approach
      //Purchases.showManageSubscription();
    }
  }


  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        const myJwtToken = await retrieveJwtToken();
        const isSubscribed = await checkIfSubscribed();
        setIsSubscribed(isSubscribed);

        if(myJwtToken) {
          setUserSignedIn(true)
          const isStripeSubscribed = await checkIfStripeSubscribed();
          setIsStripeSubscribed(isStripeSubscribed);
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

      <>
      <View  style={styles.container}>
        <Text style={styles.settingTitle}>{translate('unsubscribe')}</Text>
        <Text style={styles.text}>{translate('unsubscribe_text')}</Text>
        <TouchableOpacity style={styles.googleButton} onPress={() => cancelSubscription() }>
          <Text style={styles.googleButtonText}>{translate('unsubscribe_button_text')}</Text>
        </TouchableOpacity>
      </View>
      </>
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
        
        <TouchableOpacity style={styles.googleButton} onPress={() => viewTermsOfUseInApp()}>
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
          <Text style={styles.settingTitle}>{translate('support')}</Text>
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
    fontSize: 12,
  },
  textRed: {
    color: "#ff0000",
    fontSize: 12,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  termsButton: {
    flex: 1,
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    marginHorizontal: 5,   // spacing between the buttons
    borderRadius: 5,
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

  termsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },


});

export default SettingsScreenComponent;


/*
Access the indigenous records of the Anishinaabe, Mayan, Incan, Salish, Dene and others. The records are beautiful teachings of their true history. 75% of the proceeds go to tribal unity efforts and to the teaching of the ancient records to the people.

        <TouchableOpacity style={styles.googleButton} onPress={() =>viewTermsOfUseAppServer()}>
          <Text style={styles.googleButtonText}>{translate('terms_of_use_button_text_server')}</Text>
        </TouchableOpacity>


Terms of Use (EULA)

The Sacred Records app has the option for users to sign up for a monthly subscription. The subscription is auto renewing and will remain in effect until cancelled by the user.

- Title of auto-renewing subscription : Sacred Records Monthly Subscription.
- Length of subscription : 30 days from signup with auto renewal every 30 days.
- Price of subscription (IOS): For IOS the price $9.99 USD per month in the United States. For Android the price $9.95 USD per month.

Other locations outside of the United States may have a different price based on Apple policies and exchange rate differences.

- Terms of Use (EULA) is found at https://trisummit.io/sacred-records-terms-of-use/.
- Privacy Policy is found at https://trisummit.io/sacred-records-privacy-policy/.

The subscription can be terminated at any time. Upon termination, you may continue to access subscribed content until the monthly subscription date has passed.\n\nApps made available through the App Store are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a custom end user license agreement between you and the Application Provider (“Custom EULA”), if one is provided. Your license to any Apple App under this Standard EULA or Custom EULA is granted by Apple, and your license to any Third Party App under this Standard EULA or Custom EULA is granted by the Application Provider of that Third Party App. Any App that is subject to this Standard EULA is referred to herein as the “Licensed Application.” The Application Provider or Apple as applicable (“Licensor”) reserves all rights in and to the Licensed Application not expressly granted to you under this Standard EULA.

a. Scope of License: Licensor grants to you a nontransferable license to use the Licensed Application on any Apple-branded products that you own or control and as permitted by the Usage Rules. The terms of this Standard EULA will govern any content, materials, or services accessible from or purchased within the Licensed Application as well as upgrades provided by Licensor that replace or supplement the original Licensed Application, unless such upgrade is accompanied by a Custom EULA. Except as provided in the Usage Rules, you may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time. You may not transfer, redistribute or sublicense the Licensed Application and, if you sell your Apple Device to a third party, you must remove the Licensed Application from the Apple Device before doing so. You may not copy (except as permitted by this license and the Usage Rules), reverse-engineer, disassemble, attempt to derive the source code of, modify, or create derivative works of the Licensed Application, any updates, or any part thereof (except as and only to the extent that any foregoing restriction is prohibited by applicable law or to the extent as may be permitted by the licensing terms governing use of any open-sourced components included with the Licensed Application).

b. Consent to Use of Data: You agree that Licensor may collect and use technical data and related information—including but not limited to technical information about your device, system and application software, and peripherals—that is gathered periodically to facilitate the provision of software updates, product support, and other services to you (if any) related to the Licensed Application. Licensor may use this information, as long as it is in a form that does not personally identify you, to improve its products or to provide services or technologies to you.

c. Termination. This Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms.

d. External Services. The Licensed Application may enable access to Licensor’s and/or third-party services and websites (collectively and individually, \"External Services\"). You agree to use the External Services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party External Services, and shall not be liable for any such third-party External Services. Data displayed by any Licensed Application or External Service, including but not limited to financial, medical and location information, is for general informational purposes only and is not guaranteed by Licensor or its agents. You will not use the External Services in any manner that is inconsistent with the terms of this Standard EULA or that infringes the intellectual property rights of Licensor or any third party. You agree not to use the External Services to harass, abuse, stalk, threaten or defame any person or entity, and that Licensor is not responsible for any such use. External Services may not be available in all languages or in your Home Country, and may not be appropriate or available for use in any particular location. To the extent you choose to use such External Services, you are solely responsible for compliance with any applicable laws. Licensor reserves the right to change, suspend, remove, disable or impose access restrictions or limits on any External Services at any time without notice or liability to you.

e. NO WARRANTY: YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT USE OF THE LICENSED APPLICATION IS AT YOUR SOLE RISK. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE LICENSED APPLICATION AND ANY SERVICES PERFORMED OR PROVIDED BY THE LICENSED APPLICATION ARE PROVIDED \"AS IS\" AND “AS AVAILABLE,” WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, AND LICENSOR HEREBY DISCLAIMS ALL WARRANTIES AND CONDITIONS WITH RESPECT TO THE LICENSED APPLICATION AND ANY SERVICES, EITHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES AND/OR CONDITIONS OF MERCHANTABILITY, OF SATISFACTORY QUALITY, OF FITNESS FOR A PARTICULAR PURPOSE, OF ACCURACY, OF QUIET ENJOYMENT, AND OF NONINFRINGEMENT OF THIRD-PARTY RIGHTS. NO ORAL OR WRITTEN INFORMATION OR ADVICE GIVEN BY LICENSOR OR ITS AUTHORIZED REPRESENTATIVE SHALL CREATE A WARRANTY. SHOULD THE LICENSED APPLICATION OR SERVICES PROVE DEFECTIVE, YOU ASSUME THE ENTIRE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES OR LIMITATIONS ON APPLICABLE STATUTORY RIGHTS OF A CONSUMER, SO THE ABOVE EXCLUSION AND LIMITATIONS MAY NOT APPLY TO YOU.

f. Limitation of Liability. TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR PERSONAL INJURY OR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES WHATSOEVER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL DAMAGES OR LOSSES, ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE LICENSED APPLICATION, HOWEVER CAUSED, REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, OR OTHERWISE) AND EVEN IF LICENSOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OF LIABILITY FOR PERSONAL INJURY, OR OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THIS LIMITATION MAY NOT APPLY TO YOU. In no event shall Licensor’s total liability to you for all damages (other than as may be required by applicable law in cases involving personal injury) exceed the amount of fifty dollars ($50.00). The foregoing limitations will apply even if the above stated remedy fails of its essential purpose.

g. You may not use or otherwise export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained. In particular, but without limitation, the Licensed Application may not be exported or re-exported (a) into any U.S.-embargoed countries or (b) to anyone on the U.S. Treasury Department's Specially Designated Nationals List or the U.S. Department of Commerce Denied Persons List or Entity List. By using the Licensed Application, you represent and warrant that you are not located in any such country or on any such list. You also agree that you will not use these products for any purposes prohibited by United States law, including, without limitation, the development, design, manufacture, or production of nuclear, missile, or chemical or biological weapons.

h. The Licensed Application and related documentation are \"Commercial Items\", as that term is defined at 48 C.F.R. §2.101, consisting of \"Commercial Computer Software\" and \"Commercial Computer Software Documentation\", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.",

i. Except to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Apple shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Apple agree to submit to the personal and exclusive jurisdiction of the courts located within the county of Santa Clara, California, to resolve any dispute or claim arising from this Agreement. If (a) you are not a U.S. citizen; (b) you do not reside in the U.S.; (c) you are not accessing the Service from the U.S.; and (d) you are a citizen of one of the countries identified below, you hereby agree that any dispute or claim arising from this Agreement shall be governed by the applicable law set forth below, without regard to any conflict of law provisions, and you hereby irrevocably submit to the non-exclusive jurisdiction of the courts located in the state, province or country identified below whose law governs:

h. The Licensed Application and related documentation are \"Commercial Items\", as that term is defined at 48 C.F.R. §2.101, consisting of \"Commercial Computer Software\" and \"Commercial Computer Software Documentation\", as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202, as applicable. Consistent with 48 C.F.R. §12.212 or 48 C.F.R. §227.7202-1 through 227.7202-4, as applicable, the Commercial Computer Software and Commercial Computer Software Documentation are being licensed to U.S. Government end users (a) only as Commercial Items and (b) with only those rights as are granted to all other end users pursuant to the terms and conditions herein. Unpublished-rights reserved under the copyright laws of the United States.

i. Except to the extent expressly provided in the following paragraph, this Agreement and the relationship between you and Apple shall be governed by the laws of the State of California, excluding its conflicts of law provisions. You and Apple agree to submit to the personal and exclusive jurisdiction of the courts located within the county of Santa Clara, California, to resolve any dispute or claim arising from this Agreement. If (a) you are not a U.S. citizen; (b) you do not reside in the U.S.; (c) you are not accessing the Service from the U.S.; and (d) you are a citizen of one of the countries identified below, you hereby agree that any dispute or claim arising from this Agreement shall be governed by the applicable law set forth below, without regard to any conflict of law provisions, and you hereby irrevocably submit to the non-exclusive jurisdiction of the courts located in the state, province or country identified below whose law governs:

If you are a citizen of any European Union country or Switzerland, Norway or Iceland, the governing law and forum shall be the laws and courts of your usual place of residence.

Specifically excluded from application to this Agreement is that law known as the United Nations Convention on the International Sale of Goods.


*/