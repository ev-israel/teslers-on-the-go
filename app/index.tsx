import { useRouter } from 'expo-router';
import { Text, View, Button } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button
        title="Navigate to Auth"
        onPress={() => router.replace('/(auth)/splash')}
      />
    </View>
  );
}
