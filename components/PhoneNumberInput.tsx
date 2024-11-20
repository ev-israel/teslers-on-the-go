import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { CountryPickerBottomSheetModal } from './CountryPicker';
import {
  ComponentProps,
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CountryFlag } from './CountryFlag';
import { Typography } from './Typography';
import { getCountryByCode } from '@/utils/countries';
import { Input } from '@ui-kitten/components';
import { Image } from 'expo-image';
import { MaskedTextInput } from './MaskedTextInput';

interface PhoneNumberInputProps
  extends Omit<
    ComponentProps<typeof Input>,
    'value' | 'onChangeText' | 'onChange'
  > {
  defaultCountry: string;
  allowedCountries?: string[];

  onComplete?(): void;

  onUncomplete?(): void;
}

interface ForwardedRefProps<T> {
  forwardedRef: Ref<T>;
}

export interface PhoneNumberInputRef {
  value: string;
}

function PhoneNumberInputComponent({
  defaultCountry,
  allowedCountries,
  style,
  forwardedRef,
  onComplete,
  onUncomplete,
  ...inputProps
}: PhoneNumberInputProps & ForwardedRefProps<PhoneNumberInputRef>) {
  const countryPickerRef = useRef<BottomSheetModal>(null);
  const [country, setCountry] = useState(defaultCountry);
  const countryInfo = useMemo(() => {
    const countryInfo = getCountryByCode(country);
    if (!countryInfo) throw new Error('Unable to find country');

    return {
      ...countryInfo,
      intlMobileLength:
        countryInfo.intlMobileFormat?.replaceAll(/\D/g, '')?.length ||
        undefined,
    };
  }, [country]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const isCompletedRef = useRef(false);

  const canSwitchCountry =
    !allowedCountries ||
    allowedCountries.length > 1 ||
    (allowedCountries.length > 0 && allowedCountries[0] !== country);

  const showCountryPicker = () => {
    if (!canSwitchCountry) return;
    Keyboard.dismiss();
    countryPickerRef.current?.present();
  };

  useImperativeHandle(
    forwardedRef,
    () => ({
      value: countryInfo.countryCode + phoneNumber,
    }),
    [countryInfo, phoneNumber],
  );

  const onChangeText = (phoneNumber: string) => {
    setPhoneNumber(phoneNumber);
    const isCompleted = phoneNumber.length === countryInfo.intlMobileLength;
    if (isCompleted !== isCompletedRef.current) {
      if (isCompleted) onComplete?.();
      else onUncomplete?.();
      isCompletedRef.current = isCompleted;
    }
  };

  return (
    <View style={[styles.inputContainer, style]}>
      <Pressable onPress={showCountryPicker}>
        <View style={styles.countryContainer}>
          <CountryFlag
            country={country}
            style={{ width: 20, aspectRatio: 1, borderRadius: 20 }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography style={styles.countryCodeText}>
              {countryInfo.countryCode}
            </Typography>

            {canSwitchCountry && (
              <Image
                source={require('@/assets/icons/caret-down.svg')}
                style={{ width: 24, height: 24 }}
              />
            )}
          </View>
        </View>
      </Pressable>

      <MaskedTextInput
        {...inputProps}
        mask={countryInfo.intlMobileFormat || null}
        keyboardType="phone-pad"
        style={{
          color: '#fff', // TODO(TOTG-57): Use theme property "text-control-color"
          flex: 1,
        }}
        placeholderTextColor="#8F9BB3" // TODO(TOTG-57): Use theme property "text-hint-color"
        placeholder={'\u200eמספר טלפון'} // TODO(TOTG-58): Use i18n instead of static label
        value={phoneNumber}
        onChangeText={onChangeText}
        maxLength={countryInfo.intlMobileFormat?.length}
      />

      <CountryPickerBottomSheetModal
        ref={countryPickerRef}
        allowedCountries={allowedCountries}
        supplementaryInfo="dialing-code"
        onSelect={(country) => setCountry(country)}
      />
    </View>
  );
}

export const PhoneNumberInput = forwardRef<
  PhoneNumberInputRef,
  PhoneNumberInputProps
>((props, ref) => <PhoneNumberInputComponent {...props} forwardedRef={ref} />);

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10, // TODO(TOTG-57): Use theme properties instead of magic numbers
    backgroundColor: '#ffffff17', // TODO(TOTG-57): Use theme properties instead of magic colors
    borderColor: '#ffffff3b', // TODO(TOTG-57): Use theme properties instead of magic colors
    display: 'flex',
    flexDirection: 'row',
    gap: 8, // TODO(TOTG-57): Use theme properties instead of magic numbers
    alignItems: 'center',
    borderRadius: 8, // TODO(TOTG-57): Use theme properties instead of magic numbers
  },
  countryContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8, // TODO(TOTG-57): Use theme properties instead of magic numbers
    alignItems: 'center',
  },
  countryCodeText: {
    fontWeight: 'bold',
  },
});
