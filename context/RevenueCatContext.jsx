import React, { createContext, useEffect, useState, useContext, useCallback } from 'react';
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';
var Environment = require('.././context/environment.ts');
import RevenueCatUI from "react-native-purchases-ui";
import { UtilitiesContext } from '.././context/UtilitiesContext';


export const RevenueCatContext = createContext();

export const RevenueCatProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [offerings, setOfferings] = useState(null);
  const [activeSubscription, setActiveSubscription] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const isIOS = ( Platform.OS === 'ios' );
  const { log } = useContext(UtilitiesContext);

  //const RC_API_KEY = "test_IIXtAwnPytnSbAjtOafjqIzngjZ";
  //const RC_API_KEY = "appl_fPCDoAZeJPiFJJcBGNVTuWwRdcZ";

  let PRODUCT_ID = "sacred_records_monthly_subscription";
  const GROUP_ID = "sacred_records_subscription_group";

  // --------------------------
  // Initialize RevenueCat
  // --------------------------
  const init = useCallback(async () => {
    try {
      if(isIOS) {
        Purchases.configure({ apiKey: Environment.REVENUE_CAT_API_KEY });
      } else {
        Purchases.configure({ apiKey: Environment.ANDROID_REVENUE_CAT_API_KEY });
      }

      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      // Check subscription status
      setActiveSubscription(
        info.activeSubscriptions &&
        info.activeSubscriptions.includes(PRODUCT_ID)
      );

      // Fetch offerings (includes all packages & products)
      const fetchedOfferings = await Purchases.getOfferings();
      setOfferings(fetchedOfferings);

    } catch (err) {
      console.warn("RevenueCat initialization error:", err);
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  // --------------------------
  // Purchase Subscription
  // --------------------------
  const purchaseMonthly = async () => {
    try {
      if (!offerings || !offerings.current) {
        console.warn("No offerings found.");
        return;
      }

      // Get your product inside the subscription group
      const packageToBuy =
        offerings.current.monthly ??
        offerings.all[GROUP_ID]?.monthly ??
        null;

      if (!packageToBuy) {
        console.warn("Monthly package not found.");
        return;
      }

      const purchaseResult = await Purchases.purchasePackage(packageToBuy);

      setCustomerInfo(purchaseResult.customerInfo);

      setActiveSubscription(
        purchaseResult.customerInfo.activeSubscriptions.includes(PRODUCT_ID)
      );

      return purchaseResult;

    } catch (err) {
      if (!err.userCancelled) {
        console.warn("Purchase error:", err);
      }
    }
  }
  
  const revenueCatLogin = async(userId) => {
    //console.log("This is the userId in revenueCatLogin:" + userId);
    const { customerInfo, created } = await Purchases.logIn(userId);
  }

  const checkIfSubscribed = async () => {
    //log("In checkIfSubscribed", "info");
    if(!initialized) {
      await init();
    }
    
    try {
      console.log("about to get customer info");
      if(!isIOS) {
        //log("In invalidatingCustomerInfoCache", "info");
        //await Purchases.invalidateCustomerInfoCache();
      }


      const customerInfo = await Purchases.getCustomerInfo();

      //log(customerInfo, "info");
      //console.log("Checking hasProEntitlement");
      //log("checking hasProEntitlement", "info");

      const hasProEntitlement = customerInfo.entitlements.active['Sacred Records Pro']?.isActive;
      //log(hasProEntitlement, "info");
      //console.log(hasProEntitlement);
      if (hasProEntitlement) {
        // Grant access
        log("Should be granted access as hasProEntitlement", "info");
        return true;
      }
    } catch (error) {
      //log("got an error in checkIfSubscribed", "info")
      console.error('Error fetching customer info:', error);
      //log(error, "info");
      return false;
    }   
  };


  // --------------------------
  // Restore Purchases
  // --------------------------
  const restore = async () => {
    try {
      const restoredInfo = await Purchases.restorePurchases();
      setCustomerInfo(restoredInfo);

      setActiveSubscription(
        restoredInfo.activeSubscriptions.includes(PRODUCT_ID)
      );
    } catch (err) {
      console.warn("Restore error:", err);
    }
  };

  const logOutCognito = async() => {
    try {
      await Purchases.logOut();
    } catch (error) {

    }
  }


  return (
    <RevenueCatContext.Provider
      value={{
        init,
        isLoading,
        offerings,
        customerInfo,
        activeSubscription,
        purchaseMonthly,
        checkIfSubscribed,
        restore,
        revenueCatLogin,
        logOutCognito
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};
