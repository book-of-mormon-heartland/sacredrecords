import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import { useSubscription } from './useSubscription';

export default function PaywallScreen({ navigation }) {
  const { products } = useSubscription();
  const [loading, setLoading] = useState(false);

  const buySubscription = async () => {
    if (!products.length) return;

    try {
      setLoading(true);
      const purchase = await RNIap.requestSubscription(products[0].productId);
      // send purchase.transactionReceipt to your backend to validate with Apple
      Alert.alert('Success', 'Subscription activated!');
      navigation.replace('MainApp');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      const restored = await RNIap.restorePurchases();
      // Validate receipts server-side
      Alert.alert('Restored', 'Your subscription has been restored.');
      navigation.replace('MainApp');
    } catch (err) {
      Alert.alert('Error', 'Could not restore purchases.');
    }
  };

  const product = products[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock Full Access</Text>
      <Text style={styles.subtitle}>Monthly Subscription</Text>

      {product && (
        <Text style={styles.price}>
          {product.localizedPrice} / month
        </Text>
      )}

      <TouchableOpacity
        style={styles.subscribeButton}
        onPress={buySubscription}
        disabled={loading}
      >
        <Text style={styles.subscribeText}>
          {loading ? 'Processing...' : 'Subscribe Now'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={restorePurchases}>
        <Text style={styles.restore}>Restore Purchases</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 18, textAlign: 'center', marginVertical: 10 },
  price: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginVertical: 20 },
  subscribeButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  subscribeText: { color: 'white', textAlign: 'center', fontSize: 18 },
  restore: { color: '#007AFF', textAlign: 'center', marginTop: 10 },
});