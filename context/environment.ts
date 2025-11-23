var _Environments = {
    production:  {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-acvken9o9um72ftrit0n8firk0vrcnsv.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'https://sacred-records-node-prod-376185747738.us-central1.run.app',
        IOS_NODE_SERVER_URL: 'https://sacred-records-node-prod-376185747738.us-central1.run.app',
        STRIPE: 'pk_live_51S5HleROPDEywhha4ZD97cMeYCTJArRE3boDqojvsoFR989Ecf4rbQGZYEdIun3GjUHO2AWvv8zqJTLwlrIwLyrh00dSFVEFrN',
        STRIPE_CALLBACK: 'https://sacred-records-node-prod-376185747738.us-central1.run.app/payments/paymentCallback'
    },
    staging:     {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-acvken9o9um72ftrit0n8firk0vrcnsv.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/',
        IOS_NODE_SERVER_URL: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/',
        STRIPE: 'pk_test_51S5HljI3OpurKhfBz0qlqNOGpHh3JOh04hhZl8ZRWqXh0WMPl8wwLvcgxXYP3LPvmo1uIW15iEhpiEoAkhoLOHZl0018MbHbG7',
        STRIPE_CALLBACK: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/payments/paymentCallback'
    },
    development: {
        GOOGLE_WEB_CLIENT_ID: '376185747738-hced54r8i2jc4bjq428i54dp2g4uhnvo.apps.googleusercontent.com', 
        GOOGLE_ANDROID_CLIENT_ID: '376185747738-ha1jqq32roeta8g7c34c7koend7lmp5o.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'http://10.0.2.2:8080',
        IOS_NODE_SERVER_URL: 'http://192.168.1.171:8080',
        STRIPE: 'pk_test_51S5HljI3OpurKhfBz0qlqNOGpHh3JOh04hhZl8ZRWqXh0WMPl8wwLvcgxXYP3LPvmo1uIW15iEhpiEoAkhoLOHZl0018MbHbG7',
        STRIPE_CALLBACK: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/payments/paymentCallback'
    }
}


function getEnvironment() {
    // This value is defined in the .env file.  
    var platform = process.env.ENVIRONMENT;
    //console.log("platform");
    console.log(platform);
    //platform="development";
    platform="production";
    //console.log(platform);
    // ...now return the correct environment
    return _Environments[platform]
}

var Environment = getEnvironment()
module.exports = Environment