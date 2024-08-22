import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs,router } from 'expo-router';
import { Text} from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  populateGroups } from '@/api';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { showToast } from '@/utils';



function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}





export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {  setGroupsOfUser, setSelectedGroup ,setUserData} = useGroupStore((state) => ({
    setGroupsOfUser: state.setGroupsOfUser,
    setSelectedGroup: state.setSelectedGroup,
    setUserData: state.setUserData, 
  }));

  useEffect(() => {
    const checkUserId = async () => {

      try {
        const userString = await AsyncStorage.getItem('user');

        if (!userString) {
          router.replace('/firstLaunch');
        } else {
          const user = JSON.parse(userString);
          setUserData(user);
          const groups = await populateGroups(user.id, setSelectedGroup);
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
      tabBarStyle: {
        backgroundColor: myColors.one,
        paddingBottom: 14,
        borderTopColor: myColors.one,
        borderTopWidth: 2
      }
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon
            name="code"
            color={focused ? myColors.five : myColors.three}
          />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              color: focused ? myColors.five : myColors.three,
              fontSize: 14,
              fontFamily: 'KalMedium'
            }}
          >
            Home
          </Text>
        )
      }}
    />
    
    <Tabs.Screen
      name="groups"
      options={{
        title: 'Groups',
        tabBarIcon: ({ focused, color }) => (
          <TabBarIcon
            name="code"
            color={focused ? myColors.five : myColors.three}
          />
        ),
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              color: focused ? myColors.five : myColors.three,
              fontSize: 14,
              fontFamily: 'KalMedium'
            }}
          >
            Groups
          </Text>
        )
      }}
    />
  </Tabs>
  );
}
