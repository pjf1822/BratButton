import { createGroup, joinGroup } from './api';
import { Group, User, useGroupStore } from './zustandStore';
import { Keyboard, Platform } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { myColors } from './theme';
import Toast from 'react-native-root-toast';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DocumentReference, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { userConverter } from './app/firestoreConverters';

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
      dailyIndex: 0,
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: []
    });

    const newGroup: Group = {
      id: groupId,
      groupName,
      members: [userDocRef], // Use DocumentReference<User> here
      dailyIndex: 0,
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: [] // Initialize votesYes as an empty array
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

export const updateDailyIndexForGroup = () => {
  const { selectedGroup, groupsOfUser, setGroupsOfUser } =
    useGroupStore.getState();

  if (!selectedGroup) {
    console.error('No group selected');
    return;
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  const previousIndex = selectedGroup.dailyIndex;
  const shouldUpdateIndex =
    !previousIndex || new Date().toISOString().split('T')[0] !== today;

  if (shouldUpdateIndex) {
    const randomIndex = Math.floor(
      Math.random() * selectedGroup.members.length
    );
    const updatedGroup = {
      ...selectedGroup,
      dailyIndex: randomIndex
    };

    const updatedGroups = groupsOfUser.map((group) =>
      group.id === selectedGroup.id ? updatedGroup : group
    );
    setGroupsOfUser(updatedGroups);

    console.log(
      `Selected member for today: ${selectedGroup.members[randomIndex].username}`
    );
  } else {
    console.log(
      `Today's member was previously selected: ${selectedGroup.members[previousIndex].username}`
    );
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
