import { createContext, useState } from  "react";
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
var Environment = require('./environment.ts');
import { Platform } from 'react-native';
import { useI18n } from '.././context/I18nContext';
import * as Keychain from 'react-native-keychain'; 
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';



export const AuthContext = createContext("");

export const AuthProvider = ({ children }) => {

    const [googleMessage, setGoogleMessage] = useState("Not Signed In");
    const [userProfile, setUserProfile] = useState(undefined);
    const [jwtToken, setJwtToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");
    const [temporaryJwtToken, setTemporaryJwtToken] = useState("");
    const [temporaryRefreshToken, setTemporaryRefreshToken] = useState("");
    
    const { language, setLanguage, translate } = useI18n();
    const isIOS = ( Platform.OS === 'ios' );
    let serverUrl = Environment.NODE_SERVER_URL;
    if(isIOS) {
        serverUrl = Environment.IOS_NODE_SERVER_URL;
    }

    const saveJwtToken = async(token) => {
        try {
            // You can use a static string like 'jwtToken' for the username
            // or a user-specific identifier if needed.
            await Keychain.setGenericPassword('jwtToken', token);
            //console.log('JWT token saved successfully!');
        } catch (error) {
            console.error('Error saving JWT token:', error);
        }
    }

    const retrieveJwtToken = async() => {
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                //console.log('JWT token retrieved successfully:', credentials.password);
                
                return credentials.password; // This is your JWT token
            } else {
            //console.log('No JWT token found.');
            return null;
            }
        } catch (error) {
            console.error('Error retrieving JWT token:', error);
            return null;
        }
    }

    const deleteJwtToken = async() => {
        try {
            await Keychain.resetGenericPassword();
            //console.log('JWT token deleted successfully!');
        } catch (error) {
            console.error('Error deleting JWT token:', error);
        }
    }

    const refreshJwtToken = async () => {
        try {
            const postResponse = await fetch(serverUrl + "/authentication/refreshJwtToken", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify({ 
                    jwtToken: jwtToken, 
                    refreshToken: refreshToken,
                    userId: userProfile.id
                }),
            });
            if (!postResponse.ok) {
                console.log("It was an error");
                throw new Error(`HTTP error! status: ${postResponse.status}`);
            }
            const responseData = await postResponse.json();
            const obj = JSON.parse(responseData);
            //console.log(obj);
            
            if(obj.message==="update-jwt-token") {
              //console.log("This is the new jwtToken: " +  obj.jwtToken);
              setJwtToken(obj.jwtToken);
              return obj;
            }
        } catch (error) {
            console.error('Error:', error);
            return JSON.stringify({
                message: "failure to update",
                jwtToken: ""
            });
        }
    }

    const googleSignIn = async () => {
       try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            //console.log("play services passed")
            const response = await GoogleSignin.signIn();
            //console.log(response);
            if(isSuccessResponse(response)){
                //console.log("Google Sign-In Success: ", response.data );
                let user = response.data.user;
                let idToken = response.data.idToken;

                // from here we make calls to server to authenticate to the rest server.
                
                try {
                    //console.log(serverUrl + "/authentication/googleLogin");
                    
                    const postResponse = await fetch(serverUrl + "/authentication/googleLogin", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: idToken, user: user }),
                    });
                    if (!postResponse.ok) {

                        //console.log("Response not ok");
                        throw new Error(`HTTP error! status: ${postResponse.status}`);
                    }
                    const responseData = await postResponse.json();
                    const obj = JSON.parse(responseData);
                    //console.log(obj);

                    if(obj?.language && (obj.language != "")) {
                        //console.log("Language from server: " + obj.language);
                        setLanguage(obj.language);
                    }

                    if(obj?.jwtToken) {
                        //console.log("Next is the signIn jwt token value");
                        //console.log(obj.jwtToken);
                        setJwtToken(obj.jwtToken || "");
                        setRefreshToken(obj.refreshToken || "");
                        setGoogleMessage("Logged In Successfully");
                        setUserProfile(user);
                        //setUserToken(idToken);
                        saveJwtToken(obj.jwtToken);
                        setTemporaryJwtToken("");
                        setTemporaryRefreshToken("");
                        return "true";

                    } else {
                        console.log("No JWT Token returned from server.");
                    }
                } catch (error) {
                    console.log("We got some error here.")
                    console.error('Error:', error);
                    return "false";
                }
            } else {
                //console.log("NOT Successful: ", response.data );
                setGoogleMessage( "Not Successful");
                setUserProfile(undefined);
                deleteJwtToken();
                setJwtToken("");
                setRefreshToken("");
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
                return false;
            }
        } catch (error) {
            //console.log("Error: ", error );

            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                setGoogleMessage('User cancelled the login flow');
                setUserProfile(undefined);
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
            } else if (error.code === statusCodes.IN_PROGRESS) {
                setGoogleMessage('Sign in is in progress already');
                setUserProfile(undefined);
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                setGoogleMessage('Play services not available or outdated');
                setUserProfile(undefined);
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
            } else {
                setGoogleMessage(`Some other error happened: ${error.message}`);
                setUserProfile(undefined);
                setJwtToken("");
                setRefreshToken("");
                deleteJwtToken();
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
            }
            return false;

        }
    };


  const googleSignOut = async () => {
        //console.log("signOut");
        const userid = userProfile?.id  || "0";
        try {
            const signoutResponse = await GoogleSignin.signOut();
            setGoogleMessage('Not Signed In'); 
            setUserProfile(undefined);
            setJwtToken("");
            setRefreshToken("");
            deleteJwtToken();
            setTemporaryJwtToken("");
            setTemporaryRefreshToken("");

            // need to do GoogleSignin.disconnect also.
        } catch (error) {
            console.log('Google Sign-Out Error: ', error);
        }
    }

    const appleSignIn = async (response, userData) => {
        //console.log("appleSignIn");
        //let fullName = userData?.fullName?.givenName + " " + userData?.fullName?.familyName || "";
        //let givenName = userData?.fullName?.givenName || "";
        //let familyName = userData?.fullName?.familyName || "";


        let givenName = userData?.fullName?.givenName || "";
        let familyName = userData?.fullName?.familyName || "";
        let fullName = `${givenName} ${familyName}`.trim();

        //let personsName = ""; 
        try {
            let idToken = response.identityToken;
            let authorizationCode = response.authorizationCode;
            let email = response.email | "";
            let nonce = response.nonce;

            const postResponse = await fetch(serverUrl + "/authentication/appleLogin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName:  fullName,
                    familyName:  familyName,
                    givenName : givenName,
                    idToken : idToken,
                    authorizationCode : authorizationCode,
                    nonce : nonce,
                }),
            });

            if (!postResponse.ok) {
                console.log("error on server side - Status is: ");
                //console.log(postResponse.status);
                return postResponse.status;
            }
            const responseData = await postResponse.json();
            //console.log("responseData");
            //console.log(responseData);
            //console.log(responseData.language);
            //const obj = JSON.parse(responseData);
            if(responseData?.language && (responseData.language != "")) {
                //console.log("Language from server: " + obj.language);
                setLanguage(responseData.language);
            }
            let message = responseData.message;
            let jwtToken = responseData.jwtToken;
            let refreshToken = responseData.refreshToken;
            if(responseData.message!="updateProfile") {
                //console.log("this is the responseData.user");
                //console.log(responseData.user);
                setUserProfile(responseData.user);
                setJwtToken(responseData.jwtToken || "");
                setRefreshToken(responseData.refreshToken || "");
                saveJwtToken(responseData.jwtToken);
            } else {
                setTemporaryJwtToken(responseData.jwtToken || "");
                setTemporaryRefreshToken(responseData.refreshToken || "");
            }

            return responseData.message;

        } catch( error )  {
            setUserProfile(undefined);
            setJwtToken("");
            setRefreshToken("");
            deleteJwtToken();
            setTemporaryJwtToken("");
            setTemporaryRefreshToken("");
            return false;
        }
        return false;
    };



    const poolData = {
        UserPoolId: 'us-east-2_Gu5AvTv9i', // replace with your user pool ID
        ClientId: '6hfre57q3l5b6si19k6d0rt7ej', // replace with your app client ID
    };
    const userPool = new CognitoUserPool(poolData);

    
    const cognitoSignIn = async (Username, Password) => {
        
        const user = new CognitoUser({ Username, Pool: userPool });
        const authDetails = new AuthenticationDetails({ Username, Password });
        console.log(user);

        const authenticatedUser = await new Promise((resolve, reject) => {
            user.authenticateUser(authDetails, {
                onSuccess: async (session) => {
                    const idToken = session.getIdToken().getJwtToken();
                    const refreshToken = session.getRefreshToken().getToken();
                    const accessToken = session.getAccessToken().getJwtToken();
                    resolve({ idToken, accessToken, refreshToken });
                    //console.log("user")
                    //console.log(user);
                },
                onFailure: (err) => {
                    console.log("Failed to login");
                    reject(err);
                } ,
                });
            });
        
        // here we go to the server.  If we got here, the sign in was successful.
        console.log("Authenticated User:");
        console.log(authenticatedUser.idToken);
        try {
            const postResponse = await fetch(serverUrl + "/authentication/cognitoLogin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: authenticatedUser.idToken }),
            });
            if (!postResponse.ok) {

                console.log("Response not ok");
                throw new Error(`HTTP error! status: ${postResponse.status}`);
            }
            const responseData = await postResponse.json();
            const obj = JSON.parse(responseData);
            //console.log(obj);
            
            if(obj?.language && (obj.language != "")) {
                setLanguage(obj.language);
            }

            if(obj?.jwtToken) {
                setJwtToken(obj.jwtToken || "");
                setRefreshToken(obj.refreshToken || "");
                setGoogleMessage("Logged In Successfully");
                setUserProfile(user);
                saveJwtToken(obj.jwtToken);
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
                return "true";
            } else {
                console.log("No JWT Token returned from server.");
                setJwtToken("");
                setRefreshToken("");
                setGoogleMessage("Not Logged In");
                setUserProfile();
                saveJwtToken("");
                setTemporaryJwtToken("");
                setTemporaryRefreshToken("");
                return "false";
            }
            
        } catch (error) {
            console.log("We got some error here.")
            console.error('Error:', error);
            return "false";
        }
        return user;
    };

    const cognitoCreateAccount = async (username, givenName, familyName, fullName, email, password) => {
      //console.log("cognitoCreateAccount called");
      // send it to the sserver to create the account.
      try {
          const postResponse = await fetch(serverUrl + "/authentication/cognitoCreateAccount", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, givenName, familyName, fullName, email, password }),
          });
          if (!postResponse.ok) {

              console.log("Response not ok");
              throw new Error(`HTTP error! status: ${postResponse.status}`);
          }
          const responseData = await postResponse.json();
          return responseData;
    
        } catch (error) { 
            console.log("We got some error here.")
            console.error('Error:', error);
            throw error;
        }
    }

    const cognitoVerifyAccount = async (username, verificationCode) => {
      console.log("cognitoVerifyAccount called");
      console.log('username');
      console.log(username);
      console.log('verificationCode');
      console.log(verificationCode);

      // send it to the sserver to create the account.
      try {
          const postResponse = await fetch(serverUrl + "/authentication/cognitoVerifyAccount", {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, verificationCode }),
          });
          if (!postResponse.ok) {

              console.log("Response not ok");
              //throw new Error(`HTTP error! status: ${postResponse.status}`);
          }
          const responseData = await postResponse.json();
           console.log(responseData);
          return responseData;
    
        } catch (error) { 
            console.log("We got some error here.")
            console.error('Error:', error);
            throw error;
        }
    }


    return (
        <AuthContext.Provider value={{ cognitoSignIn, cognitoCreateAccount, cognitoVerifyAccount, appleSignIn, googleSignIn, googleSignOut, googleMessage, setGoogleMessage, userProfile, setUserProfile, jwtToken,  setJwtToken, saveJwtToken, retrieveJwtToken, deleteJwtToken, refreshJwtToken, setRefreshToken, temporaryJwtToken, setTemporaryJwtToken, temporaryRefreshToken, setTemporaryRefreshToken }}>
            { children }
        </AuthContext.Provider>
    );
    
}
