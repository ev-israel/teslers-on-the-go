import '@/polyfills/date-transformation';
import { KittenProvider } from '@/contexts/KittenProvider';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <KittenProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </KittenProvider>
    </QueryClientProvider>
  );
}
