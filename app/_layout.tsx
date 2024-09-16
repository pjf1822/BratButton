import { fetchGroups, fetchUser } from '@/utils';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import NetInfo from '@react-native-community/netinfo';

import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { RootSiblingParent } from 'react-native-root-siblings';
import NoInternetModal from '@/components/NoInternetModal';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [connectedToInternet, setConnectedToInternet] = useState(false);
  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    setConnectedToInternet(state?.isConnected);
    return;
  };
  const [loaded, error] = useFonts({
    KalThin: require('../assets/fonts/Kalnia-Thin.ttf'),
    KalSemiBold: require('../assets/fonts/Kalnia-SemiBold.ttf'),
    KalLight: require('../assets/fonts/Kalnia-Light.ttf'),
    KalMedium: require('../assets/fonts/Kalnia-Medium.ttf'),
    KalRegular: require('../assets/fonts/Kalnia-Regular.ttf'),
    KalExtraLight: require('../assets/fonts/Kalnia-ExtraLight.ttf'),
    KalBold: require('../assets/fonts/Kalnia-Bold.ttf'),
    ...FontAwesome.font
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    checkConnectivity();

    const fetchDataAndHideSplash = async () => {
      const user = await fetchUser();
      if (!user) {
        await SplashScreen.hideAsync();
      }

      if (user && loaded) {
        unsubscribe = await fetchGroups(user);
        setTimeout(async () => {
          await SplashScreen.hideAsync();
        }, 500);
      }
    };

    fetchDataAndHideSplash();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      {!connectedToInternet && (
        <NoInternetModal
          connectedToInternet={connectedToInternet}
          setConnectedToInternet={setConnectedToInternet}
        />
      )}
      <RootLayoutNav />
    </RootSiblingParent>
  );
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
