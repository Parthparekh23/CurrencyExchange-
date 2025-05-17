// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { Camera, CameraType, CameraView, FlashMode } from 'expo-camera';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// const QRScannerScreen = ({ navigation }: any) => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);
//   const [flashMode, setFlashMode] = useState<FlashMode>('off');
//   const [cameraRef, setCameraRef] = useState<any>(Camera);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }: any) => {
//     setScanned(true);

//     // Handle QR Code Parsing
//     if (data.startsWith('upi://pay')) {
//       const paramsString = data.replace('upi://pay?', '');
//       const paramsArray = paramsString.split('&');
//       const parsedData: { [key: string]: string } = {};

//       paramsArray.forEach((param: any) => {
//         const [key, value] = param.split('=');
//         if (key && value) {
//           parsedData[key] = decodeURIComponent(value);
//         }
//       });

//       const paymentData = {
//         name: parsedData['pn'] || 'Unknown',
//         bankDetails: parsedData['pa'] || 'Unknown',
//         accountNumber: parsedData['pa'] || 'Unknown',
//         amount: parsedData['am'] || '0',
//       };

//       console.log('Parsed Data:', paymentData);
//       navigation.navigate('PaymentDetails', { paymentData });
//     } else {
//       Alert.alert('Invalid QR Code', 'Please scan a valid UPI QR code.');
//     }

//     setTimeout(() => setScanned(false), 3000); // Reset scan after delay
//   };

//   const toggleFlash = () => {
//     setFlashMode(
//       flashMode === 'off' ? 'on' : 'off'
//     );
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting camera permission...</Text>;
//   }

//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={StyleSheet.absoluteFillObject}
//         barcodeScannerSettings={{
//           barcodeTypes: ["qr"],
//         }}
//         onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//         ref={(ref) => setCameraRef(ref)}
//       />

//       {/* Scanning Area with Colored Corners */}
//       <View style={styles.overlay}>
//         <View style={styles.scanningFrame}>
//           <View style={styles.topLeftCorner} />
//           <View style={styles.topRightCorner} />
//           <View style={styles.bottomLeftCorner} />
//           <View style={styles.bottomRightCorner} />
//         </View>

//         {/* Upload from Gallery Button */}
//         <TouchableOpacity
//           style={styles.galleryButton}
//           onPress={() => Alert.alert('Upload from gallery')}
//         >
//           <Ionicons name="image-outline" size={20} color="#000" />
//           <Text style={styles.galleryButtonText}>Upload from gallery</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Top Icons (Close & Flash) */}
//       <View style={styles.topIcons}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <MaterialIcons name="close" size={28} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={toggleFlash}>
//           <Ionicons
//             name={flashMode === 'on' ? 'flash': undefined}
//             size={28}
//             color="#fff"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Instructions */}
//       <View style={styles.bottomBar}>
//         <Text style={styles.bottomText}>Scan any QR code to pay</Text>
//         <Text style={styles.paymentMethods}>
//           Google Pay • PhonePe • PayTM • UPI
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//   },
//   overlay: {
//     position: 'absolute',
//     top: '15%',
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   scanningFrame: {
//     width: 260,
//     height: 260,
//     borderWidth: 1,
//     borderColor: 'transparent',
//     position: 'relative',
//   },
//   topLeftCorner: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 60,
//     height: 60,
//     borderLeftWidth: 6,
//     borderTopWidth: 6,
//     borderColor: '#f44336',
//     borderTopLeftRadius: 20,
//   },
//   topRightCorner: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 60,
//     height: 60,
//     borderRightWidth: 6,
//     borderTopWidth: 6,
//     borderColor: '#ffeb3b',
//     borderTopRightRadius: 20,
//   },
//   bottomLeftCorner: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: 60,
//     height: 60,
//     borderLeftWidth: 6,
//     borderBottomWidth: 6,
//     borderColor: '#2196f3',
//     borderBottomLeftRadius: 20,
//   },
//   bottomRightCorner: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     width: 60,
//     height: 60,
//     borderRightWidth: 6,
//     borderBottomWidth: 6,
//     borderColor: '#4caf50',
//     borderBottomRightRadius: 20,
//   },
//   galleryButton: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     marginTop: 20,
//     elevation: 5,
//   },
//   galleryButtonText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#000',
//   },
//   topIcons: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     right: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 40,
//     left: 0,
//     right: 0,
//     alignItems: 'center',
//   },
//   bottomText: {
//     color: '#fff',
//     fontSize: 18,
//     marginBottom: 5,
//   },
//   paymentMethods: {
//     color: '#bbb',
//     fontSize: 14,
//   },
// });

// export default QRScannerScreen;
