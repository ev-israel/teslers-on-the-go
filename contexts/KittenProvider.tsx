import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { ReactNode } from 'react';

interface KittenProviderProps {
  children: ReactNode;
}
export function KittenProvider({ children }: KittenProviderProps) {
  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
      {children}
    </ApplicationProvider>
  );
}
