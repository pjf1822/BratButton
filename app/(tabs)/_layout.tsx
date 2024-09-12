import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Text, Dimensions, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { View } from '@/components/Themed';

import LoginModal from '@/components/LoginModal';

const { width } = Dimensions.get('window');
const isTablet = width > 768;

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return (
    <FontAwesome
      size={isTablet ? 39 : 28}
      style={{ marginBottom: -3 }}
      {...props}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { userData, loading } = useGroupStore((state) => ({
    userData: state.userData,
    loading: state.loading
  }));

  if (loading) {
    return null;
  }

  if (userData === null) {
    return <LoginModal />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

        tabBarStyle: {
          backgroundColor: myColors.three,
          paddingBottom: Platform.isPad ? 0 : 14,
          borderTopColor: myColors.three,
          borderTopWidth: 2,
          minHeight: Platform.isPad ? 100 : undefined,
          justifyContent: 'center'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <View></View>,
          tabBarLabel: ({ focused, color }) => (
            <View
              style={{
                backgroundColor: myColors.three,
                alignItems: 'center',
                marginBottom: isTablet ? 10 : 0
              }}
            >
              <TabBarIcon
                name="home"
                color={focused ? myColors.one : myColors.five}
              />
              <Text
                style={{
                  color: focused ? myColors.one : myColors.five,
                  fontSize: Platform.isPad ? 24 : 17,
                  fontFamily: 'KalMedium'
                }}
              >
                Home
              </Text>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: () => <View></View>,
          tabBarLabel: ({ focused, color }) => (
            <View
              style={{
                backgroundColor: myColors.three,
                alignItems: 'center',
                marginBottom: isTablet ? 10 : 0
              }}
            >
              <TabBarIcon
                name="users"
                color={focused ? myColors.one : myColors.five}
              />
              <Text
                style={{
                  color: focused ? myColors.one : myColors.five,
                  fontSize: Platform.isPad ? 24 : 17,
                  fontFamily: 'KalMedium'
                }}
              >
                Groups
              </Text>
            </View>
          )
        }}
      />
    </Tabs>
  );
}
