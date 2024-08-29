import {  createGroup, joinGroup, logDebugInfo, } from "./api";
import { Group, useGroupStore } from "./zustandStore";
import {Keyboard, Platform} from "react-native"
import { Dispatch, SetStateAction } from 'react';
import { myColors } from "./theme";
import Toast from "react-native-root-toast";
import { router } from "expo-router";



export const handleCreateGroup = async (groupName: string , groupsOfUser:Group[],setNewGroupName: Dispatch<SetStateAction<string>>) => {
    try {
     
    if (!groupName.trim()) {
      showToast("You need to add a group name", false, "top")
        throw new Error('Group name is required');
      }

      const { userData , setGroupsOfUser, setSelectedGroup  } = useGroupStore.getState();



      if (!userData) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
     

      
      const groupId = await createGroup({
        groupName,
        members: [userData],
        dailyIndex: 0,
        lastUpdated: new Date().toLocaleDateString() ,
        votesYes: [],
        selectedMember: userData
      });

      const newGroup: Group = {
        id: groupId,
        groupName,
        members: [userData],
        dailyIndex: 0,
        lastUpdated: new Date().toLocaleDateString() ,
        votesYes: [],
        selectedMember: userData
      };
      setGroupsOfUser([...groupsOfUser, newGroup]);   
      if (groupsOfUser.length === 0) {
        setSelectedGroup(newGroup);
      }
      showToast(`Created ${groupName}`, true, "top")

      setNewGroupName("")
      Keyboard.dismiss();
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
  
    const previousIndex = selectedGroup.dailyIndex;
    const shouldUpdateIndex = !previousIndex || new Date().toISOString().split('T')[0] !== today;
  
    if (shouldUpdateIndex) {
      const randomIndex = Math.floor(Math.random() * selectedGroup.members.length);
      const updatedGroup = {
        ...selectedGroup,
        dailyIndex: randomIndex
      };
  
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
    setInvited: (invited: boolean) => void,
    groupInviteName: string | undefined

  ) => Promise<void>;

  export const handleJoinGroup: HandleJoinGroupFunction = async (groupId,setInvited,groupInviteName) => {
    try {
    
      const { userData, setGroupsOfUser, setSelectedGroup, groupsOfUser } = useGroupStore.getState();


      await logDebugInfo({ message: 'UserData:', userData });

      if (!userData || !groupId) {
        await logDebugInfo({ error: 'User ID or Group ID is missing', userData, groupId });
        throw new Error('User ID or Group ID is missing');
      }


      const updatedGroup = await joinGroup(groupId, userData);

      await logDebugInfo({ message: 'UpdatedGroup:', updatedGroup });

      if (updatedGroup) {
        const updatedGroups = [...groupsOfUser, updatedGroup];
        setGroupsOfUser(updatedGroups);
        await logDebugInfo({ message: 'GroupsOfUser after update:', updatedGroups });
  
        if (groupsOfUser.length === 0) {
          await logDebugInfo({ message: 'SelectedGroup set to:', updatedGroup });

          setSelectedGroup(updatedGroup);
        }
      }


      showToast(`You have joined ${groupInviteName}!`, true, "top")
      router.replace('/groups');
      setInvited(false)
    } catch (error:any) {
      await logDebugInfo({ error: 'Failed to join group:', details: error.message });

      console.error('Failed to join group:', error);
    }
  };



  export const showToast = (toastMessage:string, success:boolean, position: string) => {
    let backgroundColor;
    let textColor;
  
    if (success === true) {
      backgroundColor = myColors.four;
      textColor = myColors.three;
    } else if (success === false) {
      backgroundColor = myColors.five;
      textColor = myColors.three;
    } else {
      backgroundColor = myColors.four;
    }
    let toast = Toast.show(toastMessage, {
      duration: Toast.durations.LONG,
      position: position === "top" ? Toast.positions.TOP : Toast.positions.BOTTOM,
      backgroundColor: backgroundColor,
      textColor: textColor,
      opacity: 1,
      zIndex: 999,
      fontSize: Platform.OS === "ios" && Platform.isPad ? 30 : 23,
      textStyle: { fontFamily:"KalRegular" },
    });
  };
  