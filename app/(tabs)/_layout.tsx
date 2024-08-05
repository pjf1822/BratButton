import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import {  Pressable } from 'react-native';
import * as Linking from 'expo-linking';


import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { createUser, getData, userGroups } from '@/api';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}


interface Group {
  id: string;
  // Add other fields if needed
}




export default function TabLayout() {
  const [groupsOfUser, setGroupsOfUser] = useState<Group[]>([]);
  const colorScheme = useColorScheme();

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


          console.log('Existing User ID found:', userId, "they are in these groyups ", groups);
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
        name="two"
        options={{
          title: 'You',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
        initialParams={{userGroups:groupsOfUser}}
     
      />
    </Tabs>
  );
}
