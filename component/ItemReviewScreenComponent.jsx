import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
var Environment = require('.././context/environment.ts');
import { AuthContext } from '.././context/AuthContext';
import { useI18n } from '.././context/I18nContext'; 
import { useNavigation, navigate } from '@react-navigation/native';
import { StripeProvider, presentPaymentSheet, initPaymentSheet, CardField, useStripe } from '@stripe/stripe-react-native';



const ItemReviewScreenComponent = ( {route} ) => {

  const { language, setLanguage, translate } = useI18n();
  const  envValue = Environment.GOOGLE_IOS_CLIENT_ID;
  const {  refreshJwtToken, setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken, userProfile } = useContext(AuthContext);
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
  const  stripeCallback = Environment.STRIPE_CALLBACK;
  const [bookSubtitle, setBookSubtitle] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookId, setBookId] = useState("");
  const [bookImage, setBookImage] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookPriceText, setBookPriceText] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [discountPriceText, setDiscountPriceText] = useState("");
  const [inputDiscountCode, setInputDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const stripeKey=Environment.STRIPE;



  const applyDiscount = () => {
    if(inputDiscountCode.toLowerCase() === discountCode.toLowerCase() ) {
      //console.log("They are a match.  Apply the Discount");
      setBookPrice(discountPrice);
      setBookPriceText(discountPriceText);
      setDiscountApplied(true);
    } else {
      console.log("Wrong code.  No discount");
    }
  }
 
  const addToBookshelf = async () => {
    // TODO We need to make certain the billing name exists.  if it does not, then need to be redirected to their profile update page.




    const myJwtToken = await retrieveJwtToken();
    let customerId = 0;
    let name;
    let email;
    let clientSecret;
    let ekSecret;
    try {
      const intentResponse = await fetch(serverUrl + '/payments/getPaymentIntent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ amount: Math.floor(bookPrice) }),
      });
      if (!intentResponse.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const intent = await intentResponse.json();
      //console.log(intent);
      customerId=intent.customerId,
      name=intent.name,
      email=intent.email,
      ekSecret=intent.ekSecret,
      clientSecret = intent.clientSecret
    } catch (err) {
      console.log("Error in getPaymentIntent")
      console.log(err);
      
    }

    try {
      const { error: paymentSheetError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        customerId: customerId,  // attach customer
        customerEphemeralKeySecret: ekSecret, // required for returning customers
        merchantDisplayName: 'Sacred Records',
        defaultBillingDetails: { name, email },
      });
      //console.log("now checking for paymentsheet error");
      if (paymentSheetError) {
        Alert.alert('Something went wrong', paymentSheetError.message);
        return;
      }
    } catch (error) {
      console.log(error);
    }

    // 3. Present the Payment Sheet from Stripe
    const { error: paymentError } = await presentPaymentSheet();
    if (paymentError) {
      Alert.alert(`Error code: ${paymentError.code}`, paymentError.message);
      return;
    }
    onCreateOrder();
  }
/*
  const createPaymentIntent = async () => {
    try {
        const myJwtToken = await retrieveJwtToken();
        const response = await fetch(serverUrl + '/payments/intent', {
          
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${myJwtToken}`
            },
            body: JSON.stringify({ amount: Math.floor(bookPrice) }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const paymentIntent = await response.json();
        return paymentIntent;
    } catch (err) {
      console.log("Error in ItemReviewScreenComponent onCreatePaymentIntent")
      console.log(err);
      return (err);
    }
  };
*/
  const onCreateOrder = async() => {
    try {
      const myJwtToken =  await retrieveJwtToken();
      const response = await fetch(serverUrl + '/payments/createOrder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${myJwtToken}`
          },
          body: JSON.stringify({ 
            id: bookId,
            title: bookTitle,
            code: inputDiscountCode,
            bookPrice: Math.floor(bookPrice) 
          }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdOrder = await response.json();
 
      if(createdOrder.message == "success") {
        // lets navigate
        navigation.navigate('Bookshelf', { });
      }

    } catch (err) {
      console.log("Error in ItemReviewScreenComponent onCreateOrder")
      console.log(err);
      return (err);
    } 
  }


  const fetchData = async () => {
    const  apiEndpoint = serverUrl + "/books/bookForReview"; // Example endpoint
    let newEndpoint = apiEndpoint + "?id=" + id;
    const myJwtToken = await retrieveJwtToken();

    try {
      const response = await fetch(newEndpoint, {
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
        let myBook = json[0];
        setBookId(myBook.id);
        setBookTitle(myBook.title);
        setBookSubtitle(myBook.subTitle);
        setBookImage(myBook.image);
        setBookDescription(myBook.Description);
        setBookPrice(myBook.price);
        setBookPriceText(myBook.priceText);
        setDiscountCode(myBook.discountCode);
        setDiscountPrice(myBook.discountPrice);
        setDiscountPriceText(myBook.discountPriceText);
      }
    } catch (error) {
      console.log("Error in ItemReviewScreenComponent");
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
    }, [])
  );


  return (
    <ScrollView style={styles.scrollViewContainer}  horizontal={false}>
      <Text style={styles.headerTitle}>{bookTitle}</Text>
      <Text style={styles.subHeaderTitle}>{bookSubtitle}</Text>
      <Image
        source={{ uri: bookImage }}
        style={styles.productImage}
      />

      <Text style={styles.text}>{bookDescription}</Text>
      <Text style={styles.priceText}>Price: {bookPriceText}</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.centerWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Discount Code"
              value={inputDiscountCode}
              onChangeText={setInputDiscountCode}
            />
            <TouchableOpacity style={styles.applyDiscountButton} onPress={() => applyDiscount()}  activeOpacity={0.7}>
              <Text style={styles.buttonText}>{translate('apply_discount')}</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
      {discountApplied && <Text style={styles.discountApplied}>Discount Applied</Text>}
      <StripeProvider
            publishableKey={stripeKey} // Replace with your actual publishable key
            urlScheme="com.sacredrecords" // Optional: required for 3D Secure and other payment methods
            merchantIdentifier="merchant.io.trisummit" // Optional: required for Apple Pay
          >
        <TouchableOpacity style={styles.button} onPress={() => addToBookshelf()}  activeOpacity={0.7}>
          <Text style={styles.buttonText}>{translate('add_to_bookshelf')}</Text>
        </TouchableOpacity>
      </StripeProvider>
    </ScrollView>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  scrollViewContainer: {
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
  subHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: "center"
  },
  productImage: {
    paddingTop: 20, 
    width: '100%', 
    height: 400, 
    resizeMode: 'contain'
  },
  text: {
    fontSize: 14,
    padding:10
  },
  priceText: {
    fontSize: 14,
    paddingBottom: 10,
    fontWeight: 'bold',
    textAlign: "center"
  },
  discountCodeText: {
    width: 120, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: 80, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputItem: {
    width: 80, // Example width
    height: 20, // Example height
    backgroundColor: 'lightblue',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  buttonText: {
    color: '#fff', // White text
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 10,
    
  },
  applyDiscountView: {
    flexGrow: 0,
    paddingBottom: 10,
  },
  applyDiscountButton: {
    height: 35,
    backgroundColor: '#007bff',
    color: '#fff', // Blue background
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android shadow
  },
  input: {
    height: 35,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 5,
    marginRight: 10
  },
  centerWrapper: {
    flex: 1, // This is key to make the wrapper fill the ScrollView's space.
    width: 400, // Explicitly setting the width to screen width.
    flexDirection: 'row', // As requested, items are side-by-side.
    justifyContent: 'center', // Centers children horizontally.
    alignItems: 'center', // Centers children vertically.
    // Optional: Add padding if you want spacing around the elements.
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    // This style ensures the ScrollView content area is at least the screen width.
    // This is optional but helps with the centering logic.
    minWidth: 250,
    paddingBottom: 20,
  },
  discountApplied: {
    fontSize: 12,
    marginBottom: 5,
    color: "#ff0033",
    textAlign: "center"
  },
});

export default ItemReviewScreenComponent;