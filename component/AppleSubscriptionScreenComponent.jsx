import React, {useEffect, useState} from 'react';
import {   ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Image } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');
import { useNavigation, navigate } from '@react-navigation/native';



const subSkus = ['sacred-records-monthly-subscription'];
const errorLog = ({message, error}) => {
  console.error('An error happened', message, error);
};

const isIos = Platform.OS === 'ios';


const AppleSubscriptionScreenComponent = ({route}) => {
  //const { connected, subscriptions, currentPurchase } = useIAP();
  const [loading, setLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState();
  const { language, setLanguage, translate } = useI18n();
  const [ message, setMessage] = useState('');
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  
  const subscriptionSkus = ['sacred_records_monthly_subscription'];

  const getProducts = async () => {
    try {
      const products = await RNIap.getActiveSubscriptions(subscriptionSkus);
      //console.log('Available subscriptions', products);
      setSubscriptions(products);
      //console.log(subscriptions);
    } catch (err) {
      console.warn('getSubscriptions error', err);
    }
  };

  const subscribe = async() => {
    //console.log("subscribe");
    //console.log(RNIap);

    
    try {
      if(subscriptions.length>0) {
       const purchase = await RNIap.requestPurchase(subscriptions[0]);
        //console.log('purchase success', purchase);

        // You’ll send this receipt to your backend
        const receipt = purchase.transactionReceipt;

        if (receipt) {

          const myJwtToken = await retrieveJwtToken();
          const response = await fetch(serverUrl + '/subscriptions/appleVerifySubscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${myJwtToken}`
              },
              body: JSON.stringify({ receipt }),
          });
          if (!response.ok) {

            if(response.status === 400) {
              //console.log("No Receipt");
              setMessage("Subscription Attempt Failed. No Receipt. Contact customer support at brian.nettles@trisummit.io.");
            }
            if(response.status === 401) {
              //console.log("No JwtToken");
              setMessage("No JwtToken");
            }            
            if(response.status === 500) {
              const tokenRefreshObj = await refreshJwtToken();
              
              if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
                setJwtToken(tokenRefreshObj.jwtToken);
                saveJwtToken(tokenRefreshObj.jwtToken);
                //await createQzSubscriptionIntent();
              } else {
                // its been a week.  Login from this location.
                setJwtToken();
                deleteJwtToken();
              }
            }
          } else {
            setMessage(response.message);
            //console.log(response);
            if(response.message=="success") {
              await RNIap.finishTransaction(purchase);
            }
          }
        }
 
      } else {
        setMessage("There are no subscriptions available. Apple has not released it yet. The subscription has been made in App Store Connect and is called sacred_records_monthly_subscription.");
      }
    } catch (err) {
      console.warn('Purchase error', err);
    }
  }


  useEffect( () => {
    const initIAP = async () => {
      try {
        const result = await RNIap.initConnection();
        //console.log('IAP Connection', result);
        //await RNIap.flushFailedPurchasesCachedAsPendingAndroid(); // safe on iOS too
      } catch (err) {
        //console.warn('IAP connection error', err);
      }
    };
    initIAP();
    getProducts();
  }, []);
  
  /*
  const getInformation = async() => {
    try {
      let activeSubscriptions;
      let products;
      console.log("RNIap");
      console.log(RNIap);
      try {
        products = await RNIap.fetchProducts({ skus: subSkus} );
      } catch (err) {
        console.log("fetchProducts error");
        console.log(err);
      }
      console.log("products");
      console.log(products);
      */
      //try {
      //  activeSubscriptions = await RNIap.getActiveSubscriptions({ skus: subSkus} );
      //} catch (err) {
      //  console.log("activeSubscriptions error");
      //  console.log(err)
     // }
      //console.log("activeSubscriptions");
      //console.log(activeSubscriptions);
      /*
      await RNIap.requestSubscription({ sku: productId });
      const activeSubscriptions = await RNIap.getActiveSubscriptions({ skus: subSkus} );
      console.log("activeSubscriptions");
      console.log(activeSubscriptions);
      const activeSubscriptions = await RNIap.getActiveSubscriptions({ skus: subSkus} );
      console.log("activeSubscriptions");
      console.log(activeSubscriptions);
      const activeSubscriptions = await RNIap.getActiveSubscriptions({ skus: subSkus} );
      console.log("activeSubscriptions");
      console.log(activeSubscriptions);
      const activeSubscriptions = await RNIap.getActiveSubscriptions({ skus: subSkus} );
      console.log("activeSubscriptions");
      console.log(activeSubscriptions);
      */
     /*
      // Update your UI with product information
    } catch (error) {
      console.warn('Error fetching subscriptions:', error);
    }
  }
    */


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