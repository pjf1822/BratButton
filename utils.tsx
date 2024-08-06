import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGroup, joinGroup } from "./api";

export const handleCreateGroup = async (groupName: string, setModalVisible: (visible: boolean) => void) => {
    try {
     
    if (!groupName.trim()) {
        throw new Error('Group name is required');
      }
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const groupId = await createGroup({ members: [userId],groupName});
      setModalVisible(false);
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