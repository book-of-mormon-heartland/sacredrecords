//import React, { useState, useContext } from 'react';

import * as RNIap from 'react-native-iap';

// Ensure the SKUs exactly match App Store Connect identifiers
export const subscriptionSkus = ['sacred_records_monthly_subscription']; 
//export  const [connection, setConnection] = useState();

/**
 * Initializes the IAP connection and fetches available subscription products.
 */

export async function initIAP() {
  
  try {
    const iapConnection = await RNIap.initConnection();
    console.log('IAP initialized', iapConnection);
  } catch (err) {
    console.warn('IAP init error', err);
  }
}


