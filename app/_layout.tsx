import '@/polyfills/date-transformation';
import { KittenProvider } from '@/contexts/KittenProvider';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function RootLayout() {
  return (
    <KittenProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </KittenProvider>
  );
}
