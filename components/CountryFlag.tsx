import { useMemo } from 'react';
import { Image, ImageProps } from 'expo-image';
import countryFlags from '@/assets/flags/flag-assets';

interface CountryFlagProps extends Omit<ImageProps, 'source'> {
  country: string;
}

export function CountryFlag({ country, ...props }: CountryFlagProps) {
  country = country.toLowerCase();

  const asset = useMemo(() => {
    if (country in countryFlags) return countryFlags[country];

    console.warn(
      `Unknown country code: ${country}. Falling back to world flag`,
    );
    return require('@/assets/flags/ww.png');
  }, [country]);

  return <Image {...props} source={asset} />;
}
