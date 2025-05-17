import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, View, Alert, Text, Platform } from 'react-native';

export default function LoginScreen() {
  // State for username and password inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Predefined credentials
  const correctUsername = 'gauravp';
  const correctPassword = 'admin';

  // Handle login logic
  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      Alert.alert('Login Successful', 'Welcome!');
    } else {
      Alert.alert('Login Failed', 'Incorrect username or password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Optional: Display platform-specific instructions */}
      <Text style={styles.instructions}>
        Press{' '}
        <Text style={styles.code}>
          {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
        </Text>{' '}
        to open developer tools.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    borderRadius: 5,
  },
  instructions: {
    marginTop: 20,
    textAlign: 'center',
  },
  code: {
    fontWeight: 'bold',
  },
});
