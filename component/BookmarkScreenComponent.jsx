import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { Platform } from 'react-native';
import { useNavigation, navigate, CommonActions } from '@react-navigation/native';
import { Bookmark, Trash2 } from "react-native-feather";

const BookmarksScreenComponent = ( {route} ) => {

  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const {jwtToken, refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignIn, setShowSignIn] = useState(true);
  
  const [displaySignin, setDisplaySignin] = useState(true);
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }


  const renderItem = ({ item }) => {
    //console.log(item);
    return(
      <View style={styles.row}>
      <TouchableOpacity
        style={styles.listItem}
        onPress={( ) => 
          {
            let category = item.bookCategory;
            let bookshelfDescription = "Bookshelf";
            let bookshelfSubDescription = "MyBookshelf";
            let chaptersDescription = "Chapters";
            let chapterContentDescription = "ChapterContent";

            if(category==="quetzal-condor") {
              //console.log("it is quetzal-condor")
              bookshelfDescription = "Quetzal";
              bookshelfSubDescription = "QuetzalBookshelf";
              chaptersDescription = "QzChapters";
              chapterContentDescription = "QzChapterContent";
            }

            // Handle navigation to the chapter text
            navigation.dispatch(
              CommonActions.reset({
                // 0. The index of the route that should be active (BookPage in this case)
                index: 0,
                routes: [
                  { name: bookshelfDescription,
                    state: {
                      index: 2,
                      routes: [
                        {
                          // Route 0: The Book Details screen (what you want to go *back* to)
                          name: bookshelfSubDescription,
                          screen: bookshelfSubDescription,
                          params: {  }
                        },

                        {
                          // Route 1: The Book Details screen (what you want to go *back* to)
                          name: chaptersDescription,
                          screen: chaptersDescription,
                          params: { 
                            id: item.bookId,
                            title: item.bookTitle
                          }
                        },
                        {
                          // Route 2: The bookmarked page
                          name: chapterContentDescription,
                          screen: chapterContentDescription,
                          params: {
                            id: item.chapterId,
                            title: item.bookTitle,
                            bookId: item.bookId,
                            fetchBookmark: "yes"
                          }
                        },
                      ]
                    }
                  },
                ],
              })
            )
          }
        }
      >
        <Bookmark  stroke="black" fill="#fff" width={22} height={22} />
        <View style={styles.textContainer}>
          <Text style={styles.chapterTitle}>{item.bookTitle}</Text>
          <Text style={styles.chapterSubtitle}>{item.chapterTitle}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Trash2 stroke="black" fill="#fff" width={22} height={22}/>
    </TouchableOpacity>
    </View>
    );
  }
  
    const signInToApp = () => {
        navigation.navigate('SignIn');
    }
  

  //let newEndpoint = apiEndpoint + "?parent=" + id;
  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/bookmarks/getBookmarks"; // Example endpoint
    const myJwtToken = await retrieveJwtToken();
    //let jwtToken = "";
    if(myJwtToken) {
      //jwtToken=myJwtToken; 
      setShowSignIn(false);
    } else {
      setShowSignIn(true);
    }

    if(!myJwtToken) {
      //we are not going to do anything except display a signin button.
      setDisplaySignin(true);
      setLoading(false);
    } else {
      setDisplaySignin(false);
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
          //console.log("bookmarks data");
          //console.log(json);
          setData(json);
        }      
      } catch (error) {
        console.log("Error in BookmarkScreenComponent");
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }


    }
  }

  const handleDelete = async(item) => {
    console.log("delete item");
    console.log(item);
    const myJwtToken = await retrieveJwtToken();
    try {
      const response = await fetch(serverUrl + "/bookmarks/removeBookmark", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
              bookId: item.bookId
          }),
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
        fetchData();
      }      
    } catch (error) {
      console.log("Error in BookmarkScreenComponent");
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }




  } 

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {
      };
    }, [jwtToken])
  );

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

  if(showSignIn) {
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
  } else {
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 10,
  },
  listContainer: {
    padding: 10,
  },
  listItem: {
    width:275,
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
    paddingLeft: 20,
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
  bookmarkContainer: {
    paddingRight: 10,
  },
  deleteButton: {
    paddingLeft: 15,
    paddingVertical: 4,
  },
});

export default BookmarksScreenComponent;