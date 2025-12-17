import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { useI18n } from '.././context/I18nContext'; 
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;




const AccountVerificationScreenComponent = ( {route} ) => {

    const { language, setLanguage, translate } = useI18n();
    const navigation = useNavigation();
    const { cognitoVerifyAccount } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
      value,
      setValue,
    });

    const verify = async () => {

        if(username.length  === 0 ) {
            setMessage("Username is required");
            return;
        }
        if(value.length  !== CELL_COUNT ) {
            setMessage("Verification code must be " + CELL_COUNT + " digits");
            return;
        } 


        try {
            // Here you would typically call your backend or Cognito service to verify the account
            // For example:
            console.log(username);
            console.log(value);

            const resultValue = await cognitoVerifyAccount(username, value);
            console.log(resultValue);
            if(resultValue.message === "Success" ) {
                navigation.goBack();
            } else {
               setMessage(resultValue.message);
            }

        } catch (err) {
            setMessage(err.message);
        }
    };

  return (

    <View style={styles.container}>
      <Text style={styles.title}>{translate('verify_account')}</Text>
      <Text style={styles.text}></Text> 


      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
      />
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

      <TouchableOpacity
        style={styles.button}
        onPress={() => verify()}
      >
        <Text style={styles.buttonText}>{translate('verify')}</Text>
      </TouchableOpacity> 
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
    paddingBottom: 20,
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

export default AccountVerificationScreenComponent;
