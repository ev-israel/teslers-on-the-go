import { LinearGradient } from 'expo-linear-gradient';
import {
  StatusChangeEventPayload,
  useVideoPlayer,
  VideoPlayer,
  VideoSource,
  VideoView,
} from 'expo-video';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEventCallback } from 'usehooks-ts';

// @ts-ignore: Suppress TS80005 (require -> import) for this specific line
const DEFAULT_VIDEO_SOURCE: VideoSource = require('@/assets/videos/splash-video.mp4');

interface SplashVideoViewProps {
  source?: VideoSource;
}

export function SplashVideoView({
  source = DEFAULT_VIDEO_SOURCE,
}: SplashVideoViewProps) {
  const player = useAdaptingVideoPlayer(source);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        allowsFullscreen={false}
        allowsVideoFrameAnalysis={false}
        contentFit="cover"
        nativeControls={false}
        showsTimecodes={false}
      />

      <SplashVideoOverlayWing inverted />
      <SplashVideoOverlayWing coveragePercentage={0.1} />
    </View>
  );
}

function SplashVideoOverlayWing({
  inverted = false,
  coveragePercentage = 0.1,
}) {
  const colors: [string, string, ...string[]] = ['#1B1B1B', 'transparent']; // TODO: TOTG-57 Replace static color with a themed property of the background color
  if (inverted) colors.reverse();

  return (
    <LinearGradient
      style={[styles.video, styles.overlay]}
      colors={colors}
      dither={false}
      locations={[0, coveragePercentage]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  video: {
    width: '100%',
    aspectRatio: 360 / 541,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

/**
 * A hook that creates a self-managed video player with auto-playback and loop functionalities, and also supports video source changing in runtime
 * @param {VideoSource} videoSource The video source to play. Can be changed in the runtime.
 * @returns {VideoPlayer}
 */
function useAdaptingVideoPlayer(videoSource: VideoSource): VideoPlayer {
  const player = useVideoPlayer(null);

  useEffect(() => {
    player.replace(videoSource);
  }, [videoSource]);

  const autoPlayVideoOnReady = useEventCallback(
    ({ status, oldStatus }: StatusChangeEventPayload) => {
      if (status !== 'readyToPlay' || oldStatus === 'readyToPlay') return;
      player.play();
      player.loop = true;
      player.muted = true;
    },
  );

  useEffect(() => {
    player.addListener('statusChange', autoPlayVideoOnReady);

    return () => {
      player.removeListener('statusChange', autoPlayVideoOnReady);
    };
  }, [player, autoPlayVideoOnReady]);

  return player;
}
