var _Environments = {
    production:  {
        GOOGLE_ANDROID_CLIENT_ID: '422742245899-l2sestuh3bcqdvb9bd54m99hrabrfis4.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'https://sacred-records-node-prod-376185747738.us-central1.run.app',
        IOS_NODE_SERVER_URL: 'https://sacred-records-node-prod-376185747738.us-central1.run.app',
        STRIPE: 'pk_live_51S5HleROPDEywhha4ZD97cMeYCTJArRE3boDqojvsoFR989Ecf4rbQGZYEdIun3GjUHO2AWvv8zqJTLwlrIwLyrh00dSFVEFrN',
        STRIPE_CALLBACK: 'https://sacred-records-node-prod-376185747738.us-central1.run.app/payments/paymentCallback'
    },
    staging:     {
        GOOGLE_ANDROID_CLIENT_ID: '422742245899-6ga6ug2poovaup3muf3dvt7lgv5hjnna.apps.googleusercontent.com', 
        GOOGLE_IOS_CLIENT_ID: '376185747738-t1nrjh269jqarco0grlo6a5vs8fcbf8b.apps.googleusercontent.com',
        NODE_SERVER_URL: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/',
        IOS_NODE_SERVER_URL: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/',
        STRIPE: 'pk_test_51S5HljI3OpurKhfBz0qlqNOGpHh3JOh04hhZl8ZRWqXh0WMPl8wwLvcgxXYP3LPvmo1uIW15iEhpiEoAkhoLOHZl0018MbHbG7',
        STRIPE_CALLBACK: 'https://sacred-records-node-dev-shell-376185747738.us-central1.run.app/payments/paymentCallback'
    },
    development: {
        GOOGLE_ANDROID_CLIENT_ID: '422742245899-ufr5f16vg2qot4v8lig4fg7osb4ettd6.apps.googleusercontent.com', 
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
    //console.log(platform);
    platform="production";
    //platform="production";
    //console.log(platform);
    // ...now return the correct environment
    return _Environments[platform]
}

var Environment = getEnvironment()
module.exports = Environment