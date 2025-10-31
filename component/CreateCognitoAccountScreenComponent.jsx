import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this
import { useI18n } from '.././context/I18nContext'; 
import { Eye, EyeOff } from "react-native-feather";
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;




const CreateCognitoAccountScreenComponent = ( {route} ) => {

    const { language, setLanguage, translate } = useI18n();
    const navigation = useNavigation();
    const { cognitoCreateAccount, cognitoVerifyAccount } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const verify = async () => {
        try {
            // Here you would typically call your backend or Cognito service to verify the account
            // For example:
            console.log(username);
            console.log(value);

            const resultValue = await cognitoVerifyAccount(username, value);
            console.log(resultValue);
            if(resultValue.message === "success" ) {
                navigation.navigate('Tabs');
            } else {
               setMessage(resultValue.message);
            }

        } catch (err) {
            setMessage(err.message);
        }
    };

    const validatePassword = (password) => {
        const errors = [];

        // Minimum length
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }

        // Uppercase letter
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }

        // Lowercase letter
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }

        // Digit
        if (!/[0-9]/.test(password)) {
            errors.push("Password must contain at least one digit.");
        }

        // Special character
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }

        // No whitespace
        if (/\s/.test(password)) {
            errors.push("Password cannot contain spaces.");
        }

        return errors; // Returns an array of error messages, or empty if valid
    };


    const handleCreateAccount = async ({ username, givenName, familyName, email, password, verifyPassword }) => {
        if (password !== verifyPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            setMessage(passwordErrors.join(" "));
            return;
        }   

        if (username.length < 3) {
            setMessage("Your username must be at least 3 characters long.");
            return;
        }
        if (givenName.length < 1) {
            setMessage("Your username cannot be empty.");
            return;
        }
        if (familyName.length < 1) {
            setMessage("Your family name cannot be empty.");
            return;
        }
        if (fullName.length < 1) {
            setMessage("Your full name cannot be empty.");
            return;
        }
        if (email.length < 5 || !email.includes("@")) {
            setMessage("Please enter a valid email address.");
            return;
        }

        try {   
            // Here you would typically call your backend or Cognito service to create the account
            // For example:
            const results = await cognitoCreateAccount(username, givenName, familyName, fullName, email, password);
            setMessage(results.message);
        } catch (err) {
            setMessage(err.message || JSON.stringify(err));
        }
    }
  return (
    <ScrollView>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Given Name"
        placeholderTextColor="#888"
        value={givenName}
        onChangeText={setGivenName}
      />

      <TextInput
        style={styles.input}
        placeholder="Family Name"
        placeholderTextColor="#888"
        value={familyName}
        onChangeText={setFamilyName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Full Name (first name last name)"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        {showPassword ? (
        <Eye  stroke="black" fill="#fff" width={22} height={22}/>
        ) : (
        <EyeOff  stroke="black" fill="#fff" width={22} height={22}/>
        )}
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Verify Password"
          placeholderTextColor="#888"
          secureTextEntry={!showVerifyPassword}
          value={verifyPassword}
          onChangeText={setVerifyPassword}
        />
        <TouchableOpacity onPress={() => setShowVerifyPassword(!showVerifyPassword)}>
        {showVerifyPassword ? (
        <Eye  stroke="black" fill="#fff" width={22} height={22}/>
        ) : (
        <EyeOff  stroke="black" fill="#fff" width={22} height={22}/>
        )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCreateAccount({ username, givenName, familyName, email, password, verifyPassword })}
      >
        <Text style={styles.buttonText}>{translate('create_account')}</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      {message ?  <Text style={styles.verificationTitle}>Enter Verification Code</Text>  : null }
      {message ?        
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={[styles.cell, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />   : null}

      {message ?        
      <TouchableOpacity
        style={styles.button}
        onPress={() => verify()}
      >
        <Text style={styles.buttonText}>{translate('verify')}</Text>
      </TouchableOpacity>  : null}

    </View>
    </ScrollView>


  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000",
    padding: 10,
    borderRadius: 8,
    margin: 10,
    paddingBottom: 0,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 10,
    justifyContent: 'top',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  verificationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    color: '#333',
    marginTop: 30,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '90%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '90%',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 50,
    paddingRight: 50,
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  root: { padding: 20, alignItems: 'center' },
  title: { fontSize: 22, marginBottom: 20, fontWeight: '600' },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 50,
    height: 50,
    lineHeight: 48,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#ccc',
    textAlign: 'center',
    margin: 5,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: '#007BFF',
    shadowColor: '#007BFF',
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  cellText: { fontSize: 24, textAlign: 'center' },
});

export default CreateCognitoAccountScreenComponent;
