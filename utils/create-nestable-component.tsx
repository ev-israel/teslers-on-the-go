// @ts-nocheck

import { mergeDeep } from '@/utils/merge-deep';
import { ComponentType, createContext, useContext } from 'react';

export function createNestableComponent<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  const PropsContext = createContext<P>({} as P);

  const NestableComponent = (props: P) => {
    const nestedProps = useContext(PropsContext);
    const combinedProps = mergeDeep<P>({} as P, nestedProps, props);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...passableProps } = combinedProps;
    return (
      <PropsContext.Provider value={passableProps}>
        <Component {...combinedProps} />
      </PropsContext.Provider>
    );
  };
  const originalComponentName =
    Component.displayName || Component.name || 'Anonymous';
  NestableComponent.displayName = `NestableComponent(${originalComponentName})`;
  return NestableComponent;
}
