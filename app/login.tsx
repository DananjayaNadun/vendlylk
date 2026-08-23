import React, { useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthField, AuthScreen } from '@/components/AuthScreen';
import { metrics } from '@/components/Type';
import { color, font } from '@/theme/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreen
      heading="Welcome back"
      subheading="Sign in to keep running your storefront and orders."
      ctaLabel="Sign In"
      onSubmit={() => {}}
      footer={
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(13.5, 1.4)]}>
          Don't have a Vendly account?{' '}
          <Text
            style={{ fontFamily: font.bodySemi, color: color.accent }}
            onPress={() => router.push('/signup')}
          >
            Sign up
          </Text>
        </Text>
      }
    >
      <AuthField placeholder="Email Address" value={email} onChangeText={setEmail} autoComplete="email" />
      <AuthField placeholder="Password" value={password} onChangeText={setPassword} secure autoComplete="password" />
    </AuthScreen>
  );
}
