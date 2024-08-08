import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createGroup, joinGroup } from "./api";
import { Group, useGroupStore } from "./zustandStore";

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
      

  const updatedGroup =   await joinGroup(groupId, userId);
  console.log(updatedGroup)
  if (updatedGroup) {
    // Get the current groups from the store
    const currentGroups = useGroupStore.getState().groupsOfUser;

    // Replace the old group with the updated one
    const updatedGroups = currentGroups.map(group =>
      group.id === updatedGroup.id ? updatedGroup : group
    );

    // Update the groups in the store
    useGroupStore.getState().setGroupsOfUser(updatedGroups);
  }
  console.log("waths up")
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };