import { usePasswordlessValidationContext } from '@/auth/contexts/PasswordlessValidationContext';
import {
  PhoneNumberInput,
  PhoneNumberInputRef,
} from '@/components/PhoneNumberInput';
import { Typography } from '@/components/Typography';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@ui-kitten/components';
import { useRef, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, View } from 'react-native';

export default function PasswordlessPhoneInputScreen() {
  const passwordInputRef = useRef<PhoneNumberInputRef>(null);
  const [isPhoneEntered, setIsPhoneEntered] = useState(false);
  const passwordlessValidationContext = usePasswordlessValidationContext();

  const sendCodeMutation = useMutation({
    mutationFn: async ({ phone }: { phone: string }) => {
      const result = await passwordlessValidationContext.sendCode(phone);
      if (!result) throw new Error('Unable to send OTP');
    },
    onSuccess() {
      Alert.alert('Success!', 'The OTP is sent to your phone number');
    },
  });

  return (
    <SafeAreaView>
      <Typography bold textAlign="center">
        {/* TODO(TOTG-58): Replace constant labels with i18n dependant translation */}
        מה הטלפון שלך?
      </Typography>

      <Typography variant="body2" textAlign="center">
        {/* TODO(TOTG-58): Replace constant labels with i18n dependant translation */}
        אנחנו נשלח קוד חד־פעמי לטלפון לאימות
      </Typography>

      <View style={styles.group}>
        <PhoneNumberInput
          ref={passwordInputRef}
          defaultCountry="il"
          allowedCountries={['il', 'aa']}
          onComplete={() => setIsPhoneEntered(true)}
          onUncomplete={() => setIsPhoneEntered(false)}
        />

        <Button
          disabled={!isPhoneEntered}
          onPress={() => {
            const phone = passwordInputRef.current?.value;
            if (phone) sendCodeMutation.mutate({ phone });
          }}
        >
          {/* TODO(TOTG-58): Replace constant labels with i18n dependant translation */}
          המשך
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80, // TODO(TOTG-57): Use spacing and multipliers instead of a magic number
    gap: 8, // TODO(TOTG-57): Use spacing and multipliers instead of a magic number
    flex: 1,
  },
  group: {
    gap: 8, // TODO(TOTG-57): Use spacing and multipliers instead of a magic number
    marginTop: 8, // TODO(TOTG-57): Use spacing and multipliers instead of a magic number
  },
  bottomGroup: {
    flex: 1,
    alignItems: 'flex-end',
  },
});
