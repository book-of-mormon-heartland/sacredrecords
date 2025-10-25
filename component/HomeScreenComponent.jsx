import React, { useContext } from 'react';
import { AuthContext } from '.././context/AuthContext';
import LoginScreenComponent from './LoginScreenComponent.jsx';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent.jsx';


const HomeScreenComponent = ( {navigation} ) => {

  const { jwtToken } = useContext(AuthContext);

  if(jwtToken?.length>0) {
    return (
      <QuetzalBooksScreenComponent />
    );
  } else {
    return (
      <LoginScreenComponent />
    );
  }
};

export default HomeScreenComponent;