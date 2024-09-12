import { populateGroups } from '@/utils';
import { User, useGroupStore } from '@/zustandStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { RootSiblingParent } from 'react-native-root-siblings';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  const { setUserData, setGroupsOfUser, setSelectedGroup, setLoading } =
    useGroupStore.getState();

  const checkUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = userString ? (JSON.parse(userString) as User) : null;
      setUserData(user);
      const groupsString = await AsyncStorage.getItem('groupIds');
      const groupIds = groupsString
        ? (JSON.parse(groupsString) as string[])
        : [];
      if (groupIds.length > 0) {
        const groups = await populateGroups(groupIds, setSelectedGroup);
        setGroupsOfUser(groups ?? []);
      }
    } catch (error) {
      console.error('Error in checkUser:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadResources = async () => {
      try {
        if (loaded) {
          await checkUser();

          // Hide the splash screen
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Error during resource loading:', error);
      }
    };

    loadResources();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      <RootLayoutNav />
    </RootSiblingParent>
  );
}

function RootLayoutNav() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
