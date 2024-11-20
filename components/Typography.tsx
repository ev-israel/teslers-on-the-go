import { createNestableComponent } from '@/utils/create-nestable-component';
import { Text as KittenText } from '@ui-kitten/components';
import { ComponentProps } from 'react';
import { Platform, StyleSheet } from 'react-native';

// TODO(TOTG-57): Integrate this component within the Theme with theme-dependant style rules

const NestableText = createNestableComponent(KittenText);

interface TypographyProps extends ComponentProps<typeof NestableText> {
  variant?:
    | 'title.lg'
    | 'title.md'
    | 'title.sm'
    | 'caption'
    | 'overline'
    | 'subtitle2'
    | 'subtitle1'
    | 'body2'
    | 'body1';
  bold?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

export function Typography({
  variant = 'body1',
  style,
  bold,
  textAlign,
  ...props
}: TypographyProps) {
  const themeStyles = [
    styles.base,
    styles[variant],
    bold && styles.bold,
    textAlign && styles[`textAlign-${textAlign}`],
  ];
  return <NestableText style={[...themeStyles, style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.select({
      android: 'NotoSansHebrew_400Regular',
      ios: 'Noto Sans Hebrew',
    }),
  },
  'title.lg': {
    fontSize: 30,
    lineHeight: 30 * 1.167,
  },
  'title.md': {
    fontSize: 24,
    lineHeight: 24 * 1.235,
    letterSpacing: 0.25,
    fontWeight: 'semibold',
  },
  'title.sm': {
    fontSize: 20,
    lineHeight: 20 * 1.6,
    letterSpacing: 0.15,
    fontWeight: 'semibold',
  },
  caption: {
    fontSize: 12,
    lineHeight: 12 * 1.66,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 12,
    lineHeight: 12 * 2.66,
    letterSpacing: 1,
  },
  subtitle1: {
    fontSize: 16,
    lineHeight: 16 * 1.75,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 16,
    lineHeight: 16 * 1.57,
    letterSpacing: 0.1,
    fontWeight: 'semibold',
  },
  body1: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
    letterSpacing: 0.15,
  },
  body2: {
    fontSize: 14,
    lineHeight: 14 * 1.43,
    letterSpacing: 0.17,
  },

  bold: {
    fontWeight: 'bold',
  },
  'textAlign-left': {
    textAlign: 'left',
  },
  'textAlign-center': {
    textAlign: 'center',
  },
  'textAlign-right': {
    textAlign: 'right',
  },
});
