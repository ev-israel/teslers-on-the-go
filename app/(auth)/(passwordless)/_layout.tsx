import { PasswordlessValidationContextProvider } from '@/auth/contexts/PasswordlessValidationContext';
import { Stack } from 'expo-router';

export default function PasswordlessAuthLayout() {
  return (
    <PasswordlessValidationContextProvider onSuccess={() => null}>
      <Stack />
    </PasswordlessValidationContextProvider>
  );
}
