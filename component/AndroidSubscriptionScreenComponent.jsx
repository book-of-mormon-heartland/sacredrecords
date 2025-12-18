import React, {useEffect, useState, useContext } from 'react';
import {   ScrollView, StyleSheet, Text, View, Platform, TouchableOpacity, Image } from 'react-native';
import { useI18n } from '.././context/I18nContext'; 
var Environment = require('.././context/environment.ts');
import { useNavigation, navigate } from '@react-navigation/native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { AuthContext } from '.././context/AuthContext';
import { RevenueCatContext } from '.././context/RevenueCatContext';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { UtilitiesContext } from '.././context/UtilitiesContext';





const AndroidSubscriptionScreenComponent = ({route}) => {

  const  stripeCallback = Environment.STRIPE_CALLBACK;
  const [loading, setLoading] = useState(false);
  const { jwtToken, refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken,  deleteRefreshToken } = useContext(AuthContext);
  const [subscriptions, setSubscriptions] = useState();
  const { language, setLanguage, translate } = useI18n();
  const { log } = useContext(UtilitiesContext);
  const [ message, setMessage] = useState('');
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;  
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const stripeKey=Environment.STRIPE;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();


  const subscribe = async() => {
    //console.log("subscribe");
    try {
        //setDisplayPaywall(true);
      const result = await RevenueCatUI.presentPaywall();
      if (result === PAYWALL_RESULT.PURCHASED) {
        //console.log("User purchased!");
        log(result, "info");
        // add the flag to the database for access.
        finalizePurchase("RevenueCat");

      } else if (process.env.ENVIRONMENT==="development") {
        console.log("in development, so sending it through");
        finalizePurchase("RevenueCat");
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


  const finalizePurchase = async(subscriptionId) => {
    const myJwtToken = await retrieveJwtToken()
    try {
      const response = await fetch(serverUrl + "/subscriptions/finalizePurchase", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              subscription: "quetzal-condor",
              subscriptionId: subscriptionId
          }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        
        return obj;
      }
    } catch (error) {
       return {};
    }
  }

  const searchTheRecords = () => {
    navigation.navigate('QuetzalBookshelf');
  }

  const signInToApp = () => {
     navigation.navigate('SignIn');
  }

  useEffect( () => {

  }, []);
  


  return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.centerImage}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />
          </View>
          <Text style={styles.text}>{translate('android_subscription_text')}</Text>
          <TouchableOpacity style={styles.submitButton} onPress={() => subscribe() }>
            <Text style={styles.submitButtonText}>{translate('android_subscription_button')}(Testing)</Text>
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
    fontSize: 14,
    color: "#ff0000",
  },
  bottomText: {
    fontSize: 14,
    paddingTop: 15,             // inner spacing
    
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

export default AndroidSubscriptionScreenComponent;


/*

          <Text style={styles.bottomText}>Important Note: If you subscribed prior to December 11, 2025, you subscribed using Stripe and your subscription 
            may still be valid.  Simply sign in to use the application. To improve your user experience, you are recommended to Unsubscribe 
            from Stripe and subscribe with the new process.  By doing so, you will only need to sign in to the application to use enhanced functionality such as 
            bookmarks.</Text>
          <TouchableOpacity style={styles.submitButton} onPress={() => signInToApp()}>
            <Text style={styles.submitButtonText}>{translate('sign_in')}</Text>
          </TouchableOpacity>


translate('android_subscription_text')}

              <StripeProvider
                publishableKey={stripeKey} // Replace with your actual publishable key
                urlScheme="com.sacredrecords" // Optional: required for 3D Secure and other payment methods
                merchantIdentifier="merchant.io.trisummit" // Optional: required for Apple Pay
              >
                <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribe() }>
                    <Text style={styles.buttonText}>{translate('banner_button_text')}</Text>
                </TouchableOpacity>
              </StripeProvider>








  const initializePaymentSheet = async (clientSecret, customerId) => {
    // 1. Initialize the Payment Sheet
    //console.log("in initialize payment sheet");
    //console.log(clientSecret);

    const { error: initError } = await initPaymentSheet({
        setupIntentClientSecret: clientSecret,
        customerId: customerId,
        merchantDisplayName: 'Sacred Records',
        returnURL: stripeCallback,
        // Optionally customize appearance, etc.
    });


    if (initError) {
        Alert.alert(`Error initializing: ${initError?.message}`);
        return false;
    }
    return true;
  };

  const createSetupIntent = async() => {
    try {
      const myJwtToken = await retrieveJwtToken();
      const response = await fetch(serverUrl + '/payments/setupIntent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({  }),
      });
      //console.log("response.ok");
      //console.log(response);
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        const clientSecretObj = await response.json();
        return clientSecretObj;
      }
    } catch (err) {
      console.log("Error in QuetzalBooksScreenComponent onQzCreateSetupIntent")
      console.log(err);
      return (err);
    }

  }


  const createQzSubscriptionIntent = async (paymentMethodId) => {
    //console.log("in qzSubscriptionIntent");
    //console.log(paymentMethodId );
    //console.log(paymentMethodId.setupIntentClientSecret );
    const customerId = paymentMethodId.customerId;
    const setupIntentClientSecret = paymentMethodId.setupIntentClientSecret;

    try {
      const myJwtToken = await retrieveJwtToken();
      setLoading(true);
      const response = await fetch(serverUrl + '/payments/createSubscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
            payment_method_id : paymentMethodId,
            customerId: customerId
          }),
      });
      //console.log("response.ok");
      //console.log(response.ok);
      if (!response.ok) {

        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            deleteJwtToken();
          }
        }
      }
      const subscriptionObj = await response.json();
      console.log(subscriptionObj);

      return subscriptionObj;
      //return clientSecretObj;
    } catch (err) {
      return (err);
    }
  };


  const finalizePurchase = async(subscriptionId) => {
    const myJwtToken = await retrieveJwtToken()
    try {
      const response = await fetch(serverUrl + "/subscriptions/finalizePurchase", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              subscription: "quetzal-condor",
              subscriptionId: subscriptionId
          }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        //console.log(obj);
        if(obj.isSubscribed) {
          await determineIfBannerNeeded();
          await fetchData();
        }
        return obj;
      }
    } catch (error) {
       return {};
    }
  }

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
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        //console.log("checking if subscribed");
        //console.log(obj);
        return obj;
      }
    } catch (error) {
       return {};
    }
  }


*/
/*

  const subscribeWithStripe = async() => {
    console.log("subscribe");
    const subscriptionResults = await checkIfSubscribed();
    if(subscriptionResults.isSubscribed) {
      setMessage("You are already subscribed");  
    } else {
      const setupIntentResponse = await createSetupIntent();
      //console.log(setupIntentResponse);
      let message = setupIntentResponse.message;
      let customerId  = setupIntentResponse.customerId;
      let setupIntentClientSecret = setupIntentResponse.setupIntentClientSecret;
      //console.log("setupIntentClientSecret " + setupIntentClientSecret);
      const initialized = await initializePaymentSheet(setupIntentClientSecret, customerId);
      //console.log("initialized: " + initialized);
      const { error } = await presentPaymentSheet();
      if (error) {
        console.log("we encountered an error");
        //console.log(error);
        if (error.code === "Canceled") {
          // Customer canceled - you should probably do nothing.
        } else {
          Alert.alert(`Error code: ${error.code}`, error?.message);
          // PaymentSheet encountered an unrecoverable error. You can display the error to the user, log it, etc.
        }
      } else {
        try {
          const clientSecretObj = await createQzSubscriptionIntent(setupIntentResponse);
          //console.log("clientSecretObj from createQzSubscriptionIntent");
          //console.log(clientSecretObj);

          if(clientSecretObj === undefined) {
            console.log("There was an error processing your payment.  Please try again later.")
            Alert.alert("There was an error processing your payment.  Please try again later.");
            setMessage("There was an error processing your payment.  Please try again later.");
            return;
          }
          //console.log(clientSecretObj)
          // when done with CC processing make call to finish purchase.
          // we are subscribed now.
          if(clientSecretObj?.subscriptionId.length>1) {
            const result = await finalizePurchase(clientSecretObj.subscriptionId);
            //await determineIfBannerNeeded();
            //await fetchData();
            setMessage(result.message)
            
          } else {
            return message += " No subscription was created. Contact Support.";
          }
        } catch(err) {
          console.log("Error getting in the process as a whole.");
          console.log(err); 
          return(err);
        }
      }
    }
  }

  const initializePaymentSheet = async (clientSecret, customerId) => {
    // 1. Initialize the Payment Sheet
    //console.log("in initialize payment sheet");
    //console.log(clientSecret);

    const { error: initError } = await initPaymentSheet({
        setupIntentClientSecret: clientSecret,
        customerId: customerId,
        merchantDisplayName: 'Sacred Records',
        returnURL: stripeCallback,
        // Optionally customize appearance, etc.
    });


    if (initError) {
        Alert.alert(`Error initializing: ${initError?.message}`);
        return false;
    }
    return true;
  };

  const createSetupIntent = async() => {
    try {
      const myJwtToken = await retrieveJwtToken();
      const response = await fetch(serverUrl + '/payments/setupIntent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({  }),
      });
      //console.log("response.ok");
      //console.log(response);
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        const clientSecretObj = await response.json();
        return clientSecretObj;
      }
    } catch (err) {
      console.log("Error in QuetzalBooksScreenComponent onQzCreateSetupIntent")
      console.log(err);
      return (err);
    }

  }

  const createQzSubscriptionIntent = async (paymentMethodId) => {
    //console.log("in qzSubscriptionIntent");
    //console.log(paymentMethodId );
    //console.log(paymentMethodId.setupIntentClientSecret );
    const customerId = paymentMethodId.customerId;
    const setupIntentClientSecret = paymentMethodId.setupIntentClientSecret;

    try {
      const myJwtToken = await retrieveJwtToken();
      setLoading(true);
      const response = await fetch(serverUrl + '/payments/createSubscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
            payment_method_id : paymentMethodId,
            customerId: customerId
          }),
      });
      //console.log("response.ok");
      //console.log(response.ok);
      if (!response.ok) {

        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            deleteJwtToken();
          }
        }
      }
      const subscriptionObj = await response.json();
      //console.log(subscriptionObj);

      return subscriptionObj;
      //return clientSecretObj;
    } catch (err) {
      return (err);
    }
  };


  const finalizePurchase = async(subscriptionId) => {
    const myJwtToken = await retrieveJwtToken()
    try {
      const response = await fetch(serverUrl + "/subscriptions/finalizePurchase", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              subscription: "quetzal-condor",
              subscriptionId: subscriptionId
          }),
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        
        return obj;
      }
    } catch (error) {
       return {};
    }
  }

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
          
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        //console.log("checking if subscribed");
        //console.log(obj);
        return obj;
      }
    } catch (error) {
       return {};
    }
  }
  */