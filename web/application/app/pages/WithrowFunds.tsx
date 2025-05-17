import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import envConfig from '@/env';

const WithdrawFundsScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
     
  useEffect(() => {
    const fetchBalance = async () => {
        let balance = await AsyncStorage.getItem('balance');
        setBalance(Number(balance));
    };

    fetchBalance();
  }, []);

  const handleWithdrawFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }

    if (balance !== null && Number(amount) > balance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your current balance.');
      return;
    }

    try {
      const userUId = await AsyncStorage.getItem('authToken');
      if (!userUId) {
        Alert.alert('Error', 'User is not logged in.');
        return;
      }

      setLoading(true);
      const response = await fetch(`${envConfig.API_BASE_URL}/api/main/withdrowFunds`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uId: userUId,
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance((prevBalance) => prevBalance - Number(amount)); // Update local balance
        await AsyncStorage.setItem('balance', balance?.toString());
        Alert.alert('Success', 'Funds withdrawn successfully!');
        navigation.navigate('Dashboard'); // Navigate back to Dashboard
      } else {
        Alert.alert('Error', data?.message || 'Failed to withdraw funds. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Withdraw Funds</Text>
      {balance !== null && (
        <Text style={styles.balanceText}>Current Balance: ${balance.toFixed(2)}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawFunds} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  withdrawButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WithdrawFundsScreen;
