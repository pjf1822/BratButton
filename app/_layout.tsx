import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect} from 'react';
import 'react-native-reanimated';


import { QueryClient, QueryClientProvider } from "react-query";



import { useColorScheme } from '@/components/useColorScheme';
import { View } from '@/components/Themed';
import { myColors } from '@/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    KalThin: require('../assets/fonts/Kalnia-Thin.ttf'),
    KalSemiBold: require('../assets/fonts/Kalnia-SemiBold.ttf'),
    KalLight: require('../assets/fonts/Kalnia-Light.ttf'),
    KalMedium: require('../assets/fonts/Kalnia-Medium.ttf'),
    KalRegular: require('../assets/fonts/Kalnia-Regular.ttf'),
    KalExtraLight: require('../assets/fonts/Kalnia-ExtraLight.ttf'),
    KalBold: require('../assets/fonts/Kalnia-Bold.ttf'),
    ...FontAwesome.font,
  });

  

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }



  return (
    <RootLayoutNav />
  );}



function RootLayoutNav() {
  const queryClient = new QueryClient();



  return (
    <QueryClientProvider client={queryClient}>

      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="firstLaunch" options={{ headerShown: false }} />
      </Stack>

    </QueryClientProvider>

  );
}
