import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import envConfig from '@/env';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

let rateLists: any[] = [];
const CurrencyTransaction = () => {
  const navigation = useNavigation(); // Initialize navigation hook
  const [rates, setRates] = useState(rateLists);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [currencyRate, setCurrencyRate] = useState(0);
  const [amount, setAmount] = useState('');
  const [plnAmount, setPlnAmount] = useState('');
  const [type, setType] = useState('');
  const [userBalance, setUserBalance] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [plnbalance, setPlnBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const formattedDate = new Date().toISOString().split('T')[0];
        const API_URL = `https://api.nbp.pl/api/exchangerates/tables/A/${formattedDate}/?format=json`;
        const response = await fetch(API_URL);
        const data = await response.json();

        setRates(data[0]?.rates || []);
        setLoading(false);

      } catch (error) {
        Alert.alert('Warning', 'Currency rates are unavailable at the moment.');
      }
    };

    const fetchUserBalance = async () => {
      try {
        const userUId = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${envConfig.API_BASE_URL}/api/main/getUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uId: userUId }),
        });

        const data = await response.json();
        setUserBalance(data.data?.balance || []);
        setPlnBalance(data.data.plnBalance || 0);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user balance.');
      }
    };

    fetchRates();
    fetchUserBalance();
  }, []);

  const calculatePLNAmount = (enteredAmount: number) => {
    if (currencyRate > 0) {
      const pln = (enteredAmount * currencyRate).toFixed(2);
      setPlnAmount(pln);
    }
  };

  const handleTransaction = async (type:string) => {
    if (!selectedCurrency || !amount || !plnAmount) {
      Alert.alert('Error', 'Please provide all the required details.');
      return;
    }

    const enteredAmount = parseFloat(amount);
    const enteredPlnAmount = parseFloat(plnAmount);
    const apiEndpoint = type === 'buy' ? '/api/main/buyCurrency' : '/api/main/sellCurrecy';
    if (type === 'buy' && enteredPlnAmount > plnbalance) {
      Alert.alert('Error', 'Insufficient PLN balance to buy the selected currency.');
      return;
    }
    if (type === 'sell' && enteredAmount > balance) {
      Alert.alert('Error', `Insufficient balance of ${selectedCurrency} to sell.`);
      return;
    }

    setLoading(true);
    const userUId = await AsyncStorage.getItem('authToken');
    const requestData = {
      amount: enteredAmount,
      plnAmount: enteredPlnAmount,
      userUId,
      currency: selectedCurrency,
    };


    try {
      const response = await fetch(`${envConfig.API_BASE_URL}${apiEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      setLoading(false);
      if (result.success) {
        Alert.alert(
          'Success',
          `Your ${type === 'buy' ? 'purchase' : 'sale'} of ${enteredAmount} ${selectedCurrency} has been successfully processed.`
        );
        navigation.navigate('Dashboard'); // Navigate to the dashboard on success
      } else {
        Alert.alert('Error', `Transaction failed: ${result.message || 'Please try again later.'}`);
      }

      // After transaction, navigate to the dashboard
      
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Transaction failed. Please try again later.');
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.header}>{type === 'buy' ? 'Buy Currency' : 'Sell Currency'}</Text>

        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => {
            setSelectedCurrency(itemValue);
            const rate = rates.find((rate) => rate.code === itemValue)?.mid || 0;
            setCurrencyRate(rate);
            const fetchBalance = userBalance.find((bal: any) => bal.currency === itemValue)?.amount || 0;
            setBalance(fetchBalance);
          }}
          style={styles.picker}
        >
          <Picker.Item label="Select Currency" value="" />
          {rates.map((rate) => (
            <Picker.Item key={rate.code} label={`${rate.currency} (${rate.code})`} value={rate.code} />
          ))}
        </Picker>

        {selectedCurrency && (
          <Text style={styles.balance}>
            Current Balance: {balance} {selectedCurrency}
          </Text>
        )}
<Text style={styles.plnbalance}>PLN Balance: {plnbalance.toFixed(2)} PLN</Text>

        {currencyRate > 0 && <Text style={styles.rate}>Current Rate: {currencyRate} PLN</Text>}

        <TextInput
          style={styles.input}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            calculatePLNAmount(parseFloat(text));
          }}
        />

        {plnAmount && (
          <Text style={styles.plnAmount}>Equivalent PLN Amount: {plnAmount}</Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.buyButton]}
            onPress={() => {
              setType('buy');
              handleTransaction('buy');
            }}
          >
            <Text style={styles.actionButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.sellButton]}
            onPress={() => {
              setType('sell');
              handleTransaction('sell');
            }}
          >
            <Text style={styles.actionButtonText}>Sell</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="#007bff" />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  picker: { height: 50, marginVertical: 20, backgroundColor: '#fff', borderRadius: 8 },
  balance: { fontSize: 16, marginBottom: 10 },
  plnbalance: { fontSize: 16, marginBottom: 20 },
  rate: { fontSize: 16, marginBottom: 10, color: '#555' },
  input: { height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  actionButton: { flex: 1, padding: 15, borderRadius: 5, alignItems: 'center', marginHorizontal: 10 },
  buyButton: { backgroundColor: 'green' },
  sellButton: { backgroundColor: 'red' },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  plnAmount: { fontSize: 16, marginBottom: 20 },
});

export default CurrencyTransaction;
