import AsyncStorage from "@react-native-async-storage/async-storage";
import {  createGroup, } from "./api";
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
      
      
      const groupId = await createGroup({ members: [{id:user.userId, username:user.username}],groupName});
      
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

 

  export const updateDailyIndexForGroup = () => {
    const { selectedGroup, groupsOfUser, setGroupsOfUser } = useGroupStore.getState();
  
    if (!selectedGroup) {
      console.error('No group selected');
      return;
    }
  
   
  
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
    // Check if dailyIndex is already set for today
    const previousIndex = selectedGroup.dailyIndex;
    const shouldUpdateIndex = !previousIndex || new Date().toISOString().split('T')[0] !== today;
  
    if (shouldUpdateIndex) {
      const randomIndex = Math.floor(Math.random() * selectedGroup.members.length);
      const updatedGroup = {
        ...selectedGroup,
        dailyIndex: randomIndex
      };
  
      // Update the group in the state
      const updatedGroups = groupsOfUser.map(group =>
        group.id === selectedGroup.id ? updatedGroup : group
      );
      setGroupsOfUser(updatedGroups);
  
      console.log(`Selected member for today: ${selectedGroup.members[randomIndex].username}`);
    } else {
      console.log(`Today's member was previously selected: ${selectedGroup.members[previousIndex].username}`);
    }
  };