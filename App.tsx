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
import { Platform } from 'react-native';
import { useEffect } from 'react';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { RevenueCatProvider } from "./context/RevenueCatContext";
import { UtilitiesProvider } from "./context/UtilitiesContext";


const Stack = createNativeStackNavigator();

function App() {

  useEffect(() => {
  }, []);



  return (
    <UtilitiesProvider>
      <RevenueCatProvider>
        <AuthProvider>
          <I18nProvider>
            <ThemeProvider>
              <NavigationContainer>
                  <TabsComponent />
              </NavigationContainer>
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </RevenueCatProvider>
    </UtilitiesProvider>
  );
}


export default App;



/*

Help me integrate RevenueCat SDK into my Sacred Records app. I need to:

1. Install the RevenueCat SDK using npm
   - npm: npm install --save react-native-purchases react-native-purchases-ui
   - Documentation: https://www.revenuecat.com/docs/getting-started/installation/reactnative#installation

2. Configure it with my API key: test_IIXtAwnPytnSbAjtOafjqIzngjZ

3. Set up basic subscription functionality in React Native

4. Set up entitlement checking for: Sacred Records Pro

5. Handle customer info and purchases

6. Configure products for my app:
- Monthly (monthly)
- Yearly (yearly)
- Lifetime (lifetime)

Please provide step-by-step instructions for React Native implementation with npm. Include:
- Complete code examples
- Error handling
- Best practices for subscription management
- Customer info retrieval
- Entitlement checking for Sacred Records Pro
- Present a RevenueCat Paywall (https://www.revenuecat.com/docs/tools/paywalls)
- When it makes sense: Add support for Customer Center (https://www.revenuecat.com/docs/tools/customer-center)
- Product configuration and offering setup
- Make sure to implement it all using the best modern methods supported by the RevenueCat SDK.



*/