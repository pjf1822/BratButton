import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect} from 'react';
import 'react-native-reanimated';


import { QueryClient, QueryClientProvider } from "react-query";



import { useColorScheme } from '@/components/useColorScheme';

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
    KalThin: require('../assets/fonts/KalniaGlaze-Thin.ttf'),
    KalSemiBold: require('../assets/fonts/KalniaGlaze-SemiBold.ttf'),
    KalLight: require('../assets/fonts/KalniaGlaze-Light.ttf'),
    KalMedium: require('../assets/fonts/KalniaGlaze-Medium.ttf'),
    KalRegular: require('../assets/fonts/KalniaGlaze-Regular.ttf'),
    KalExtraLight: require('../assets/fonts/KalniaGlaze-ExtraLight.ttf'),
    KalBold: require('../assets/fonts/KalniaGlaze-Bold.ttf'),
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



  return <RootLayoutNav />;
}



function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();



  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="firstLaunch" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    </QueryClientProvider>

  );
}
