module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env', // The module name to import your env variables from
        path: '.env',       // The path to your .env file
        safe: false,        // If true, will not throw an error if .env file is not found
        allowUndefined: true, // If true, allows undefined variables
        verbose: false,     // If true, will log details about the plugin's operations
      },
    ],
  ],
};
