import { createGroup, joinGroup } from './api';
import { Group, useGroupStore } from './zustandStore';
import { Keyboard, Platform, Alert } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { myColors } from './theme';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const populateGroups = async (groupSnapshots: any): Promise<Group[]> => {
  try {
    const today = new Date().toLocaleDateString();
    const allGroups: Group[] = [];
    const originalOrderMap: { [key: string]: number } = {};
    groupSnapshots.docs.forEach((docSnapshot: any, index: number) => {
      originalOrderMap[docSnapshot.id] = index;
    });

    const updatePromises = groupSnapshots.docs.map(async (docSnapshot: any) => {
      const data = docSnapshot.data() as Group;

      if (data.lastUpdated !== today) {
        console.log(`Group ${docSnapshot.id} needs to be updated.`);
        const newDailyIndex = Math.floor(
          Math.random() * (data.members?.length || 1)
        );

        const groupRef = doc(db, 'groups', docSnapshot.id);
        await updateDoc(groupRef, {
          lastUpdated: today,
          dailyIndex: newDailyIndex,
          votesYes: [] // Reset votesYes array
        });

        data.lastUpdated = today;
        data.dailyIndex = newDailyIndex;
        data.votesYes = []; // Reset votesYes array
      }

      allGroups.push({
        ...data,
        id: docSnapshot.id
      });
    });

    await Promise.all(updatePromises);

    // Sort the groups based on the original order
    allGroups.sort((a, b) => {
      return (originalOrderMap[a.id] || 0) - (originalOrderMap[b.id] || 0);
    });

    return allGroups; // Return the sorted
  } catch (error) {
    console.error('Failed to populate groups:', error);
    return [];
  }
};
export const handleCreateGroup = async (
  groupName: string,
  setNewGroupName: Dispatch<SetStateAction<string>>,
  setModalVisible: (visible: boolean) => void
) => {
  try {
    if (!groupName.trim()) {
      showToast('You need to add a group name', false, 'top');
      throw new Error('Group name is required');
    }

    const { userData, setSelectedGroup } = useGroupStore.getState();

    if (!userData) {
      throw new Error('User ID not found in AsyncStorage');
    }

    const groupId = await createGroup({
      groupName,
      members: [userData],
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: [],
      dailyIndex: 0
    });

    const newGroup: Group = {
      id: groupId,
      groupName,
      members: [userData],
      dailyIndex: 0,
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: []
    };
    console.log(newGroup, ' we have a new gorup');
    setSelectedGroup(newGroup.id);

    // LOCAL
    setNewGroupName('');
    Keyboard.dismiss();
    setModalVisible(true);
  } catch (error) {
    console.error('Failed to create group:', error);
  }
};

type HandleJoinGroupFunction = (
  groupId: string | undefined,
  groupInviteName: string | undefined
) => Promise<void>;

export const handleJoinGroup: HandleJoinGroupFunction = async (
  groupId,
  groupInviteName
) => {
  try {
    const { setGroupsOfUser, setSelectedGroup, groupsOfUser, userData } =
      useGroupStore.getState();

    const updatedGroup = await joinGroup(groupId, userData);
    if (updatedGroup) {
      const updatedGroups = [...groupsOfUser, updatedGroup];
      setGroupsOfUser(updatedGroups);
      setSelectedGroup(updatedGroup.id);
    }
    // ADD GORUPS TO ASYNC GROUP
    const groupIdsJSON = await AsyncStorage.getItem('groupIds');
    const groupIds = groupIdsJSON ? JSON.parse(groupIdsJSON) : [];
    const updatedGroupIds = [...groupIds, groupId];
    await AsyncStorage.setItem('groupIds', JSON.stringify(updatedGroupIds));

    showToast(`You have joined ${groupInviteName}!`, true, 'top');
  } catch (error: any) {
    console.error('Failed to join group:', error);
  }
};

export const showToast = (
  toastMessage: string,
  success: boolean,
  position: string
) => {
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
    position: position === 'top' ? Toast.positions.TOP : Toast.positions.BOTTOM,
    backgroundColor: backgroundColor,
    textColor: textColor,
    opacity: 1,
    zIndex: 999,
    textStyle: {
      fontFamily: 'KalRegular',
      fontSize: Platform.OS === 'ios' && Platform.isPad ? 27 : 23
    }
  });
};

export const deleteUserId = async () => {
  await AsyncStorage.removeItem('user');
};

export const viewUserData = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    if (user !== null) {
      Alert.alert('User Data', user);
    } else {
      Alert.alert('No User Data Found');
    }
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    Alert.alert('Error', 'Failed to retrieve user data');
  }
};
