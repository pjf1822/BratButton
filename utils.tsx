import AsyncStorage from "@react-native-async-storage/async-storage";
import { Group, createGroup, joinGroup } from "./api";
import { useGroupStore } from "./zustandStore";

export const handleCreateGroup = async (groupName: string, groupsOfUser:Group[] ) => {
    try {
     
    if (!groupName.trim()) {
        throw new Error('Group name is required');
      }
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const groupId = await createGroup({ members: [userId],groupName});
      
      const newGroup: Group = {
        id: groupId,
        groupName,
        members: [userId],
      };
      // Update the groups in the store
      useGroupStore.getState().setGroupsOfUser([...groupsOfUser, newGroup]);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  export const handleJoinGroup = async (groupId:string) => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId || !groupId) {
        throw new Error('User ID or Group ID is missing');
      }
      

      await joinGroup(groupId, userId);
      console.log(`User ${userId} joined group ${groupId}`);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };