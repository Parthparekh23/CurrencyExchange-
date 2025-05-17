/// <reference types="nativewind/types" />
import { NavigationProp, RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, SafeAreaView, ScrollView, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Import icon library
import envConfig from '@/env';

type Props = {
    navigation: any;
    route: any;
}

const Register = ({ navigation }: Props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobileNumber = (mobileNumber: string) => {
        return mobileNumber.length === 10 && /^\d+$/.test(mobileNumber);
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (!validateMobileNumber(mobileNumber)) {
            Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${envConfig.API_BASE_URL}/api/main/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    mobileNumber,
                }),
            });
            const data = await response.json();

            if (response.ok && data.success) {
                Alert.alert('Registration Successful', 'Please login with your credentials');
                navigation.replace('Login'); // Redirect to login page
            } else {
                Alert.alert('Registration Failed', data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.appName}>Exchange Ease</Text>
                </View>
                <TextInput
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    style={styles.input}
                    keyboardType="number-pad"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.passwordInput}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        style={styles.passwordInput}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={handleRegister}
                    style={styles.registerButton}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <Text style={styles.registerButtonText}>Register</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.loginLink}>Already have an account? Login</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 30,
    },
    appName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#2c3e50',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 15,
    },
    registerButton: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 10,
    },
    registerButtonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loginLink: {
        color: '#007bff',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default Register;
