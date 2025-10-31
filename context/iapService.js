import * as RNIap from 'react-native-iap';

// Ensure the SKUs exactly match App Store Connect identifiers
export const subscriptionSkus = ['records_monthly_subscription']; 

/**
 * Initializes the IAP connection and fetches available subscription products.
 */
export async function initIAP() {
  
  try {
    const connection = await RNIap.initConnection();
    console.log("connection in iapServices");
    console.log(connection);
    //const products = await RNIap.getSubscriptions(subscriptionSkus);
  } catch (err) {
    console.warn('IAP init error', err);
  }
}
