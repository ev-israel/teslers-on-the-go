import { StyleSheet, View } from 'react-native';
import { CountryFlag } from './CountryFlag';
import { useMemo } from 'react';
import { Country, getCountryByCode } from '@/utils/countries';
import { Typography } from './Typography';

export interface CountryPickerRowDisplayOptions {
  supplementaryInfo?:
    | 'dialing-code'
    | ((country: Country) => string | null)
    | null;
  showFlag?: boolean;
}

interface CountryPickerRowProps extends CountryPickerRowDisplayOptions {
  country: string;
}

export function CountryPickerRow({
  country: countryCode,
  supplementaryInfo = null,
  showFlag = true,
}: CountryPickerRowProps) {
  const country = useMemo(() => {
    return getCountryByCode(countryCode);
  }, [countryCode]);

  const supplementaryResolvedContent = useMemo<string | null>(() => {
    if (!supplementaryInfo || !country) return null;
    if (typeof supplementaryInfo === 'function')
      return supplementaryInfo(country);

    switch (supplementaryInfo) {
      case 'dialing-code':
        return country.countryCode;
      default:
        throw new Error(
          `Unsupported supplementary info type: ${supplementaryInfo as string}`,
        );
    }
  }, [country, supplementaryInfo]);

  return (
    <View style={[styles.container, styles.mainContainer]}>
      {showFlag && <CountryFlag country={countryCode} style={styles.flag} />}
      <View style={[styles.container, styles.contentContainer]}>
        {/* TODO(TOTG-58): Use i18n instead of static translations */}
        <Typography>{country?.label ?? 'Unknown Country'}</Typography>
        {supplementaryResolvedContent && (
          <Typography style={styles.supplementaryContent}>
            {supplementaryResolvedContent}
          </Typography>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainContainer: {
    width: '100%',
    gap: 8, // TODO(TOTG-57): Use gap based on theme spacing properties
    paddingHorizontal: 16, // TODO(TOTG-57): Use padding based on theme spacing propeerties
    height: 40,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flag: {
    width: 24,
    aspectRatio: 1,
    borderRadius: 24, // TODO(TOTG-57): Use border radius based on theme border radius
  },
  supplementaryContent: {
    color: '#FFFFFFB3', // TODO(TOTG-57): Use supplementary content's color based on the theme alternate colors
  },
});
