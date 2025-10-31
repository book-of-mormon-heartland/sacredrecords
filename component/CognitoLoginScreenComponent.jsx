import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '.././context/AuthContext';
import { useNavigation, navigate } from '@react-navigation/native';
import AccountVerificationScreenComponent from './AccountVerificationScreenComponent.jsx';
import { Eye, EyeOff } from "react-native-feather";





const CognitoLoginScreenComponent = ( {route} ) => {

    const navigation = useNavigation();
    
    const { cognitoSignIn } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    

    const handleLogin = async () => {
        try {
            const tokens = await cognitoSignIn(username, password);
            setMessage("Welcome Back " + tokens.username + "!\nYou are being redirected...");

        } catch (err) {
            setMessage(err.message || JSON.stringify(err));
        }
    };

    const handleCreateAccount = async () => {
        navigation.navigate('CreateCognitoAccount');
    };

    const handleResetPassword = async () => {
        navigation.navigate('ForgotPassword');    
    };

    const handleVerifyAccount = async () => {
        console.log("verify account");
        navigation.navigate('AccountVerification', { });
    };


    const handleForgotUsername = async () => {
        console.log("forgot username");
        //navigation.navigate('VerifyCognitoAccount', { username: username });
    };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        onChangeText={setUsername}
        value={username}
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



      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleCreateAccount}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={handleVerifyAccount}>
        <Text style={styles.linkText}>Verify Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={handleResetPassword}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>    );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
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
    width: '300',

  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 50,
    paddingRight: 50,
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  link: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  message: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
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
    width: '300',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },

});

export default CognitoLoginScreenComponent;
