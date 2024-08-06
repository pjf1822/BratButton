import React, { useEffect, } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import {  Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, userGroups } from '@/api';
import { useGroupStore } from '@/zustandStore';



function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}




export default function TabLayout() {
  const colorScheme = useColorScheme();
  const setGroupsOfUser = useGroupStore((state) => state.setGroupsOfUser);

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          const newUserId = Math.floor(Math.random() * 1000000).toString();
          await AsyncStorage.setItem('userId', newUserId);
          await createUser({ userId : newUserId }, newUserId);

        } else {
          const groups = await userGroups(userId);
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
        headerShown: useClientOnlyValue(false, true),
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
