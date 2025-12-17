import React, { useState,  useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenComponent from './HomeScreenComponent';
//import BookScreenComponent from './BookScreenComponent';
import QuetzalBooksScreenComponent from './QuetzalBooksScreenComponent';
import QzBookScreenComponent from './QzBookScreenComponent';
import QzChaptersScreenComponent from './QzChaptersScreenComponent';
import QzChapterContentScreenComponent from './QzChapterContentScreenComponent';
import { useI18n } from '.././context/I18nContext'; 
import AppleSubscriptionScreenComponent from './AppleSubscriptionScreenComponent';
import AndroidSubscriptionScreenComponent from './AndroidSubscriptionScreenComponent';
import QuetzalLoginScreenComponent from './QuetzalLoginScreenComponent';
import LoginScreenComponent from './LoginScreenComponent';
import CreateCognitoAccountScreenComponent from './CreateCognitoAccountScreenComponent';
import AccountVerificationScreenComponent from './AccountVerificationScreenComponent';
import ForgotPasswordScreenComponent from './ForgotPasswordScreenComponent';
import { ThemeContext } from '.././context/ThemeContext';



const BooksStack = createNativeStackNavigator();

const QuetzalCondorStackNavigatorComponent = () => {

  const { language, setLanguage, translate } = useI18n();
  const { theme, setTheme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <BooksStack.Navigator>
      <BooksStack.Screen name="QuetzalBookshelf" options = {{
          title: translate('sacred_records'),
          headerTitleAlign: 'center',
        }} component={QuetzalBooksScreenComponent} />
      <BooksStack.Screen name="QzBook" component={QzBookScreenComponent} />
      <BooksStack.Screen name="QzChapters" component={QzChaptersScreenComponent} />
      <BooksStack.Screen name="QzChapterContent" options = {{
        title: translate('chapter')
      }} component={QzChapterContentScreenComponent} />
      <BooksStack.Screen name="AppleSubscription" options = {{
          title: translate('apple_subscription_button'),
          headerTitleAlign: 'center',
        }}   component={AppleSubscriptionScreenComponent} />
      <BooksStack.Screen name="AndroidSubscription" options = {{
          title: translate('apple_subscription_button'),
          headerTitleAlign: 'center',
        }}   component={AndroidSubscriptionScreenComponent} />
      <BooksStack.Screen name="QuetzalLogin" component={QuetzalLoginScreenComponent} options = {{
          title: translate('records_login'),
          headerTitleAlign: 'center',
        }} />
      <BooksStack.Screen name="SignIn" component={LoginScreenComponent} options = {{
          title: translate('records_login'),
          headerTitleAlign: 'center',
        }} />


      <BooksStack.Screen name="CreateCognitoAccount"
        options = {{
          title: translate('create_account'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={CreateCognitoAccountScreenComponent} />

      <BooksStack.Screen name="AccountVerification"
        options = {{
          title: translate('verify_account'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={AccountVerificationScreenComponent} />

      <BooksStack.Screen name="ForgotPassword"
        options = {{
          title: translate('forgot_password'),
          headerTitleAlign: 'center',
          tabBarStyle: { backgroundColor: theme === "light" ? "#fff" : "#333" },
          tabBarActiveTintColor: theme === "light" ? "#000" : "#fff",
          tabBarInactiveTintColor: theme === "light" ? "#888" : "#aaa",
          tabBarShowLabel: true,

        }}
        component={ForgotPasswordScreenComponent} />






    </BooksStack.Navigator>
  );
};

export default QuetzalCondorStackNavigatorComponent;


/*
    <BooksStack.Navigator>
      <BooksStack.Screen name="MyBookshelf" 
        options = {{
          title: translate('bookshelf'),
        }}
        component={BookshelfScreenComponent} />
      <BooksStack.Screen name="Book" component={BookScreenComponent} />
      <BooksStack.Screen name="Chapters" component={ChaptersScreenComponent} />
      <BooksStack.Screen name="ChapterContent" component={ChapterContentScreenComponent} />
    </BooksStack.Navigator>


*/