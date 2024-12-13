import { useMaskedInput } from '@/hooks/useMaskedInput';
import { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface MaskedTextInputProps extends TextInputProps {
  mask: string | null;
}

export const MaskedTextInput = forwardRef<TextInput, MaskedTextInputProps>(
  (
    {
      mask,
      style,
      value: derivedValue,
      onChangeText: derivedOnChangeText,
      ...restProps
    },
    ref,
  ) => {
    const { value, onChangeText } = useMaskedInput(mask || '', {
      value: derivedValue,
      onChangeText: derivedOnChangeText,
    });

    return (
      <View style={[style, { position: 'relative' }]}>
        <TextInput
          ref={ref}
          {...restProps}
          onChangeText={onChangeText}
          value={value}
          style={[style, { color: 'transparent' }]}
        />
        <Text
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              zIndex: -1,
              verticalAlign: 'middle',
            },
            style,
          ]}
        >
          {value}
        </Text>
      </View>
    );
  },
);
MaskedTextInput.displayName = 'MaskedTextInput';
