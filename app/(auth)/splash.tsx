import { StyleSheet, View } from 'react-native';
import { SplashVideoView } from '@/components/(auth)/splash-screen/SplashVideoView';
import { Button } from '@ui-kitten/components';
import { Typography } from '@/components/Typography';

export default function SplashScreen() {
  const navigateToAuthFlow = () => {
    // TODO(TOTG-7): Implement the mechanism to redirect to the actual auth flow. Here is an example:
    // router.navigate('(auth)/passwordless1');
    // don't forget to define the router using the useRouter hook exported from "expo-router"
    console.warn('Not implemented yet');
  };

  return (
    <View style={styles.container}>
      <SplashVideoView />

      <View style={[styles.container, styles.contentContainer]}>
        <Typography
          variant="title.md"
          style={{
            transform: [
              {
                translateY: '-50%', // this is to align the label with the video (the video on its bottom is faded, so the text aligns nicely)
              },
            ],
          }}
          bold
          textAlign="center"
        >
          {/* TODO(TOTG-58): Replace constant labels with i18n dependant translation */}
          ברוכים הבאים לטסלאים בדרכים!
        </Typography>
        {/* TODO(TOTG-58): Replace constant labels with i18n dependant translation */}
        <Button onPress={navigateToAuthFlow}>התחברות</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'space-between',
    marginBottom: 40, // TODO(TOTG-57): Replace constant with a Theme variable
  },
});
