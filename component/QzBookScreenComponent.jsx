import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import { RevenueCatContext } from '.././context/RevenueCatContext';



const QzBookScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, setJwtToken, refreshJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken, checkIfStripeSubscribed } = useContext(AuthContext);
  const {    checkIfSubscribed  } = useContext(RevenueCatContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStripeSubscribed, setIsStripeSubscribed] = useState(false);
  const navigation = useNavigation();
  const { id } = route.params;
  const { title } = route.params;
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const { width } = useWindowDimensions();
  const listWidth = width*0.9;
  




  const handlePress = (id, title) => {
    //console.log("this is id " + id)
    navigation.navigate('QzChapters', {
        id: id,
        title: title,
    });
  };


  const renderItem = ({ item }) => {
    return(
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handlePress(item.id, item.thumbnailTitle)}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.text}>{item.thumbnailTitle}</Text>
      </View>
    );
  }


  const fetchData = async () => {
    setLoading(true);
    let  apiEndpoint = serverUrl + "/books/qzBook"; // Example endpoint
    if(isIOS) {
      apiEndpoint = serverUrl + "/books/appleQzBook"; // Example endpoint
    } else if(isSubscribed) {
      apiEndpoint = serverUrl + "/books/androidQzBook"; // Example endpoint
    }

    //let apiEndpoint = serverUrl + "/books/qzBook"; // Example endpoint
    const isSubscribed = await checkIfSubscribed();
    const myJwtToken = await retrieveJwtToken();

    if(isIOS){
      if(isSubscribed){
        apiEndpoint = serverUrl + "/books/appleQzBook"; // Example endpoint
      } else {
        setData();
        setLoading(false);
        return;
      }
    }
    if(!isIOS){
      if(isSubscribed){
        apiEndpoint = serverUrl + "/books/androidQzBook"; // Example endpoint
      } else {
        if(!myJwtToken) {
          setData();
          setLoading(false);
          return;
        } else {
          // logged in, check if stripe subscribed.
          apiEndpoint = serverUrl + "/books/qzBook"; 
          let returned = await checkIfStripeSubscribed();
          console.log("logged in isStripeSubscribed");
          console.log(returned);
          if(returned) {
            apiEndpoint = serverUrl + "/books/qzBook"; // Example endpoint
            // load the data.  Don't return
          } else {
            setData();
            setLoading(false);
            return;
          }
        }
      }
    }


    let newEndpoint = apiEndpoint + "?bookid=" + id;
    try {
      const response = await fetch(newEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${myJwtToken}`
        }
      });
      if (!response.ok) {
        //console.log("not okay");
        if(response.status === 500) {
          //console.log("500");
          const tokenRefreshObj = await refreshJwtToken();
          //console.log("tokenRefreshObject");
          //console.log(tokenRefreshObj);
          if(tokenRefreshObj.message === "valid-token" || tokenRefreshObj.message === "update-jwt-token") {
            //console.log("Token refresh valid token");
            setJwtToken(tokenRefreshObj.jwtToken);
            await saveJwtToken(tokenRefreshObj.jwtToken);
            fetchData()
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            await deleteJwtToken();
          }
        }
      } else {
        console.log("json in qzBook")
        const json = await response.json();
        console.log(json);
        if(json.message=="success") {
          setData(json.book);
        }
        else {
          setMessage(json.message);
        }
      }
    } catch (error) {
      console.log("Error in BookScreenComponent");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        navigation.setOptions({
            title: title,
        });
        await fetchData();
      };
      loadData();
      return () => {
        // cleanup logic
      };
    }, [jwtToken]) // Dependencies array
  );

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
  });

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

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
    
};



export default QzBookScreenComponent;