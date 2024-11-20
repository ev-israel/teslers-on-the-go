import { StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import Animated, { Easing, withTiming } from 'react-native-reanimated';
import { useTransitionableValue } from '@/hooks/useTransitionableValue';

const EMPTY_INPUT_CHAR = ' ';

interface CodeCellProps {
  char?: string;
  error?: boolean;
  success?: boolean;
}

export function CodeCell(props: CodeCellProps) {
  const borderColor = useTransitionableValue(
    () => {
      if (props.error) return '#B81D5B'; // TODO(TOTG-57): Use theme property "color-danger-700"
      if (props.success) return '#008F72'; // TODO(TOTG-57): Use theme property "color-success-700"
      return '#ffffff3b'; // TODO(TOTG-57): Use theme property for default border color
    },
    (color) =>
      withTiming(color, {
        easing: Easing.inOut(Easing.ease),
        duration: props.success ? 500 : 1,
      }),
    [props.error, props.success],
  );

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          borderColor,
        },
      ]}
    >
      <Typography
        style={[
          styles.cellTypography,
          props.error && { borderColor: '#B81D5B' }, // TODO(TOTG-57): Use theme property "color-danger-700"
        ]}
      >
        {props.char ?? EMPTY_INPUT_CHAR}
      </Typography>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    padding: 10, // TODO(TOTG-57): Use theme properties
    borderRadius: 8, // TODO(TOTG-57): Use theme properties
    backgroundColor: '#ffffff17', // TODO(TOTG-57): Use theme properties
    borderColor: '#ffffff3b', // TODO(TOTG-57): Use theme properties
    borderWidth: 1,
    maxWidth: 42,
  },
  cellTypography: {
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  erroredCell: {
    borderColor: '#F53838', // TODO(TOTG-57): Use theme properties (error)
  },
  succeedCell: {
    borderColor: '#3ABB74', // TODO(TOTG-57): Use theme properties (success)
  },
});
