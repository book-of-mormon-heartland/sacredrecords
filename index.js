/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import 'react-native-get-random-values';
import { initIAP } from './context/iapService.js';
var Environment = require('./context/environment.ts');


//console.log("Web client id");
//console.log(Environment.GOOGLE_WEB_CLIENT_ID);

GoogleSignin.configure({
    webClientId: Environment.GOOGLE_WEB_CLIENT_ID,
    iosClientId: Environment.GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
    offlineAccess: true,
});

initIAP();

AppRegistry.registerComponent(appName, () => App);
