import { useFocusEffect } from '@react-navigation/native';
import React, { useState,  useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import { useI18n } from '.././context/I18nContext'; 
import { RevenueCatContext } from '.././context/RevenueCatContext';
import { UtilitiesContext } from '.././context/UtilitiesContext';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
const tribalImages = require('./../assets/quetzal-image-with-others-400x126.jpg');



const QuetzalBookScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const  stripeCallback = Environment.STRIPE_CALLBACK;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { log } = useContext(UtilitiesContext);
  const { jwtToken, retrieveJwtToken,  checkIfStripeSubscribed, refreshJwtToken } = useContext(AuthContext);
  const { language, setLanguage, translate } = useI18n();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignIn, setShowSignIn] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [dummy, setDummy] = useState(false);
  const [isStripeSubscribed, setIsStripeSubscribed] = useState(false);
  
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const stripeKey=Environment.STRIPE;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {    checkIfSubscribed  } = useContext(RevenueCatContext);
  const { width } = useWindowDimensions();
  const listWidth = width*0.9;





  const subscribeIos = async() => {
    console.log("Subscribe IOS");
    navigation.navigate('AppleSubscription');

  }

  const subscribeAndroid = async() => {
    console.log("Subscribe IOS");
    navigation.navigate('AndroidSubscription');

  }



  const subscribe = async() => {
    console.log("subscribe");
    if(isIOS) {
      //console.log("IOS subscribe request");
      subscribeIos();
    } else {
      subscribeAndroid();
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

  const renewTokens = async() => {
    const tokenRefreshObj = await refreshJwtToken();
  }

  const fetchData = async () => {

    setLoading(true);
    let  apiEndpoint = serverUrl + "/books/getQzBooks"; // Example endpoint
    if(isIOS) {
      apiEndpoint = serverUrl + "/books/appleGetQzBooks"; // Example endpoint
    } else if(isSubscribed) {
      apiEndpoint = serverUrl + "/books/androidGetQzBooks"; // Example endpoint
    }


    const isSubscribed = await checkIfSubscribed();
    const myJwtToken = await retrieveJwtToken();
    
    if(isIOS){
      if(isSubscribed){
        apiEndpoint = serverUrl + "/books/appleGetQzBooks"; // Example endpoint
        //setShowBanner(false);
        setShowSignIn(false);
        setDummy(false);
      } else {
        //setShowBanner(true);
        setShowSignIn(false);
        setDummy(true);
        //setData();
        //return;
      }
    }
    if(!isIOS){
      log("checking isSubscribed", "info");
      log(isSubscribed, "info");
      if(isSubscribed){
        //log("checking isSubscribed", "info");
        //log(isSubscribed, "info");
        //setShowBanner(false);
        setShowSignIn(false);
        setDummy(false);
        apiEndpoint = serverUrl + "/books/androidGetQzBooks"; // Example endpoint
      } else {
        // check if logged in, if no, return.
        //setShowBanner(true);
        //log("checking NOT SUBSCRIBED", "info");

        if(!myJwtToken) {
          //log("NO JwtToken", "info");
          setShowSignIn(true);
          setDummy(true);
          //setData();
          //return;
        } else {
          // logged in, check if stripe subscribed.
          apiEndpoint = serverUrl + "/books/getQzBooks"; // Example endpoint\            
          setShowSignIn(false);
          let returned = await checkIfStripeSubscribed();
          //console.log("logged in isStripeSubscribed");
          //console.log(returned);
          if(returned) {
            setDummy(false);
          } else {
            setDummy(true);
          }
        }
      }
    }
    try {
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log("not okay");
      } else {
        const json = await response.json();
        console.log("json in QuetzalBooksScreenComponent fetchData");
        console.log(json);
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
      console.log("in use focus effect");
      const loadData = async () => {
        renewTokens();
        await fetchData();
      };
      loadData();

      return () => {
        // cleanup logic
      };
    }, [jwtToken]) // Dependencies array
  );

  const signInToApp = () => {
     navigation.navigate('SignIn');

  }

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
      width: listWidth,
      padding: 10,
    },
    rowContainer: {
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      alignItems: 'center', 
      padding: 10,
    },
    signInView: {
      paddingBottom: 20,
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
      fontSize: 12
    },
    redText: {
      color: '#cc0000',
      marginTop: 5,
      textAlign: 'center',
      fontSize: 12
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
      justifyContent: 'center',
    },
    topImageContainerWithBanner: {
    
      marginBottom: 0,
      justifyContent: 'center',
      alignItems: 'center',

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
      width: '150',
      justifyContent: 'center',
      alignItems: 'center',

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
    googleButton: {
      backgroundColor: '#007bff',  
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 20,
      alignSelf: 'flex-start',
      marginRight: 10,
      marginBottom: 10,
      width: '150',
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    googleButtonText: {
      color: '#ffffff', // Google's gray text color
      fontSize: 14,
      fontWeight: 'bold',
    },

  });



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
        <TouchableOpacity  onPress={() => subscribe()}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}  onPress={() => subscribe()}>{item.thumbnailTitle}</Text>
        <Text style={styles.redText} onPress={() => subscribe()}>{translate("subscribe_to_view")}</Text>
      </View>
    );
  }

  const renderDummyItemSignIn = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => signInToApp()}>
          <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}  onPress={() => signInToApp()}>{item.thumbnailTitle}</Text>
        <Text style={styles.redText} onPress={() => signInToApp()} >{translate("sign_in")}</Text>
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
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }
  if(dummy && showSignIn) {
    return (
      <View style={styles.container} >

        <>
          <View style={styles.topImageContainerWithBanner}>
            <View style={styles.rowContainer}>


              <TouchableOpacity style={styles.googleButton} onPress={() => signInToApp()}>
                <Text style={styles.googleButtonText}>{translate('sign_in')}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />
          </View>
          <FlatList
            data={data}
            renderItem={renderDummyItemSignIn}
            keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
            numColumns={3}
            contentContainerStyle={styles.listContainer}
          />
          <Text style={styles.text}>{translate("copyright_protected")}</Text>
        </>
      </View>
    );
  } else if(dummy && !showSignIn) {
    return (
      <View style={styles.container} >
        <>
          <View style={styles.topImageContainerWithBanner}>
            <View style={styles.rowContainer}>
              <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribe() }>
                  <Text style={styles.buttonText}>{translate('subscribe_to_view')}</Text>
              </TouchableOpacity>
            </View>
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
  } else if(!dummy && showSignIn) {
    // should not happen
    return (
      <View style={styles.container} >
        <>
          <View style={styles.topImageContainerWithBanner}>
            <View style={styles.rowContainer}>
              <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribe() }>
                  <Text style={styles.buttonText}>{translate('subscribe_to_view')}</Text>
              </TouchableOpacity>
            </View>
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

  } else if(!dummy && !showSignIn) {
    return (
      <View style={styles.container} >
        <>
          <View style={styles.topImageContainerWithBanner}>
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
  /*
  else if(showBanner) {
    // show the banner and the items not clickable with message.
    return (
      <View style={styles.container} >

        <>
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.subscribeButton} onPress={() => subscribe() }>
                    <Text style={styles.buttonText}>{translate('subscribe_to_view')}</Text>
                </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://storage.googleapis.com/sacred-records/quetzal-image-with-others-400x126.jpg' }}
              style={ styles.topImage }
            />

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
  } 
    
  else {
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
    */

};


export default QuetzalBookScreenComponent;





/*
  const determineIfBannerNeeded = async() => {

    const isSubscribed = await checkIfSubscribed();
    if(isIOS){
      
      if(isSubscribed){
        setShowBanner(false);
        setShowSignIn(false);
        setDummy(false);
        return;
      } else {
        setShowBanner(true);
        setShowSignIn(false);
        setDummy(true);
        return;
      }
    }
    // if subscribed by revenue cat, handle it.
    if(isSubscribed) {
        setShowBanner(false);
        setShowSignIn(false);
        setDummy(false);
    } else {
      
      const  apiEndpoint = serverUrl + "/subscriptions/getSubscriptions"; // Example endpoint
      const myJwtToken = await retrieveJwtToken();
      
      console.log("determining if banner is needed.");
      if(!myJwtToken) {
        setShowBanner(false);
        setDummy(true);
      } else {
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
              
              if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
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
            if (message?.subscriptions.includes("quetzal-condor")) {
              setShowBanner(false);
              setDummy(false);
            } else {
              setShowBanner(true);
              setDummy(false);
            }
          }
        } catch (error) {
          console.log("error in QuetzalBooksScreenComponent - banner");
          console.log(error);
          setShowBanner(true);
        } finally {
          //setLoading(false);
        }
      }

    }
  }
*/
