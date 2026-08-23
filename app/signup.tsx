import React, { useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthField, AuthScreen } from '@/components/AuthScreen';
import { metrics } from '@/components/Type';
import { color, font } from '@/theme/tokens';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AuthScreen
      heading="Create your account"
      subheading="Set up your storefront, orders and inventory in one place."
      ctaLabel="Create Account"
      onSubmit={() => {}}
      footer={
        <Text style={[{ fontFamily: font.body, color: color.textMuted }, metrics(13.5, 1.4)]}>
          Already have a Vendly account?{' '}
          <Text
            style={{ fontFamily: font.bodySemi, color: color.accent }}
            onPress={() => router.push('/login')}
          >
            Log in
          </Text>
        </Text>
      }
    >
      <AuthField placeholder="Business Name" value={name} onChangeText={setName} autoComplete="name" />
      <AuthField placeholder="Email Address" value={email} onChangeText={setEmail} autoComplete="email" />
      <AuthField placeholder="Password" value={password} onChangeText={setPassword} secure autoComplete="password" />
    </AuthScreen>
  );
}
