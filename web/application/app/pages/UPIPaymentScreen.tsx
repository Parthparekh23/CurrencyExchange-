// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';

// const UPIPaymentScreen = ({ route, navigation }:any) => {
//     const { paymentData } = route.params;

//     const [amount, setAmount] = useState(paymentData.amount || '');
//     const [note, setNote] = useState('');
//     const [showBankDetails, setShowBankDetails] = useState(false);
//     const [pin, setPin] = useState('');

//     const name = paymentData.name || 'Unknown Recipient';
//     const bankDetails = paymentData.bankDetails || 'Unknown Bank';
//     const accountNumber = paymentData.accountNumber || 'Unknown Account';

//     const handlePress = (number : any) => {
//         if (pin.length < 4) {
//             setPin(pin + number);
//         }
//     };
//     const handlePay = () => {
//         // Navigate to the UPI Payment screen and pass `paymentData` as params
    
//         navigation.navigate('ErrorPayment', { paymentData: paymentData });
//       };
    

//     return (
//         <View style={styles.container}>
//             {/* Top Section with Bank Details and UPI Icon */}
//             <View style={styles.topSection}>
//                 <View >

//                     <Text style={styles.bankName}>ICICI Bank</Text>
//                     <Text style={styles.bankNumber}>XXXX9216</Text>
//                 </View>
//                 <Image
//                     source={require('../../assets/upi.png')}
//                     style={styles.poveredByIcon1}
//                 />
//             </View>


//             {/* Recipient Information */}
//             <View style={styles.recipientSection}>
//                 <View style={styles.recipientText}>
//                     <Text style={styles.name}>

//                         To:
//                     </Text >
//                     <Text style={styles.value}>
//                         {name}
//                     </Text >
//                 </View>
//                 <View style={styles.recipientText}>
//                     <Text style={styles.name}>

//                          Sending :
//                     </Text >
//                     <Text style={styles.value}>
//                     ₹ {amount}
//                     </Text >
//                 </View>
//             </View>

//             {/* Instructional Text */}
//             <Text style={styles.instructionText}>ENTER 4-DIGIT UPI PIN</Text>

//             {/* PIN Input */}
//             <View style={styles.pinInput}>
//                 {[0, 1, 2, 3].map((_, index) => (
//                     <View key={index} style={styles.pinBox}>
//                         <Text style={styles.pinText}>{pin[index] || ''}</Text>
//                     </View>
//                 ))}
//             </View>

//             {/* Warning Message with Icon */}
//             <View style={styles.warningSection}>
//                 <Ionicons name="information-circle-outline" size={20} color="#ffa726" style={styles.infoIcon} />
//                 <Text style={styles.warningText}>You are transferring money from your account to {name}</Text>
//             </View>

//             {/* Numeric Keyboard */}
//             <View style={styles.keyboard}>
//                 {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
//                     <TouchableOpacity key={num} style={styles.key} onPress={() => handlePress(num.toString())}>
//                         <Text style={styles.keyText}>{num}</Text>
//                     </TouchableOpacity>
//                 ))}
//                 <TouchableOpacity style={styles.key} onPress={() => setPin(pin.slice(0, -1))}>
//                     <Ionicons name="backspace" size={33} color="#082781" />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.key} onPress={() => handlePress('0')}>
//                     <Text style={styles.keyText}>0</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.key} onPress={handlePay}>
//                     <Ionicons name="checkmark-circle" size={45} color="#082781" />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//         height: 100,
//         marginTop: 20,
//     },
//     topSection: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     bankText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     upiIcon: {
//         marginRight: 5,
//     },
//     recipientSection: {
//         marginBottom: 20,
//     },
//     recipientText: {
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexDirection: 'row',

//         fontSize: 18,
//         fontWeight: 'bold',
//         width: '100%'
//     },
//     name: {
//         fontSize: 18,
//     },
//     value: {
//         fontSize: 18,
//         fontWeight: 'bold',

//     },

//     amountText: {
//         fontSize: 24,
//         color: '#000',
//     },
//     instructionText: {
//         textAlign: 'center',
//         fontSize: 16,
//         marginVertical: 10,
//     },
//     pinInput: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginVertical: 15,
//     },
//     pinBox: {
//         width: 40,
//         height: 40,
//         borderBottomWidth: 2,
//         borderColor: '#000',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     pinText: {
//         fontSize: 18,
//     },
//     warningSection: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff3e0',
//         padding: 10,
//         borderRadius: 5,
//         marginBottom: 20,
//         marginTop: 30,
//     },
//     infoIcon: {
//         marginRight: 10,
//     },
//     warningText: {
//         color: '#000',
//         fontSize: 14,
//         flexShrink: 1,
//     },
//     keyboard: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'center',
//         marginTop: 100,

//     },
//     key: {
//         width: '30%',
//         padding: 20,
//         alignItems: 'center',
//         margin: 5,
//     },
//     keyText: {
//         fontSize: 24,
//         fontWeight: '600',

//         color: '#082781'
//     },
//     bankName: {
//         color: 'black',
//         fontSize: 16,
//         fontWeight: '600',
//     },
//     bankNumber: {
//         fontSize: 18,
//         fontWeight: '600',
//     },
//     poveredByIcon1:
//     {
//         width: 100,
//         height: 20,
//         marginRight: 10,
//         borderRadius: 5,

//     },
// });

// export default UPIPaymentScreen;
