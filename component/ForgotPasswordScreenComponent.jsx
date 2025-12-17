import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { useI18n } from '.././context/I18nContext'; 
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { Eye, EyeOff } from "react-native-feather";


const CELL_COUNT = 6;

const poolData = {
  UserPoolId: 'us-east-2_Gu5AvTv9i', // your user pool id
  ClientId: '6hfre57q3l5b6si19k6d0rt7ej', // your app client id
};

const userPool = new CognitoUserPool(poolData);

const ForgotPasswordScreenComponent = ( {route}) => {

  const { language, setLanguage, translate } = useI18n();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1 = request code, 2 = reset password
  const [message, setMessage] = useState('');

  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });



  const requestCode = () => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    
    user.forgotPassword({
      onSuccess: () => setMessage('Code sent successfully!'),
      onFailure: err => setMessage(err.message || JSON.stringify(err)),
      inputVerificationCode: () => setStep(2),
    });
    
  };

  const resetPassword = () => {

    if(value.length  !== CELL_COUNT ) {
        setMessage("Verification code must be " + CELL_COUNT + " digits");
        return;
    } 

    const user = new CognitoUser({ Username: username, Pool: userPool });
    //console.log("value");
    //console.log(value);
    //console.log("newPassword");
    //console.log(newPassword);
    
    user.confirmPassword(value, newPassword, {
      onSuccess: () => setMessage('Password reset successful!'),
      onFailure: err => setMessage(err.message || JSON.stringify(err)),
    });
    
  };

  return (
    <View style={styles.container}>
      {step === 1 ? (
        <>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          keyboardType="username"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

          <TouchableOpacity
            style={styles.button}
            onPress={() => requestCode()}
          >
            <Text style={styles.buttonText}>{translate('send_code')}</Text>
          </TouchableOpacity>

        </>
      ) : (
        <>
          <Text  style={styles.text}>Verification Code</Text>
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
          />

          <Text  style={styles.passwordText}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
              <Eye  stroke="black" fill="#fff" width={22} height={22}/>
              ) : (
              <EyeOff  stroke="black" fill="#fff" width={22} height={22}/>
              )}
            </TouchableOpacity>
          </View>
 
          <TouchableOpacity
            style={styles.button}
            onPress={() => resetPassword()}
          >
            <Text style={styles.buttonText}>{translate('reset_password')}</Text>
          </TouchableOpacity>

        </>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
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
  text: {
    fontSize: 18,
    paddingBottom: 5,
  },
  passwordText: {
    fontSize: 18,
    paddingBottom: 5,
    paddingTop: 20,
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

export default ForgotPasswordScreenComponent;
