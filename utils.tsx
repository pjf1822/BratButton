import { Group, User, useGroupStore } from './zustandStore';
import { Keyboard, Platform, Alert } from 'react-native';
import { Dispatch, SetStateAction } from 'react';
import { myColors } from './theme';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const handleCreateGroup = async (
  groupName: string,
  setNewGroupName: Dispatch<SetStateAction<string>>,
  setModalVisible: (visible: boolean) => void
) => {
  const { setSelectedGroup, userData } = useGroupStore.getState();

  try {
    if (!groupName.trim()) {
      showToast('You need to add a group name', false, 'top');
      throw new Error('Group name is required');
    }

    if (!userData) {
      throw new Error('User ID not found in AsyncStorage');
    }
    const docRef = doc(collection(db, 'groups'));
    const groupId = docRef.id;

    await setDoc(docRef, {
      id: groupId,
      groupName,
      members: [userData],
      lastUpdated: new Date().toLocaleDateString(),
      votesYes: [],
      dailyIndex: 0
    });

    setSelectedGroup(groupId);
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
  const { setSelectedGroup, userData } = useGroupStore.getState();

  try {
    if (typeof groupId !== 'string') {
      throw new Error('Invalid group ID');
    }
    const groupRef = doc(db, 'groups', groupId);

    await updateDoc(groupRef, {
      members: arrayUnion(userData)
    });
    setSelectedGroup(groupId);

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

export const fetchUser = async () => {
  const { setUserData, setLoading } = useGroupStore.getState();

  const userString = await AsyncStorage.getItem('user');
  const user = userString ? (JSON.parse(userString) as User) : null;
  if (!user) {
    setLoading(false);
    return null;
  }
  setUserData(user);
  return user;
};

export const fetchGroups = async (user: User) => {
  const { setGroupsOfUser, setSelectedGroup, setLoading } =
    useGroupStore.getState();

  try {
    const groupsRef = collection(db, 'groups');
    const groupQuery = query(
      groupsRef,
      where('members', 'array-contains', user)
    );
    const groupSnapshots = await getDocs(groupQuery);

    if (groupSnapshots.docs.length > 0) {
      const firstGroupId = groupSnapshots.docs[0].id;
      setSelectedGroup(firstGroupId);
      await updateDailyIndexes(groupSnapshots);
    }
    const unsubscribe = onSnapshot(groupQuery, (snapshot) => {
      const groupsList = snapshot.docs.map((doc) => ({
        ...(doc.data() as any)
      }));
      // console.log(
      //   groupsList.map((gourp) => gourp),
      //   'the list that we are listengin to '
      // );
      setGroupsOfUser(groupsList);
      setLoading(false);
    });

    return unsubscribe;
  } catch (error) {
    console.error('Error fetching puppies: ', error);
  }
};

export const updateDailyIndexes = async (
  groupSnapshots: any
): Promise<void> => {
  try {
    const today = new Date().toLocaleDateString();

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
          votesYes: []
        });
      }
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Failed to populate groups:', error);
  }
};
