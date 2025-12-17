import React, { useState,  useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookmarkScreenComponent from './BookmarkScreenComponent';
import LoginScreenComponent from './LoginScreenComponent';
import { useI18n } from '.././context/I18nContext'; 
import CreateCognitoAccountScreenComponent from './CreateCognitoAccountScreenComponent';
import AccountVerificationScreenComponent from './AccountVerificationScreenComponent';
import ForgotPasswordScreenComponent from './ForgotPasswordScreenComponent';
import { ThemeContext } from '.././context/ThemeContext';


const BookmarkStack = createNativeStackNavigator();

const BookmarkStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <BookmarkStack.Navigator>
      <BookmarkStack.Screen name="MyBookmarks" 
        options = {{
          title: translate('bookmarks'),
          headerTitleAlign: 'center',
        }}
        component={BookmarkScreenComponent} />

      <BookmarkStack.Screen name="SignIn" component={LoginScreenComponent} options = {{
          title: translate('sign_in'),
          headerTitleAlign: 'center',
        }} />

      <BookmarkStack.Screen name="CreateCognitoAccount"
        options = {{
          title: translate('create_account'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={CreateCognitoAccountScreenComponent} />

      <BookmarkStack.Screen name="AccountVerification"
        options = {{
          title: translate('verify_account'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={AccountVerificationScreenComponent} />

      <BookmarkStack.Screen name="ForgotPassword"
        options = {{
          title: translate('forgot_password'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={ForgotPasswordScreenComponent} />

    </BookmarkStack.Navigator>
  );
};

export default BookmarkStackNavigatorComponent;

