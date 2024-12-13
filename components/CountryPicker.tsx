import { FlatList, TouchableHighlight, View } from 'react-native';
import {
  CountryPickerRow,
  CountryPickerRowDisplayOptions,
} from './CountryPickerRow';
import { ComponentProps, ComponentType, forwardRef } from 'react';
import { getAllCountryCodes } from '@/utils/countries';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetModal,
} from '@gorhom/bottom-sheet';

interface CountryPickerProps extends CountryPickerRowDisplayOptions {
  allowedCountries?: string[];
  ListComponent?: ComponentType<ComponentProps<typeof FlatList<string>>>;

  onSelect?(countryCode: string): void;
}

export function CountryPicker({
  allowedCountries = getAllCountryCodes(),
  ListComponent = FlatList,
  onSelect,
  ...displayProps
}: CountryPickerProps) {
  const { dismiss } = useBottomSheetModal();

  const selectCountry = (countryCode: string) => {
    onSelect?.(countryCode);
    dismiss();
  };

  return (
    <ListComponent
      data={allowedCountries}
      ItemSeparatorComponent={() => (
        <View
          style={{
            borderBottomWidth: 0.3,
            backgroundColor: '#ffffff55',
          }} // TODO(TOTG-57): Update colors to Theme variables
        />
      )}
      renderItem={({ item }) => (
        <TouchableHighlight
          key={item}
          onPress={() => selectCountry(item)}
          underlayColor="#8f9bb33d" // TODO(TOTG-57): Update color to inherit the Theme (color-basic-transparent-active)
        >
          <CountryPickerRow country={item} {...displayProps} />
        </TouchableHighlight>
      )}
    />
  );
}

export const CountryPickerBottomSheetModal = forwardRef<
  BottomSheetModal,
  CountryPickerProps
>((props, ref) => {
  return (
    <BottomSheetModal
      ref={ref}
      containerStyle={{
        marginBottom: -40, // TODO(TOTG-57): Update spacing to inherit the design system from the theme
      }}
      backgroundStyle={{
        backgroundColor: '#0d0d0d', // TODO(TOTG-57): Inherit color from the theme
      }}
      bottomInset={40} // TODO(TOTG-57): Update inset spacing to inherit the theme
      handleIndicatorStyle={{
        backgroundColor: '#595959', // TODO(TOTG-57): Update background color to inherit the theme
      }}
      maxDynamicContentSize={600}
      enableDynamicSizing
    >
      <CountryPicker {...props} ListComponent={BottomSheetFlatList} />
    </BottomSheetModal>
  );
});
CountryPickerBottomSheetModal.displayName = 'CountryPickerBottomSheetModal';
