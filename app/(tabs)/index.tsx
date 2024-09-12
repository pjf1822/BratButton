import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  AppState
} from 'react-native';
import BitchButton from '@/components/BitchButton';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { useEffect, useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import {
  deleteGroupIds,
  deleteUserId,
  handleJoinGroup,
  showToast,
  viewGroupData,
  viewUserData
} from '@/utils';
import Modal from 'react-native-modal';
import TallyComp from '@/components/TallyComp';

export default function TabOneScreen() {
  const { selectedGroup, groupsOfUser, userData, setSelectedGroup } =
    useGroupStore((state) => ({
      selectedGroup: state.selectedGroup,
      groupsOfUser: state.groupsOfUser,
      userData: state.userData,
      setSelectedGroup: state.setSelectedGroup
    }));

  // THE INVITE SECTION
  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{
    groupInviteId?: string;
    invitedBool: string;
    groupInviteName: string;
  }>();
  const [connectedToInternet, setConnectedToInternet] = useState(true);

  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    setConnectedToInternet(state?.isConnected);
    return;
  };

  useEffect(() => {
    if (invitedBool) {
      checkConnectivity();

      const foundGroup = groupsOfUser?.find(
        (group) => group.id === groupInviteId
      );

      if (foundGroup) {
        showToast(`You're already in ${groupInviteName}`, true, 'top');
        setSelectedGroup(foundGroup);
        router.replace('/');
      } else {
        // or we join the group
        handleJoinGroup(groupInviteId, groupInviteName);
        router.replace('/');
      }
    }
  }, [invitedBool]);

  const handleModalClose = () => {
    setConnectedToInternet(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            flex: 1
          }}
        >
          {groupsOfUser.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.noGroupsText}>
                Hey, create or join a group first!
              </Text>
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.title}>
                Is{' '}
                <Text style={{ fontFamily: 'KalBold' }}>
                  {
                    selectedGroup?.members[selectedGroup?.dailyIndex || 0]
                      .username
                  }
                </Text>{' '}
                Being A
              </Text>
            </View>
          )}

          <BitchButton
            userData={userData}
            selectedGroupId={selectedGroup?.id}
          />

          {groupsOfUser?.length > 0 && <Text style={styles.title}>Today</Text>}
        </View>

        {selectedGroup && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 60
            }}
          >
            <Text style={[styles.subtitle, { fontFamily: 'KalSemiBold' }]}>
              {selectedGroup?.groupName}
            </Text>
            <Text style={styles.subtitle}>Today's Brat Tally:</Text>
            <TallyComp selectedGroup={selectedGroup} />
          </View>
        )}

        {/* delete these */}
        <Button color="white" onPress={deleteUserId} title="Delete some shit" />
        <Button
          color="white"
          onPress={deleteGroupIds}
          title="Delete group ids"
        />
        <Button color="white" onPress={viewUserData} title="View stored data" />
        <Button color="white" onPress={viewGroupData} title="View group data" />
      </View>
      <Modal
        isVisible={!connectedToInternet}
        onBackdropPress={handleModalClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: myColors.three,
            padding: 20,
            borderRadius: 10
          }}
        >
          <Text
            style={{ fontSize: 18, marginBottom: 40, fontFamily: 'KalMedium' }}
          >
            You are not connected to the internet. Please check connection and
            rescan the QR code
          </Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.three,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: Platform.isPad ? 50 : 29,
    fontWeight: '100'
  },
  tallyContainer: {
    position: 'relative',
    width: 50,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20
  },
  diagonalTallyMark: {
    position: 'absolute',
    height: 65,
    width: 4,
    backgroundColor: myColors.five,
    transform: [{ rotate: '-70deg' }],
    left: 23,
    top: -18,
    zIndex: 1,
    borderRadius: 100
  },
  tallyMark: {
    height: 30,
    width: 4,
    backgroundColor: myColors.one,
    borderRadius: 100,
    marginLeft: 5
  },
  mainText: {
    fontFamily: 'KalRegular',
    color: myColors.five,
    fontSize: 100,
    fontWeight: '100'
  },
  subtitle: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: Platform.isPad ? 40 : 29,
    fontWeight: '100'
  },
  createGroupText: {
    color: myColors.five,
    fontSize: 40
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: myColors.five
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10
  },
  noGroupsText: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 33,
    textAlign: 'center',
    paddingBottom: 70
  },
  voteText: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 20,
    marginVertical: 5
  }
});
