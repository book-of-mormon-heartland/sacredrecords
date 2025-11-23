import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Image, TouchableOpacity, Alert } from 'react-native';
var Environment = require('.././context/environment.ts');
import { ThemeContext } from '.././context/ThemeContext';
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { ArrowRight, ArrowLeft, Bookmark } from "react-native-feather";
import { useI18n } from '.././context/I18nContext'; 

 

const QzChapterContentScreenComponent = ( {route}) => {

  const { language, setLanguage, translate } = useI18n();
  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  const {  setJwtToken, refreshJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken } = useContext(AuthContext);
  //const { id } = route.params;
  const navigation = useNavigation();
  const isIOS = ( Platform.OS === 'ios' );
  let serverUrl = Environment.NODE_SERVER_URL;
  if(isIOS) {
      serverUrl = Environment.IOS_NODE_SERVER_URL;
  }
  const { id, title, positionX, positionY, fetchBookmark, bookId } = route.params;
  const [chapterData, setChapterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [paragraphs, setParagraphs] = useState([]);
  const [chapterSubtitle, setChapterSubtitle] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [previousChapter, setPreviousChapter] = useState("");
  const [followingChapter, setFollowingChapter] = useState("");
  const [chapterId, setChapterId] = useState("");
  //const [bookId, setBookId] = useState("");
  const [currentY, setCurrentY] = useState(0);
  const scrollViewRef = useRef(null);




  const fetchData = async (id) => {
    const  apiEndpoint = serverUrl + "/chapters/qzChapterContentText"; // Example endpoint
    const myJwtToken = await retrieveJwtToken();

    setIsLoading(true);
    let newEndpoint = apiEndpoint + "?id=" + id;
    try {
      const response = await fetch(newEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${myJwtToken}`
        }
      });
      if (!response.ok) {
        console.log("not okay");
        if(response.status === 500) {
          console.log("500");
          console.log("tokenRefreshObject before");
          const tokenRefreshObj = await refreshJwtToken();
          console.log("tokenRefreshObject after");
          console.log(tokenRefreshObj);
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshObj?.message === "update-jwt-token") {
            console.log("Token refresh valid token");
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
        console.log("We got a response");
        const json = await response.json();
        console.log(json);
        let myChapter = {};
        if(json?.message=="success") {
          console.log("we got a success");
          console.log(json);
          myChapter=json?.data[0];
        }
        //let myChapter = json[0];
        //setBookId(myChapter.parent); // only needed for bookmarks
        setChapterData(myChapter);
        setParagraphs(myChapter.content);
        setChapterTitle(myChapter.title);
        setChapterSubtitle(myChapter.subTitle);
        setPreviousChapter(myChapter.previousChapter);
        setFollowingChapter(myChapter.followingChapter);
        navigation.setOptions({
          title: title,
        });
        
      }
    } catch (error) {
      console.log("Error in qzChapterContentScreenComponent");
      console.log(error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };


  
  const retrieveBookmark = async () => {
    const  bookmarkEndpoint = serverUrl + "/bookmarks/getBookmark?bookId=" + bookId; // Example endpoint
    const myJwtToken = await retrieveJwtToken();

    try {
      const response = await fetch(bookmarkEndpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${myJwtToken}`
        }
      });

      if (!response.ok) {
        if(response.status === 500) {
          const tokenRefreshObj = await refreshJwtToken();
          if(tokenRefreshObj?.message === "valid-token" || tokenRefreshOb?.message === "update-jwt-token") {
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
        let newPositionY=json.positionY
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: newPositionY, animated: true });
        }
      }
    } catch (error) {
      console.log("Error in ChapterContentScreenComponent");
      console.log(error);
    } finally {
    }
  };


  useFocusEffect(
    useCallback(() => {
      const fetchDataAndScroll = async () => {
        await fetchData(id);
        if(fetchBookmark=="yes") {
          await retrieveBookmark(bookId);
        }
      };
      fetchDataAndScroll(); // Call the async function immediately
      return () => {
        // Cleanup function remains synchronous
        // For example, to cancel an ongoing fetch request
      };
    }, []) // Added all dependencies
  );

  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fade out, change chapter, then fade in
  const handleChapterChange = (newChapterId) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 20,
      useNativeDriver: true,
    }).start(() => {
      //setChapterId(newChapterId);
      console.log("newChapterId " + newChapterId);
      fetchData(newChapterId);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    });
  };


  const onSwipeLeft = (gestureState) => {
  } 
  const onSwipeRight = (gestureState) => {
  }
 
  const onSwipe = (gestureName, gestureState) => {
    const {SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    switch (gestureName) {
      case SWIPE_LEFT:
        //console.log("swiped left - " + followingChapter);
        //if (followingChapter) handleChapterChange(followingChapter);
        //break;
      case SWIPE_RIGHT:
        //console.log("swiped right - " + previousChapter);
        //if (previousChapter) handleChapterChange(previousChapter);
        //break;
    }
  }

  const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
  };

  const onPreviousPage = () => {
    if(previousChapter != "") {
      handleChapterChange(previousChapter);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
    else {
      console.log("No previous Chapter");
      Alert.alert("No previous chapter.");
    }
  }

  const onNextPage = async() => {
    console.log(followingChapter);




    
    if(followingChapter != "") {
      handleChapterChange(followingChapter);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    } else {
      console.log("No followup Chapter");
      const toRemove = await removeBookmark();
      console.log(toRemove);
      Alert.alert("Congratulations, you have completed the book. Your bookmark is being removed.");
    }
  }

  const removeBookmark = async () => {
    let bookmark = {
      bookId: bookId,
    }
    try {
      const myJwtToken = await retrieveJwtToken();
      const response = await fetch(serverUrl + '/bookmarks/removeBookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify(bookmark),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const bookmarkRemoved = await response.json();
      // navigate to the Bookshelf
      //console.log(bookmarkRemoved);
    } catch (err) {
      console.log(err);
      return (err);
    }
  }

  const createBookmark = async() => {
    let bookmark = {
      bookId: bookId,
      chapterId: id,
      chapterTitle: chapterTitle,
      positionY: currentY
    }
    try {
      const myJwtToken = await retrieveJwtToken();
      const response = await fetch(serverUrl + '/bookmarks/createBookmark', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify(bookmark),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdBookmark = await response.json();
      // navigate to the Bookshelf

    } catch (err) {
      console.log(err);
      return (err);
    }
    //console.log(scrollViewRef.current);
  }

  const renderPoemText = (text) => {
    // Remove the [[poem: and ]] markers
    const poemContent = text.replace('[[poem:', '').replace(']]', '').trim();
    // Split the poem into lines based on newline characters
    const lines = poemContent.split('|');
    return lines.map((line, index) => (
      <Text key={index} style={styles.poemLine}>
        {'  '} {line} {'\n'}
      </Text>
    ));
  };

  const renderFormattedText = (text) => {
    // Base case: if no markdown is found, return the text as is.
    if (!text.includes('**') && !text.includes('*')) {
      return <Text>{text}</Text>;
    }

    // Handle bold first, as it's the more complex, potentially nested element.
    const boldParts = text.split('**');
    const renderedBoldParts = boldParts.map((boldPart, boldIndex) => {
      // If it's an even index, it's not a bold part, so check for italics.
      if (boldIndex % 2 === 0) {
        const italicParts = boldPart.split('*');
        return italicParts.map((italicPart, italicIndex) => {
          // If it's an odd index, it's an italic part.
          if (italicIndex % 2 === 1) {
            return (
              <Text key={`italic-${italicIndex}`} style={{ fontStyle: 'italic' }}>
                {italicPart}
              </Text>
            );
          }
          // Even index is normal text.
          return <Text key={`normal-${italicIndex}`}>{italicPart}</Text>;
        });
      }
      // Odd index is a bold part.
      return (
        <Text key={`bold-${boldIndex}`} style={{ fontWeight: 'bold' }}>
          {boldPart}
        </Text>
      );
    });
    return renderedBoldParts;
  };


  return (
    <View style={styles.container}>
    <ScrollView 
      style={styles.container} 
      ref={scrollViewRef}
      onScroll={event => {
        const yOffset = event.nativeEvent.contentOffset.y;
        setCurrentY(yOffset);
      }}
      scrollEventThrottle={16} 
      >
      <GestureRecognizer
        onSwipe={(direction) => onSwipe(direction)}
        onSwipeLeft={() => onSwipeLeft()}
        onSwipeRight={() => onSwipeRight()}
        config={config}
        style={{
          flex: 1,
          //backgroundColor: state.backgroundColor
        }}
        >
      <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.chapterTitle}>{chapterTitle}</Text>
      <Text style={styles.subTitle}>{chapterSubtitle}</Text>
      {paragraphs.map((paragraph, index) => (
        <View key={index} style={styles.paragraphContainer}>
          { paragraph.startsWith("[[image:")?
            <Image
              source={{ uri: paragraph.replace('[[image:', '').replace(']]', '').trim() }}
              style={{ width: '100%', height: 400, resizeMode: 'contain' }}
            />
            : 
            paragraph.startsWith("[[poem:")? 
            <Text> 
              {renderPoemText(paragraph)}
            </Text>
            :
            <Text style={styles.paragraphText}>
              {renderFormattedText(paragraph)}
            </Text>
          }
        </View>
      ))}
      </Animated.View>
      </GestureRecognizer>

      {/* Navigation Buttons Container */}
      <View style={styles.navigationContainer}>
        {/* Previous Page Button */}
        <TouchableOpacity style={styles.button} onPress={() => onPreviousPage()}>
          <ArrowLeft  stroke="black" fill="#fff" width={22} height={22}/>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        {/* Next Page Button */}
        <TouchableOpacity style={styles.button} onPress={() => onNextPage()}>
          <Text style={styles.buttonText}>Next</Text>
          <ArrowRight  stroke="black" fill="#fff" width={22} height={22}/>
        </TouchableOpacity>
      </View>
    </ScrollView>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => createBookmark()}
        activeOpacity={0.7}
      >
        <Bookmark  stroke="black" fill="#fff" width={22} height={22}/>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    color: "#000",
    borderRadius: 8,
    margin: 5,
    marginBottom: 20,
  },
  paragraphContainer: {
    marginBottom: 16,
    justifyContent: 'top',
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    justifyContent: 'top',
    alignItems: 'left',

  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poemLine: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    paddingLeft: 20,
  },
  navigationContainer: {
    flexDirection: 'row', // Aligns children horizontally
    justifyContent: 'center', // Centers children horizontally within the container
    alignItems: 'center', // Centers children vertically
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: '#EFEFEF', // Light gray background
  },
  buttonText: {
    marginLeft: 5,
    marginRight: 5,
    color: '#007AFF',
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30, // Adjust these values as needed
    right: 30,  // Adjust these values as needed
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default QzChapterContentScreenComponent;