import { createContext, useContext, useState } from  "react";
import { Platform } from 'react-native';  
var Environment = require('.././context/environment.ts');




export const UtilitiesContext = createContext({

});


export const UtilitiesProvider = ({ children }) => {

    const isIOS = ( Platform.OS === 'ios' );
    let serverUrl = Environment.NODE_SERVER_URL;
    if(isIOS) {
        serverUrl = Environment.IOS_NODE_SERVER_URL;
    }


    // The core translation function
    const log = async ( message, level ) => {
        console.log("made it to log");
        try {
            //const url = await fetch(serverUrl + "/authentication/refreshJwtToken", {
            console.log("url " + serverUrl + '/utilities/log');
            await fetch(serverUrl + '/utilities/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    level,
                    platform: Platform.OS,
                }),
            });
        } catch {
            // swallow errors so logging never crashes app
        }
    };

    return (
        <UtilitiesContext.Provider value={{ log }}>
            {children}
        </UtilitiesContext.Provider>
    );
}

