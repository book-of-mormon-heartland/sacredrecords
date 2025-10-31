import { useFocusEffect } from '@react-navigation/native';
import React, { useState,  useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useI18n } from '.././context/I18nContext'; 
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
const tribalImages = require('./../assets/quetzal-image-with-others-400x126.jpg');
//import { useIAP } from 'react-native-iap';
/*
import { RNIap, PurchaseError, requestSubscription, useIAP, validateReceiptIos } from 'react-native-iap';

const subscriptionsSkus = Platform.select({
  ios: ['sacred-records-monthly-subscription']
});
*/

const QuetzalBookScreenComponent = ( ) => {

  /*
  const appleSharedSecred = process.env.APPLE_SHARED_SECRET;
  const {
    connected,
    subscriptions,
    getSubscriptions,
    getActiveSubscriptions,
    currentPurchase,
    finishTransaction,
    purchaseHistory,
    getPurchaseHistory
  } = useIAP();
  */

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const  stripeCallback = Environment.STRIPE_CALLBACK;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  const { language, setLanguage, translate } = useI18n();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const stripeKey=Environment.STRIPE;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();


  const subscribeIos = async() => {
    console.log("Subscribe IOS");
    /*
      try {
        const connection = await RNIap.initConnection();
        console.log("connection in QuetzalBookScreenComponent");
        console.log(connection);
        const subscriptionSkus = ['records_monthly_subscription'];

        //const subscriptions = await RNIap.getSubscriptions(subscriptionSkus);
        const subscriptions = await RNIap.getAvailableSubscriptions();
        console.log("subscriptions");
        console.log(subscriptions);
        //const products = await fetchProducts({ skus: itemSkus });
        //console.log('Products and subscriptions:', products);
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
      */
  }

  const subscribe = async() => {
    console.log("subscribe");
    if(isIOS) {
      console.log("IOS subscribe request");
      subscribeIos();
    } else {
      const subscriptionResults = await checkIfSubscribed();
      if(subscriptionResults.isSubscribed) {
        Alert.alert("You are already subscribed");
        setShowBanner(false);
        //await fetchData();
      } else {
        //console.log("you are not subscribed.  We shall proceed.");
        // do credit card processing here.


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
            Alert.alert(`Error code: ${error.code}`, error.message);
            // PaymentSheet encountered an unrecoverable error. You can display the error to the user, log it, etc.
          }
          
        } else {

          try {

            const clientSecretObj = await createQzSubscriptionIntent(setupIntentResponse);
            console.log("clientSecretObj from createQzSubscriptionIntent");
            console.log(clientSecretObj);

            if(clientSecretObj === undefined) {
              console.log("There was an error processing your payment.  Please try again later.")
              Alert.alert("There was an error processing your payment.  Please try again later.");
              return;
            }
            //console.log(clientSecretObj)
            // when done with CC processing make call to finish purchase.
            // we are subscribed now.
            if(clientSecretObj?.subscriptionId.length>1) {
              await finalizePurchase(clientSecretObj.subscriptionId);
              await determineIfBannerNeeded();
              await fetchData();
              setLoading(false);
            } else {
              return message += " No subscription was created. Contact Support.";
            }
          } catch(err) {
            console.log("Error getting in the process as a whole.");
            console.log(err); 
            return(err);
          }
        }
        //console.log("finalResult from openPaymentSheet");
        //console.log(finalResult);
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
        Alert.alert(`Error initializing: ${initError.message}`);
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
          
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
        return obj;
      }
    } catch (error) {
       return {};
    }

  }

  
  const handlePress = (id, hasChildBooks, title) => {
    
    if(hasChildBooks) {
      navigation.navigate('QzBook', {
        id: id,
        title: title,
      });
    } else {
      navigation.navigate('QzChapters', {
        id: id,
        title: title,
      });
    }

  };

  const determineIfBannerNeeded = async() => {
    const  apiEndpoint = serverUrl + "/subscriptions/getSubscriptions"; // Example endpoint
    const myJwtToken = await retrieveJwtToken();

    //console.log(apiEndpoint);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${myJwtToken}`
        }
      });
      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            saveJwtToken(tokenRefreshObj.jwtToken);
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            deleteJwtToken();
          }
        }
      } else {
        const json = await response.json();
        const message = JSON.parse(json);
        if (message.subscriptions.includes("quetzal-condor")) {
          setShowBanner(false);
        } else {
          setShowBanner(true);
        }

        //setData(json);
      }
    } catch (error) {
      console.log("error in QuetzalBooksScreenComponent - banner");
      console.log(error);
      setShowBanner(true);
    } finally {
    }
  }

  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/books/getBooksByCategory?category=quetzal-condor"; // Example endpoint
    const myJwtToken = await retrieveJwtToken();
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${myJwtToken}`
        }
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
        setData(json);
      }
    } catch (error) {
      console.log("Error in QuetzalBooksScreenComponent fetchData");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await determineIfBannerNeeded();
        await fetchData();
      };
      loadData();

      return () => {
        // cleanup logic
      };
    }, []) // Dependencies array
  );


  const renderItem = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress(item.id, item.hasChildBooks, item.title)}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.thumbnailTitle}</Text>
      </View>
    );
  }

  const renderDummyItem = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity >
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.thumbnailTitle}</Text>
        <Text style={styles.redText}>{translate("subscribe_to_view")}</Text>
      </View>
    );
  }


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }


  if(showBanner) {
    // show the banner and the items not clickable with message.
    return (
      <View style={styles.container} >

        <>
          <LinearGradient
            colors={['#6a11cb', '#2575fc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerContainer}
          >
            <View style={styles.textContainer}>
              <Text style={styles.releaseTitle}>{translate('banner_title')}</Text>
              <Text style={styles.subtitle}>{translate('banner_text_1')}</Text>
              <StripeProvider
                publishableKey={stripeKey} // Replace with your actual publishable key
                urlScheme="com.sacredrecords" // Optional: required for 3D Secure and other payment methods
                merchantIdentifier="merchant.io.trisummit" // Optional: required for Apple Pay
              >
                <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribe() }>
                    <Text style={styles.buttonText}>{translate('banner_button_text')}</Text>
                </TouchableOpacity>
              </StripeProvider>
              <Text style={styles.subtitle}>
                  {translate('banner_text_2')}
              </Text>
              <Text style={styles.price}>{translate('banner_text_3')}</Text>
            </View>
      
          </LinearGradient>
          <View style={styles.topImageContainerWithBanner}>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />
          </View>

          <FlatList
            data={data}
            renderItem={renderDummyItem}
            keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
            numColumns={3}
            contentContainerStyle={styles.listContainer}
          />
          <Text style={styles.text}>{translate("copyright_protected")}</Text>
        </>

      </View>

    );

  } else {
    return (
      <View style={styles.container}>
        <>
      
            <View style={styles.topImageContainerWithoutBanner}>
              <Image
                source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
                style={ styles.topImage }
              />
            </View>

            
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
              numColumns={3}
              contentContainerStyle={styles.listContainer}
            />
          <Text style={styles.text}>{translate("copyright_protected")}</Text>
        </>
      </View>
      
               
    );
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    paddingBottom: 0,
    paddingTop: 10,
    marginBottom: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 0,
    width: 350,

  },
  itemContainer: {

  },
  image: {
    width: '80', // Take up the full width of the item container
    height: '100', // Take up the full width of the item container
    //aspectRatio: 1, // Maintain a square aspect ratio for thumbnails
    borderRadius: 8,
  },
  text: {
    marginTop: 5,
    textAlign: 'center',
  },
  redText: {
    color: '#cc0000',
    marginTop: 5,
    textAlign: 'center',
  },
  bannerContainer: {
    padding: 5,
    marginHorizontal: 0,
    borderRadius: 15,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
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
  releaseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffdb58',
    marginBottom: 5,

  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#e0e0e0',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffdb58', // A contrasting color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginRight: 10,

  },
  subscribeButton: {
    backgroundColor: '#ffdb58', // A contrasting color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginRight: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondSide: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 10,
    marginTop: 10,
  },
  price: {
    fontSize: 12,
    color: '#ffdb58',
    marginBottom: 10,
  },
});

export default QuetzalBookScreenComponent;