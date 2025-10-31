import React, { useContext } from 'react';
import { AuthContext } from '.././context/AuthContext';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import CognitoLoginScreenComponent from './CognitoLoginScreenComponent.jsx';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent.jsx';
import { Platform } from 'react-native';



const HomeScreenComponent = ( {navigation} ) => {
  
  const isIOS = ( Platform.OS === 'ios' );

  const { jwtToken } = useContext(AuthContext);

  if(jwtToken?.length>0) {
    return (
      <QuetzalBooksScreenComponent />
    );
  } else {

    if(isIOS) {
      return (
        <LoginScreenComponent />
      );
      
    } else  {
      return (
        <CognitoLoginScreenComponent />
      );
    }
  }
};

export default HomeScreenComponent;