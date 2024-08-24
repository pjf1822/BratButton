import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs,router } from 'expo-router';
import { Text, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  populateGroups } from '@/api';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { View } from '@/components/Themed';


const { width } = Dimensions.get('window');
const isTablet = width > 768;


function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={isTablet ? 39 : 28} style={{ marginBottom: -3 }} {...props} />;
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
        backgroundColor: myColors.three,
        paddingBottom: 14,
        borderTopColor: myColors.three,
        borderTopWidth: 2
      }
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ focused, color }) => (
         <View></View>
        ),
        tabBarLabel: ({ focused, color }) => (
          <View style={{backgroundColor:myColors.three,alignItems:"center",  marginBottom:isTablet ? 10:0}}>
 <TabBarIcon
            name="home"
            color={focused ? myColors.one : myColors.five}
          />
          <Text
            style={{
              color: focused ? myColors.one : myColors.five,
              fontSize: 17,
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
        tabBarIcon: (     ) => (
          <View></View>

        ),
        tabBarLabel: ({ focused, color }) => (
          <View style={{backgroundColor:myColors.three,alignItems:"center",              marginBottom:isTablet ? 10:0
        }}>
<TabBarIcon
            name="users"
            color={focused ? myColors.one : myColors.five}
          />
          <Text
            style={{
              color: focused ? myColors.one : myColors.five,
              fontSize: 17,
              fontFamily: 'KalMedium',
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
