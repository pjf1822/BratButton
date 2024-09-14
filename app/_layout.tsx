import { db } from '@/firebaseConfig';
import { populateGroups } from '@/utils';
import { Group, User, useGroupStore } from '@/zustandStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
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

  const grabAsyncData = async () => {
    const userString = await AsyncStorage.getItem('user');
    const user = userString ? (JSON.parse(userString) as User) : null;
    if (user) {
      setUserData(user);
    }
    const groupsString = await AsyncStorage.getItem('groupIds');
    const groupIds = groupsString ? (JSON.parse(groupsString) as string[]) : [];
    return groupIds;
  };

  const fetchGroups = async () => {
    const groupIds = await grabAsyncData();
    try {
      if (groupIds.length > 0) {
        const groupsRef = collection(db, 'groups');
        const groupQuery = query(groupsRef, where('__name__', 'in', groupIds));

        const unsubscribe = onSnapshot(groupQuery, (snapshot) => {
          const updatedGroupsList = snapshot.docs.map((doc) => ({
            ...(doc.data() as any)
          }));
          console.log(updatedGroupsList);
          setSelectedGroup(updatedGroupsList[0]);
          setGroupsOfUser(updatedGroupsList);
          setLoading(false);
        });

        return unsubscribe;
      }
    } catch (error) {
      console.error('Error fetching puppies: ', error);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchDataAndHideSplash = async () => {
      if (loaded) {
        // Await the result of fetchGroups and assign the unsubscribe function
        unsubscribe = await fetchGroups();
        await SplashScreen.hideAsync(); // Await hiding the splash screen
      }
    };
    fetchDataAndHideSplash();
    return () => {
      if (unsubscribe) {
        unsubscribe(); // Only call unsubscribe if it's defined
      }
    };
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
