import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#1a1a1a', flex: 1 },
      }}
    >
      <Stack.Screen name="splash" />
    </Stack>
  );
}
