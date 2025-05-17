import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import envConfig from '@/env';

const AddFundsScreen = ({ navigation }: any) => {
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12',
  ];
  const years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() + i).toString());

  const formatCardNumber = (number: string) => {
    return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const validateCardDetails = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Invalid Card Number', 'Card number must be 16 digits.');
      return false;
    }
    if (!selectedMonth || !selectedYear) {
      Alert.alert('Invalid Expiry Date', 'Please select both month and year.');
      return false;
    }
    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert('Invalid CVV', 'CVV must be 3 digits.');
      return false;
    }
    return true;
  };

  const handleAddFunds = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
      return;
    }

    if (!validateCardDetails()) return;

    try {
      setModalMessage('Validating Details...');
      setLoading(true);

      const userUId = await AsyncStorage.getItem('authToken');
      if (!userUId) {
        Alert.alert('Error', 'User is not logged in.');
        return;
      }

      const response = await fetch(`${envConfig.API_BASE_URL}/api/main/addFunds`, {
        method: 'POST',
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
        Alert.alert('Success', 'Funds added successfully!');
        navigation.navigate('Dashboard');
      } else {
        Alert.alert('Error', data?.message || 'Failed to add funds. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
      setModalMessage('');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Funds</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.cardDetails}>
        <Text style={styles.sectionTitle}>Card Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Card Number (16 digits)"
          keyboardType="numeric"
          value={cardNumber}
          maxLength={19}
          onChangeText={(text) => setCardNumber(formatCardNumber(text))}
        />

        <View style={styles.row}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Month</Text>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Month" value="" />
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Year</Text>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Year" value="" />
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="CVV (3 digits)"
          keyboardType="numeric"
          maxLength={3}
          value={cvv}
          onChangeText={setCvv}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddFunds} disabled={loading}>
        <Text style={styles.addButtonText}>Add Funds</Text>
      </TouchableOpacity>

      {loading && (
        <Modal transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.modalText}>{modalMessage}</Text>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  cardDetails: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    marginTop: 15,
    fontSize: 18,
    color: '#fff',
  },
});

export default AddFundsScreen;
