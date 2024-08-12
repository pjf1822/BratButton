import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createGroup, joinGroup } from "./api";
import { Group, useGroupStore } from "./zustandStore";

export const handleCreateGroup = async (groupName: string, groupsOfUser:Group[] ) => {
    try {
     
    if (!groupName.trim()) {
        throw new Error('Group name is required');
      }
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString); 
   


      if (!user.userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const groupId = await createGroup({ members: [user.userId],groupName});
      
      const newGroup: Group = {
        id: groupId,
        groupName,
        members: [user.userId],
      };
      useGroupStore.getState().setGroupsOfUser([...groupsOfUser, newGroup]);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

 