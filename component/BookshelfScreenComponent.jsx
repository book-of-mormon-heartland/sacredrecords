import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { useI18n } from '.././context/I18nContext'; 
import { useNavigation, navigate } from '@react-navigation/native';


const BookshelfScreenComponent = ( ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, setJwtToken, refreshJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [showSignIn, setShowSignIn] = useState(true);
  const { language, setLanguage, translate } = useI18n();  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }

  

  const fetchData = async () => {
    //console.log("doing fetch data");
    const  apiEndpoint = serverUrl + "/books/Bookshelf"; // Example endpoint
    const myJwtToken = await retrieveJwtToken();
    //let jwtToken = "";
    if(myJwtToken) {
      //jwtToken=myJwtToken; 
      setShowSignIn(false);
    } else {
      setShowSignIn(true);
    }

    try {
      //if(!jwtToken){
      //  jwtToken = "";
      //} 
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
      if (!response.ok) {
        console.log("not okay");
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
            setJwtToken(tokenRefreshObj.jwtToken);
            await saveJwtToken(tokenRefreshObj.jwtToken);
            //fetchData();
          } else {
            // its been a week.  Login from this location.
            setJwtToken();
            await deleteJwtToken();
          }
        }
      } else {
        const json = await response.json();
        //console.log(json);
        setData(json);
      }
    } catch (error) {
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [jwtToken])
  );

  const signInToApp = () => {
      navigation.navigate('SignIn');
  }


  const handlePress = (id, hasChildBooks, title) => {

    if(hasChildBooks) {
      navigation.navigate('Book', {
        id: id,
        title: title,
      });
    } else {
      navigation.navigate('Chapters', {
        id: id,
        title: title,
      });
    }

  };

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

  if(showSignIn) {
    return (
      <View style={styles.container}>
        <View style={styles.topImageContainerWithBanner}>
          <TouchableOpacity style={styles.googleButton} onPress={() => signInToApp()}>
            <Text style={styles.googleButtonText}>{translate('sign_in')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()} // Adjust keyExtractor based on your data structure        numColumns={2}
          numColumns={3}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    );

  } else {
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
    elevation: 2,
    marginBottom: 20, // For Android shadow
    marginTop: 10, // For Android shadow
  },
  googleButtonText: {
    color: '#ffffff', // Google's gray text color
    fontSize: 14,
    fontWeight: 'bold',
  },
  topImageContainerWithBanner: {
  
    marginBottom: 0,
  },

});

export default BookshelfScreenComponent;