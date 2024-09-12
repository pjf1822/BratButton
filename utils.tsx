import { createGroup, joinGroup } from './api';
import { Group, useGroupStore } from './zustandStore';
import { Keyboard, Platform } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { myColors } from './theme';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const populateGroups = async (
  groupIds: string[],
  setSelectedGroup: (group: Group | undefined) => void
): Promise<Group[]> => {
  try {
    const groupsRef = collection(db, 'groups');
    const groupQuery = query(groupsRef, where('__name__', 'in', groupIds));
    const groupSnapshots = await getDocs(groupQuery);

    const today = new Date().toLocaleDateString();
    const allGroups: Group[] = [];

    const originalOrderMap: { [key: string]: number } = {};
    groupIds.forEach((id, index) => {
      originalOrderMap[id] = index;
    });

    const updatePromises = groupSnapshots.docs.map(async (docSnapshot) => {
      const data = docSnapshot.data() as Group;

      if (data.lastUpdated !== today) {
        console.log(`Group ${docSnapshot.id} needs to be updated.`);
        const newDailyIndex = Math.floor(
          Math.random() * (data.members?.length || 1)
        );

        data.lastUpdated = today;
        data.dailyIndex = newDailyIndex;

        const groupRef = doc(db, 'groups', docSnapshot.id);
        await updateDoc(groupRef, {
          lastUpdated: data.lastUpdated,
          dailyIndex: data.dailyIndex,
          votesYes: [] // Reset votesYes array
        });
      }

      // Add the updated or existing group data to the list
      allGroups.push({
        ...data,
        lastUpdated: today,
        dailyIndex: data.dailyIndex
      });
    });

    await Promise.all(updatePromises);
    allGroups.sort((a, b) => {
      return (originalOrderMap[a.id] || 0) - (originalOrderMap[b.id] || 0);
    });

    setSelectedGroup(allGroups[0]);
    // Optionally set the selected group if needed
    // if (selectedGroup && updatedGroups.length > 0) {
    //   setSelectedGroup(
    //     updatedGroups.find((group) => group.id === selectedGroup.id)
    //   );
    // }

    return allGroups;
  } catch (error) {
    console.error('Failed to populate groups:', error);
    return [];
  }
};
export const handleCreateGroup = async (
  groupName: string,
  groupsOfUser: Group[],
  setNewGroupName: Dispatch<SetStateAction<string>>,
  setModalVisible: (visible: boolean) => void
) => {
  try {
    if (!groupName.trim()) {
      showToast('You need to add a group name', false, 'top');
      throw new Error('Group name is required');
    }

    const { userData, setGroupsOfUser, setSelectedGroup } =
      useGroupStore.getState();

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
    // GLOBAL
    const updatedGroups = [...groupsOfUser, newGroup];
    setGroupsOfUser(updatedGroups);
    setSelectedGroup(newGroup);

    // ASYNC USER INFO
    const groupIdsJSON = await AsyncStorage.getItem('groupIds');
    const groupIds = groupIdsJSON ? JSON.parse(groupIdsJSON) : [];
    await AsyncStorage.setItem(
      'groupIds',
      JSON.stringify([...groupIds, groupId])
    );

    // LOCAL
    setNewGroupName('');
    Keyboard.dismiss();
    setModalVisible(true);
  } catch (error) {
    console.error('Failed to create group:', error);
  }
};

type HandleJoinGroupFunction = (
  groupId: string,
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
      setSelectedGroup(updatedGroup);
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
