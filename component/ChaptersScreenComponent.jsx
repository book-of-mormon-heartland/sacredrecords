import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import { ChevronRight } from "react-native-feather";



const ChapterScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const { jwtToken, setJwtToken, refreshJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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


  const renewTokens = async() => {
    const tokenRefreshObj = await refreshJwtToken();
  }


  const renderItem = ({ item }) => {
    return(
      <TouchableOpacity
            style={styles.listItem}
            onPress={( ) => {
              // Handle navigation to the chapter text
               navigation.navigate('ChapterContent', {
                       id: item.id,
                       title: title,
                       bookId: item.parent,
                       fetchBookmark: "no",
                   });
            }}
          >
        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>{item.title}</Text>
          <Text style={styles.chapterSubtitle}>{item.subTitle}</Text>
        </View>
        <ChevronRight stroke="black" fill="#fff" width={22} height={22} />
      </TouchableOpacity>
    );
  }

  //let newEndpoint = apiEndpoint + "?parent=" + id;
  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/chapters/chapters?parent=" + id; // Example endpoint
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
            fetchData();
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
      console.log("Error");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  /*
  useFocusEffect(
    React.useCallback(async() => {
      const loadData = async () => {
        navigation.setOptions({
            title: title,
        });
        await renewTokens();
        await fetchData();
      }
      await loadData();  
      return () => {
      };
    }, [jwtToken])
  );
*/


  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        navigation.setOptions({
            title: title,
        });
        await renewTokens();
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
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: 5,
      marginVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    textContainer: {
      flex: 1,
    },
    chapterTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    chapterSubtitle: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
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
        numColumns={1}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
    
};

export default ChapterScreenComponent;