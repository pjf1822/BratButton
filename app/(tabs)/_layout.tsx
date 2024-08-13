import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs,router } from 'expo-router';
import {  Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  userGroups } from '@/api';
import { useGroupStore } from '@/zustandStore';



function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const setSelectedGroup = useGroupStore.getState().setSelectedGroup;





export default function TabLayout() {
  const colorScheme = useColorScheme();
  const setGroupsOfUser = useGroupStore((state) => state.setGroupsOfUser);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
  
        if (!userString) {
          router.replace('/firstLaunch');
        } else {
          const user = JSON.parse(userString);
          const groups = await userGroups(user.userId,setSelectedGroup);
          setGroupsOfUser(groups ?? []);
        }
      } catch (error) {
        console.error('Failed to check or assign User ID:', error);
      }
    };
  
    checkUserId();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle:{backgroundColor:'purple'}
      }}>

<Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
</Tabs>
  );
}
