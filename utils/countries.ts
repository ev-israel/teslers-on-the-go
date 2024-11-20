import countries from '@/assets/countries.json';

export interface Country {
  code: string;
  currency: {
    code: string;
    label: string;
    symbol?: string | null;
  };
  label: string;
  language: {
    code: string | null;
    label: string;
  };
  countryCode: string;
  domesticMobileFormat?: string;
  intlMobileFormat?: string;
}

export function getCountryByCode(code: string): Country | null {
  return (
    countries.find(
      (country) => country.code.toLowerCase() === code.toLowerCase(),
    ) || null
  );
}

export function getAllCountryCodes(): string[] {
  return countries.map((country) => country.code.toLowerCase());
}
