import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SplashVideoView } from '@/components/(auth)/splash-screen/SplashVideoView';
import { Button } from '@ui-kitten/components';
import { Typography } from '@/components/Typography';

export default function SplashScreen() {
  const router = useRouter();

  const navigateToAuthFlow = () => {
    router.navigate('/phone-input');
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
