import { createGroup, joinGroup } from './api';
import { Group, User, useGroupStore } from './zustandStore';
import { Keyboard, Platform } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { myColors } from './theme';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  DocumentReference
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { userConverter } from './firestoreConverters';

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

    for (const docSnapshot of groupSnapshots.docs) {
      const data = docSnapshot.data() as Group;

      if (data.lastUpdated !== today) {
        console.log(`Group ${data}  needs to be updated.`);
        const newDailyIndex = Math.floor(Math.random() * data.members?.length);

        const newSelectedMember = data.members[newDailyIndex];

        data.lastUpdated = today;
        data.dailyIndex = newDailyIndex;
        data.selectedMember = newSelectedMember;

        const groupRef = doc(db, 'groups', docSnapshot.id);

        await updateDoc(groupRef, {
          lastUpdated: data.lastUpdated,
          dailyIndex: data.dailyIndex,
          selectedMember: newSelectedMember
        });
      } else {
      }

      allGroups.push(data);
    }

    console.log(allGroups[0], 'teh all gorups');
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

    const userDocRef: DocumentReference<User> = doc(
      db,
      'users',
      userData.id
    ).withConverter(userConverter);

    const groupId = await createGroup({
      groupName,
      members: [userDocRef],
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: [],
      dailyIndex: 0,
      selectedMember: userDocRef
    });

    const newGroup: Group = {
      id: groupId,
      groupName,
      members: [userDocRef], // Use DocumentReference<User> here
      dailyIndex: 0,
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: [], // Initialize votesYes as an empty array,
      selectedMember: userDocRef
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
  groupId: string | undefined,
  setInvited: (invited: boolean) => void,
  groupInviteName: string | undefined
) => Promise<void>;

export const handleJoinGroup: HandleJoinGroupFunction = async (
  groupId,
  setInvited,
  groupInviteName
) => {
  console.log(groupId, groupInviteName, 'this ');
  return;
  try {
    const { setGroupsOfUser, setSelectedGroup, groupsOfUser, userData } =
      useGroupStore.getState();

    const updatedGroup = await joinGroup(groupId, userData);

    if (updatedGroup) {
      const updatedGroups = [...groupsOfUser, updatedGroup];
      setGroupsOfUser(updatedGroups);
      setSelectedGroup(updatedGroup);
    }
    showToast(`You have joined ${groupInviteName}!`, true, 'top');
    router.replace('/');
    setInvited(false);
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
