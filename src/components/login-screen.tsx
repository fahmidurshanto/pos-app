import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';

export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    const res = await login(username.trim(), password.trim());
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0B1A30]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-center px-6">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}>
          {/* Logo / Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 rounded-2xl bg-emerald-600 items-center justify-center shadow-lg shadow-emerald-500/30 mb-3 border border-emerald-400/40">
              <Text className="text-white font-black text-2xl tracking-widest">POS</Text>
            </View>
            <Text className="text-white font-black text-2xl tracking-wide">
              Welcome Back
            </Text>
            <Text className="text-slate-400 text-xs mt-1">
              Sign in to Luxury POS Management System
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-[#12233C] border border-[#1A2E4E] rounded-3xl p-6 shadow-2xl">
            {/* Error banner */}
            {errorMessage ? (
              <View className="bg-rose-500/15 border border-rose-500/40 rounded-xl p-3 mb-4">
                <Text className="text-rose-400 text-xs font-semibold text-center">
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            {/* Username / Email */}
            <View className="mb-4">
              <Text className="text-slate-300 text-xs font-semibold mb-1.5 ml-1">
                Username / Email
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username or email"
                placeholderTextColor="#64748B"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-[#0B1A30] border border-[#1E3355] rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500"
              />
            </View>

            {/* Password */}
            <View className="mb-6">
              <Text className="text-slate-300 text-xs font-semibold mb-1.5 ml-1">
                Password
              </Text>
              <View className="relative justify-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  className="bg-[#0B1A30] border border-[#1E3355] rounded-xl pl-4 pr-16 py-3 text-sm text-white focus:border-emerald-500"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 py-1.5 px-2">
                  <Text className="text-xs text-emerald-400 font-semibold">
                    {showPassword ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Login CTA */}
            <Pressable
              disabled={loading}
              onPress={handleLogin}
              className="bg-emerald-600 active:bg-emerald-700 py-3.5 rounded-xl items-center shadow-lg shadow-emerald-600/30">
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text className="text-white text-sm font-bold tracking-wider">
                  Sign In
                </Text>
              )}
            </Pressable>
          </View>

          {/* Footer branding */}
          <View className="items-center mt-8">
            <Text className="text-slate-500 text-xs">
              Powered by{' '}
              <Text className="text-emerald-500 font-semibold">BDITPARK</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

