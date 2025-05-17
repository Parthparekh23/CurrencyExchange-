import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  ScrollView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import envConfig from '@/env';

const DashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${envConfig.API_BASE_URL}/api/main/getUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uId: authToken }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('balance', parseFloat(data.data.plnBalance).toFixed(2));
        setUser(data.data);
        setProfileImage(data.data.profileImage);
      } else {
        Alert.alert('Error', data?.message || 'Failed to fetch user data.');
      }
    } catch {
      Alert.alert('Error', 'Unable to fetch user data.');
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${envConfig.API_BASE_URL}/api/main/getAllTransaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userUId: authToken }),
      });

      const data = await response.json();

      if (response.ok) {
        const sortedTransactions = data.data.sort(
          (a: any, b: any) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        setTransactionHistory(sortedTransactions);
      } else {
        Alert.alert('Error', 'Failed to fetch transaction history.');
      }
    } catch {
      Alert.alert('Error', 'Unable to fetch transaction history.');
    }
  };

  const handleUploadProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        const base64Image = result.assets[0].base64;

        const response = await fetch(`${envConfig.API_BASE_URL}/api/main/uploadProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uId: user.uId, imgstring: base64Image }),
        });

        if (response.ok) {
          setProfileImage(base64Image || '');
          Alert.alert('Success', 'Profile picture updated successfully.');
        } else {
          Alert.alert('Error', 'Failed to upload profile picture.');
        }
      }
    } catch {
      Alert.alert('Error', 'An error occurred while uploading the picture.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUserData(), fetchTransactionHistory()]);
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return '#007bff';
      case 'sell':
        return '#f39c12';
      case 'fund added':
        return '#28a745';
      case 'withdraw':
        return '#e74c3c';
      default:
        return '#000';
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [])
  );

  return (
    <>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)}>
          {profileImage ? (
            <Image source={{ uri: `data:image/png;base64,${profileImage}` }} style={styles.profileIcon} />
          ) : (
            <FontAwesome5 name="user-circle" size={24} color="#2c3e50" />
          )}
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Currency Exchange</Text>
      </View>

      <FlatList
        data={transactionHistory}
        keyExtractor={(item, index) => index.toString()}
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        ListHeaderComponent={
          <>
            <View style={styles.row}>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFunds')}>
                <FontAwesome5 name="wallet" size={24} color="#28a745" />
                <Text style={styles.buttonText}>Add Funds</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('withdrowFunds')}>
                <FontAwesome5 name="user-plus" size={24} color="#007bff" />
                <Text style={styles.buttonText}>Withdraw Funds</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CheckRates')}>
                <FontAwesome5 name="exchange-alt" size={24} color="#f39c12" />
                <Text style={styles.buttonText}>Check Rates</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('buySell')}>
                <FontAwesome5 name="shopping-cart" size={24} color="#e74c3c" />
                <Text style={styles.buttonText}>Buy/Sell</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.currencyBalance}>Balance</Text>
            <ScrollView horizontal style={styles.horizontalTable}>
              {user?.balance?.map((item: any, index: number) => (
                <View key={index} style={styles.currencyCard}>
                  <Text style={styles.currencyType}>{item.currency}</Text>
                  <Text style={styles.currencyBalance}>${item.amount}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => (
          <View style={[styles.transactionRow, { borderLeftColor: getTransactionColor(item.type) }]}>
            <Text style={styles.transactionType}>{item.type.toUpperCase()}</Text>
            <Text style={styles.transactionAmount}>${item.amount.toFixed(2)}</Text>
            <Text style={styles.transactionNote}>{item.note}</Text>
            <Text style={styles.transactionDate}>{new Date(item.createdOn).toLocaleString()}</Text>
          </View>
        )}
      />

      <Modal
        visible={isSidebarOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSidebarOpen(false)}
      >
        <TouchableOpacity
          style={styles.sidebarBackdrop}
          onPress={() => setIsSidebarOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={() => setIsSidebarOpen(false)} style={styles.closeButton}>
              <FontAwesome5 name="times" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: `data:image/png;base64,${profileImage}` }} style={styles.sidebarImage} />
              <TouchableOpacity style={styles.editIcon} onPress={handleUploadProfilePicture}>
                <FontAwesome5 name="edit" size={16} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.userInfoTitle}>Hey, {user?.firstName}</Text>
              <Text style={styles.userInfo}>Name: {user?.firstName + ' ' + user?.lastName}</Text>
              <Text style={styles.userInfo}>Email: {user?.email || 'N/A'}</Text>
              <Text style={styles.userInfo}>Phone: {user?.mobileNumber || 'N/A'}</Text>
              <Text style={styles.userInfo}>Balance: ${user?.plnBalance.toFixed(2) || '0.00'}</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  navbarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  currencyBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    color: '#2c3e50',
  },
  horizontalTable: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
 
  currencyCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 100,  // Set a minimum width for each currency card
    alignItems: 'center',  // Center text horizontally
    justifyContent: 'center',  // Center text vertically
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  currencyType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

    transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexWrap: 'wrap', // Allows items to wrap onto the next line if necessary
  },
  

  transactionType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  transactionNote: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  transactionDate: {
    fontSize: 12,
    color: '#95a5a6',
    width:'100%',
    textAlign: 'right'
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sidebar: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  sidebarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3498db',
    borderRadius: 15,
    padding: 5,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginVertical: 10,
  },
  userInfo: {
    fontSize: 14,
    color: '#bdc3c7',
    marginVertical: 2,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});


export default DashboardScreen;
