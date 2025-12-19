import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Simulate login delay
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to home
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Reset Password', 'Enter your email to receive password reset instructions');
  };

  return (
    <LinearGradient
      colors={['#F5F9FA', '#E8F5F6']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo/Header Section */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={['#2D9596', '#3AAFB0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoContainer}
          >
            <Ionicons name="eye" size={40} color="#fff" />
          </LinearGradient>
          <Text style={styles.appTitle}>DR Screener</Text>
          <Text style={styles.subtitle}>Diabetic Retinopathy Detection</Text>
        </View>

        {/* Login Form Section */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#2D9596" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#B0B0B0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#2D9596" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#B0B0B0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <Ionicons 
                name={showPassword ? "eye" : "eye-off"} 
                size={20} 
                color="#2D9596" 
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password Link */}
          <TouchableOpacity 
            onPress={handleForgotPassword}
            disabled={isLoading}
            style={styles.forgotPasswordContainer}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <LinearGradient
            colors={['#2D9596', '#3AAFB0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          >
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButtonContent}
            >
              {isLoading ? (
                <Text style={styles.loginButtonText}>Signing in...</Text>
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity 
              style={styles.socialButton}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={24} color="#EA4335" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.socialButton}
              disabled={isLoading}
            >
              <Ionicons name="logo-apple" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Section */}
        <View style={styles.signUpSection}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpLink}>Create one</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D9596',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2D9596',
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    color: '#7A7A7A',
    fontWeight: '500',
  },
  signUpLink: {
    fontSize: 14,
    color: '#2D9596',
    fontWeight: '700',
  },
  footer: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
