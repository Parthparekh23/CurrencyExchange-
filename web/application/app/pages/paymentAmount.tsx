// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
// import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// const PaymentDetailsScreen = ({ route, navigation }) => {
//   const { paymentData } = route.params;

//   const [amount, setAmount] = useState(paymentData.amount || '');
//   const [note, setNote] = useState('');
//   const [showBankDetails, setShowBankDetails] = useState(false);

//   const name = paymentData.name || 'Unknown Recipient';
//   const bankDetails = paymentData.bankDetails || 'Unknown Bank';
//   const accountNumber = paymentData.accountNumber || 'Unknown Account';

//   // Hide bank details when changing amount or note
//   const handleAmountChange = (text) => {
//     setAmount(text.replace(/[^0-9]/g, '')); // Only allow numeric input
//     setShowBankDetails(false);
//   };

//   const handleNoteChange = (text) => {
//     setNote(text);
//     setShowBankDetails(false);
//   };
//   const handlePay = () => {
//     // Navigate to the UPI Payment screen and pass `paymentData` as params
//     const updatedPaymentData = { ...paymentData, amount };

//     navigation.navigate('UPIPaymentScreen', { paymentData: updatedPaymentData });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topIcons}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="close" size={28} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity>
//           <Ionicons name="information-circle-outline" size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.paymentInfo}>
//         <View style={styles.avatar}>
//           <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
//         </View>
//         <Text style={styles.payTo}>Paying {name.toLowerCase()}</Text>
//         <Text style={styles.bankDetails}>Banking name: {bankDetails}</Text>
//         <Text style={styles.accountNumber}>{accountNumber}</Text>
//       </View>

//       {/* Amount and Note Input Section */}
//       <View style={styles.amountSection}>
//         <Text style={styles.currencySymbol}>₹</Text>
//         <TextInput
//           style={styles.amountInput}
//           value={amount}
//           placeholder='0'
//           onChangeText={handleAmountChange}
//           keyboardType="numeric"
//         />
//       </View>

//       <View style={styles.amountSection}>
//         <TextInput
//           style={styles.noteInput}
//           placeholder="Add a note"
//           value={note}
//           onChangeText={handleNoteChange}
//           multiline
//         />
//       </View>

//       {/* Next Button */}
//       {!showBankDetails && (
//         <TouchableOpacity style={styles.nextButton} onPress={() => setShowBankDetails(true)}>
//           <Ionicons name="arrow-forward" size={30} color="#4657a0" />
//         </TouchableOpacity>
//       )}

//       {/* Bank Details and Pay Button (Visible only after clicking Next) */}
//       {showBankDetails && (
//         <View style={styles.Bottom}>
//           <View style={styles.bankInfoContainer}>
//             <View style={styles.bankInfoRow}>
//               <Image
//                 source={require('../../assets/icic.jpg')}
//                 style={styles.bankIcon}
//               />
//               <View style={styles.bankInfoText}>
//                 <Text style={styles.bankName}>ICICI Bank ••••9216</Text>
//                 <Text style={styles.accountType}>Savings account</Text>
//               </View>
//             </View>

//             <TouchableOpacity style={styles.payButton} onPress={handlePay}>
//               <Text style={styles.payButtonText}>Pay ₹{amount}</Text>
//             </TouchableOpacity>

//             <View style={styles.poveredByContainer} >
//               <View style={styles.poveredBy}>

//                 <Text style={styles.poweredBy}>Powered by </Text>
//                 <View style={styles.poveredByIconContainer}>

//                   <Image
//                     source={require('../../assets/upi.png')}
//                     style={styles.poveredByIcon1}
//                   />
//                   <Image
//                     source={require('../../assets/icic2.png')}
//                     style={styles.poveredByIcon}
//                   />
//                 </View>

//               </View>
//             </View>


//           </View>

//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#121212',
//     paddingHorizontal: 20,
//   },
//   topIcons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 20,
//   },
//   paymentInfo: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#f44336',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   avatarText: {
//     color: '#fff',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   payTo: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//     marginBottom: 5,
//   },
//   bankDetails: {
//     color: '#bbb',
//     fontSize: 14,
//   },
//   accountNumber: {
//     color: '#bbb',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   amountSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 10,
//   },
//   currencySymbol: {
//     color: '#fff',
//     fontSize: 40,
//   },
//   amountInput: {
//     color: '#fff',
//     fontSize: 40,
//     minWidth: 100,
//     width: '30%',
//     textAlign: 'center',
//   },
//   noteInput: {
//     backgroundColor: '#333',
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '40%',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     fontSize: 16,
//     color: '#fff',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   nextButton: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//     backgroundColor: '#acc0fb',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//   },
//   nextButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   bankInfoContainer: {
//     backgroundColor: '#2E2E2E',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'flex-start',
//     marginTop: 20,
//   },
//   bankInfoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   bankIcon: {
//     width: 70,
//     height: 45,
//     marginRight: 20,
//     borderRadius: 5
//   },
//   bankName: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   accountType: {
//     color: '#bbb',
//     fontSize: 14,
//     marginTop: 5,
//   },
//   payButton: {
//     backgroundColor: '#acc0fb',
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 30,
//     alignItems: 'center',
//     marginTop: 20,
//     width: '100%'
//   },
//   payButtonText: {
//     color: '#4657a0',
//     fontSize: 16,
//   },
//   poweredBy: {
//     color: '#bbb',
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   Bottom: {
//     position: 'absolute',
//     bottom: 0,
//     left: 20,
//     right: 0,
//     width: '100%',
//     textAlign: 'center',
//   },
//   bankInfoText: {},
//   poveredBy: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center',

//     width: '100%'
//   },
//   poveredByContainer: {
//     textAlign: 'center',

//     width: '100%'
//   },
//   poveredByIcon: {
//     width: 100,
//     height: 80,
//     marginRight: 10,
//     borderRadius: 5,
//   },
//   poveredByIcon1:
//   {
//     width: 100,
//     height: 20,
//     marginRight: 10,
//     borderRadius: 5,

//   }, poveredByIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   }
// });

// export default PaymentDetailsScreen;
