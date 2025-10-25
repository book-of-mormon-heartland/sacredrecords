/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { ThemeProvider } from "./context/ThemeContext";
import { I18nProvider } from "./context/I18nContext";
import { AuthProvider } from "./context/AuthContext";
import TabsComponent from './component/TabsComponent'; 
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

function App() {

  return (
    <AuthProvider>
      <I18nProvider>
        <ThemeProvider>
          <NavigationContainer>
            <TabsComponent />
          </NavigationContainer>
        </ThemeProvider>
      </I18nProvider>
    </AuthProvider>
  );
}


export default App;