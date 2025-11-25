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
import { Platform } from 'react-native';



//console.log("Web client id");
//console.log(Environment.GOOGLE_WEB_CLIENT_ID);
const isIOS = ( Platform.OS === 'ios' );

let GOOGLE_WEB_CLIENT_ID='376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com';
if(!isIOS) {
    GOOGLE_WEB_CLIENT_ID='422742245899-20ualfjduvocg1hnv4orv5ntj6udd1vq.apps.googleusercontent.com';
}

GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: Environment.GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
    offlineAccess: true,
});

initIAP();

AppRegistry.registerComponent(appName, () => App);
