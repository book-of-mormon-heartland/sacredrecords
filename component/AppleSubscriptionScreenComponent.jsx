import { useFocusEffect } from '@react-navigation/native';
import React, {useEffect, useState, useContext } from 'react';
import {   ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Image } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');
import { useNavigation, navigate } from '@react-navigation/native';
import { RevenueCatContext } from '.././context/RevenueCatContext';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';



const AppleSubscriptionScreenComponent = ({route}) => {
  //const { connection } = useIAP();

  const {    isLoading,    activeSubscription,    purchaseMonthly,  } = useContext(RevenueCatContext);
  const [displayPaywall, setDisplayPaywall] = useState(false);
  const { language, setLanguage, translate } = useI18n();
  const [ message, setMessage] = useState('');
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }



 
  const subscribe = async() => {
    console.log("subscribe");
    try {
        //setDisplayPaywall(true);
      const result = await RevenueCatUI.presentPaywall();
      if (result === PAYWALL_RESULT.PURCHASED) {
        console.log("User purchased!");
      }
        //const purchaseResult = await purchaseMonthly();
        //console.log("purchaseResult:");
        //console.log(purchaseResult);
        // upon failure throws error.
    } catch (err) {
      console.warn("Subscription error:", err);
      setMessage("Error when attempting to subscribe: " + err.message );
    } finally {
      navigation.navigate('QuetzalBookshelf');
    }
  }
/*
{ customerInfo: 
   { allPurchasedProductIdentifiers: [ 'monthly' ],
     latestExpirationDateMillis: 1764693205000,
     firstSeenMillis: 1764692891000,
     originalPurchaseDateMillis: null,
     latestExpirationDate: '2025-12-02T16:33:25Z',
     allExpirationDatesMillis: { monthly: 1764693205000 },
     allPurchaseDatesMillis: { monthly: 1764692905000 },
     managementURL: null,
     originalApplicationVersion: null,
     nonSubscriptionTransactions: [],
     firstSeen: '2025-12-02T16:28:11Z',
     allExpirationDates: { monthly: '2025-12-02T16:33:25Z' },
     requestDate: '2025-12-02T16:28:26Z',
     activeSubscriptions: [ 'monthly' ],
     entitlements: 
      { verification: 'NOT_REQUESTED',
        active: 
         { 'Sacred Records Pro': 
            { periodType: 'NORMAL',
              billingIssueDetectedAtMillis: null,
              identifier: 'Sacred Records Pro',
              ownershipType: 'PURCHASED',
              billingIssueDetectedAt: null,
              willRenew: true,
              productPlanIdentifier: null,
              verification: 'NOT_REQUESTED',
              originalPurchaseDateMillis: 1764692905000,
              latestPurchaseDate: '2025-12-02T16:28:25Z',
              latestPurchaseDateMillis: 1764692905000,
              originalPurchaseDate: '2025-12-02T16:28:25Z',
              isActive: true,
              expirationDateMillis: 1764693205000,
              store: 'TEST_STORE',
              expirationDate: '2025-12-02T16:33:25Z',
              productIdentifier: 'monthly',
              isSandbox: true,
              unsubscribeDetectedAt: null,
              unsubscribeDetectedAtMillis: null } },
        all: 
         { 'Sacred Records Pro': 
            { unsubscribeDetectedAt: null,
              expirationDate: '2025-12-02T16:33:25Z',
              latestPurchaseDateMillis: 1764692905000,
              productIdentifier: 'monthly',
              originalPurchaseDate: '2025-12-02T16:28:25Z',
              productPlanIdentifier: null,
              isSandbox: true,
              unsubscribeDetectedAtMillis: null,
              billingIssueDetectedAt: null,
              identifier: 'Sacred Records Pro',
              verification: 'NOT_REQUESTED',
              originalPurchaseDateMillis: 1764692905000,
              periodType: 'NORMAL',
              billingIssueDetectedAtMillis: null,
              ownershipType: 'PURCHASED',
              isActive: true,
              expirationDateMillis: 1764693205000,
              latestPurchaseDate: '2025-12-02T16:28:25Z',
              willRenew: true,
              store: 'TEST_STORE' } } },
     originalPurchaseDate: null,
     originalAppUserId: '$RCAnonymousID:029a5287029b41d48c1ddcf1575f4212',
     allPurchaseDates: { monthly: '2025-12-02T16:28:25Z' },
     subscriptionsByProductIdentifier: 
      { monthly: 
         { purchaseDate: '2025-12-02T16:28:25Z',
           store: 'TEST_STORE',
           periodType: 'NORMAL',
           originalPurchaseDate: '2025-12-02T16:28:25Z',
           storeTransactionId: 'test_1764692905858_700B70EA-8523-4236-A881-84D73F520C6E',
           productIdentifier: 'monthly',
           isSandbox: true,
           unsubscribeDetectedAt: null,
           gracePeriodExpiresDate: null,
           ownershipType: 'PURCHASED',
           isActive: true,
           willRenew: true,
           price: { currency: 'USD', amount: 9.99 },
           billingIssuesDetectedAt: null,
           refundedAt: null,
           expiresDate: '2025-12-02T16:33:25Z' } },
     requestDateMillis: 1764692906346 },
  transaction: 
   { productIdentifier: 'monthly',
     purchaseDate: '2025-12-02T16:28:25Z',
     revenueCatId: 'test_1764692905858_700B70EA-8523-4236-A881-84D73F520C6E',
     productId: 'monthly',
     purchaseDateMillis: 1764692905858.891,
     transactionIdentifier: 'test_1764692905858_700B70EA-8523-4236-A881-84D73F520C6E' },
  productIdentifier: 'monthly' }
*/



  if (isLoading) return <Text>Loading…</Text>; 

  if (activeSubscription)
    return <Text>You already have access.</Text>;

  return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.centerImage}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />
          </View>
          <Text style={styles.text}>{translate('apple_subscription_text')}</Text>

          <TouchableOpacity style={styles.submitButton} onPress={() => subscribe() }>
            <Text style={styles.submitButtonText}>{translate('apple_subscription_button')}</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        {
          displayPaywall ? (
            <RevenueCatUI.Paywall 
                onDismiss={() =>{

                }} />
          ) : ( 
             <></>
          )
        }
      </ScrollView>
  );
}

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
    marginTop: 20,

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
  topImageContainerWithBanner: {
  
    marginBottom: 0,
  },
  topImage: {
    width: '270', // Take up the full width of the item container
    height: '80', // Take up the full width of the item container
    //aspectRatio: 1, // Maintain a square aspect ratio for thumbnails
    borderRadius: 8,
    paddingBottom: 0,
    marginBottom: 0,
    
  },
  centerImage: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',    
  }

});

export default AppleSubscriptionScreenComponent;