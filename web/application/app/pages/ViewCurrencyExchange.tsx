import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const CurrencyScreen = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)); // Default to today - 2 days
  const [topCount, setTopCount] = useState(10);
  const [isBarChart, setIsBarChart] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchCurrencies = async () => {
    const today = new Date().toISOString().split('T')[0];
    const formattedDate =
      selectedDate.toISOString().split('T')[0] === today
        ? 'today'
        : selectedDate.toISOString().split('T')[0];

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.nbp.pl/api/exchangerates/tables/A/${formattedDate}/?format=json`
      );
      if (response.ok) {
        const data = await response.json();
        const sortedRates = data[0].rates.sort((a: any, b: any) => b.mid - a.mid);
        setCurrencies(sortedRates.slice(0, topCount));
      } else if (response.status === 404) {
        Alert.alert('Warning', 'No data found for the selected date.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [selectedDate, topCount]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCurrencies();
  };

  const renderBarChart = () => {
    const labels = currencies.map((item) => item.code);
    const values = currencies.map((item) => item.mid);

    return (
      <BarChart
        data={{
          labels,
          datasets: [{ data: values }],
        }}
        width={width - 40}
        height={300}
        yAxisLabel="$"
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#e0f7fa',
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          barPercentage: 0.8,
        }}
        style={styles.chart}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {selectedDate.toDateString()}
          </Text>
          <Icon name="calendar" size={20} color="#007bff" />
        </TouchableOpacity>
        <View style={styles.refreshButton}>
          <TouchableOpacity onPress={onRefresh}>
            <Icon name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Count Picker */}
      <View style={styles.topCountContainer}>
        <Text style={styles.topCountLabel}>Top Currencies:</Text>
        <Picker
          selectedValue={topCount}
          onValueChange={(itemValue) => setTopCount(itemValue)}
          style={styles.picker}
        >
          {[5, 10, 15, 20].map((count) => (
            <Picker.Item label={count.toString()} value={count} key={count} />
          ))}
        </Picker>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, isBarChart ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsBarChart(true)}
        >
          <Text style={[styles.viewButtonText, isBarChart && styles.activeButtonText]}>Chart View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewButton, !isBarChart ? styles.activeButton : styles.inactiveButton]}
          onPress={() => setIsBarChart(false)}
        >
          <Text style={[styles.viewButtonText, !isBarChart && styles.activeButtonText]}>List View</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : isBarChart ? (
        <View style={styles.chart}>{renderBarChart()}</View>
      ) : (
        <FlatList
          data={currencies}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.currencyCode}>
                {item.currency} ({item.code})
              </Text>
              <Text style={styles.currencyValue}>${item.mid.toFixed(4)}</Text>
            </View>
          )}
        />
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          maximumDate={new Date()} // Disable future dates
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#007bff',
    marginRight: 5,
    fontWeight: '500',
  },
  topCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  topCountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff',
  },
  picker: {
    width: 120,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  viewButton: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  inactiveButton: {
    backgroundColor: '#ffffff',
    borderColor: '#007bff',
    borderWidth: 1,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  chart: {
    marginVertical: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    backgroundColor: '#ffffff',
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
  },
  currencyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  refreshButton: {
    position: 'absolute',
    
    right: 20,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});


export default CurrencyScreen;
