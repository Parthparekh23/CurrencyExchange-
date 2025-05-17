import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Register from "./pages/register";
import Login from "./pages/login";
import DashboardScreen from "./pages/DashboardScreen";
// import QRScannerScreen from "./pages/QRScannerScreen";
// import PaymentDetailsScreen from "./pages/paymentAmount";
// import UPIPaymentScreen from "./pages/UPIPaymentScreen";
// import ErrorPayment from "./pages/ErrorPayment";
import AddFundsScreen from "./pages/AddFunds";
import WithdrawFundsScreen from "./pages/WithrowFunds";
import CurrencyScreen from "./pages/ViewCurrencyExchange";
import CurrencyTransaction from "./pages/BuySell";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      
    // </NavigationContainer>
  
  
    <Stack.Navigator>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ title: "Login", headerShown: false }}
    />

    <Stack.Screen
      name="Register"
      component={Register}
      options={{ title: "Register", headerShown: false }}
    />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="AddFunds" component={AddFundsScreen} />
    <Stack.Screen name="withdrowFunds" component={WithdrawFundsScreen} />
    <Stack.Screen name="CheckRates" component={CurrencyScreen} />
    <Stack.Screen name="buySell" options={{ headerTitle: "Exchange Ease" }}>
      {() => <CurrencyTransaction/>}
    </Stack.Screen>
     

    
  </Stack.Navigator>);
}
