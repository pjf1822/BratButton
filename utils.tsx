import {  createGroup, joinGroup, } from "./api";
import { Group, useGroupStore } from "./zustandStore";

export const handleCreateGroup = async (groupName: string , groupsOfUser:Group[]) => {
    try {
     
    if (!groupName.trim()) {
        throw new Error('Group name is required');
      }

      const { userData , setGroupsOfUser, setSelectedGroup  } = useGroupStore.getState();



      if (!userData?.userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const { userId, username } = userData;

      
      const groupId = await createGroup({
        members: [{ id: userId, username }],
        groupName,
        dailyIndex: 0,
        lastUpdated: new Date().toLocaleDateString() 
      });

      const newGroup: Group = {
        id: groupId,
        groupName,
        members: [{ id: userId, username }],
        dailyIndex: 0,
        lastUpdated: new Date().toLocaleDateString() 
      };
      setGroupsOfUser([...groupsOfUser, newGroup]);   
      if (groupsOfUser.length === 0) {
        setSelectedGroup(newGroup);
      }
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

  type HandleJoinGroupFunction = (
    groupId: string | undefined,
    setInvited: (invited: boolean) => void
  ) => Promise<void>;
  export const handleJoinGroup: HandleJoinGroupFunction = async (groupId, setInvited) => {
    try {
    
      const { userData, setGroupsOfUser, setSelectedGroup, groupsOfUser } = useGroupStore.getState();

      

      if (!userData || !groupId) {
        throw new Error('User ID or Group ID is missing');
      }

      const updatedGroup = await joinGroup(groupId, userData.userId, userData.username);

      if (updatedGroup) {
        const updatedGroups = [...groupsOfUser, updatedGroup];
        setGroupsOfUser(updatedGroups);
  
  
        if (groupsOfUser.length === 0) {
          setSelectedGroup(updatedGroup);
        }
      }

      setInvited(false);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };
