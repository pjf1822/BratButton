import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import * as Linking from 'expo-linking';
import { useGroupStore } from '@/zustandStore';
import NewGroupForm from '@/components/NewGroupForm';
import QRCodeModal from '@/components/QRCodeModal';
import { myColors } from '@/theme';
import MyButton from '@/components/MyComponents/MyButton';
import { handleJoinGroup, showToast } from '@/utils';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import GroupPicker from '@/components/GroupPicker';
import NoInternetModal from '@/components/NoInternetModal';

export default function TabGroupScreen() {
  const { groupsOfUser, selectedGroup, setSelectedGroup } = useGroupStore(
    (state) => ({
      groupsOfUser: state.groupsOfUser,
      selectedGroup: state.selectedGroup,
      setSelectedGroup: state.setSelectedGroup
    })
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [connectedToInternet, setConnectedToInternet] = useState(true);

  // THE REDIRECT
  const redirectUrl = Linking.createURL('/groups', {
    queryParams: {
      groupInviteId: selectedGroup,
      invitedBool: 'true',
      groupInviteName: groupsOfUser.find((group) => group.id === selectedGroup)
        ?.groupName
    }
  });

  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    setConnectedToInternet(state?.isConnected);
    return;
  };

  // THE INVITE SECTION
  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{
    groupInviteId?: string;
    invitedBool: string;
    groupInviteName: string;
  }>();

  useEffect(() => {
    // console.log(
    //   invitedBool,
    //   groupInviteId,
    //   groupInviteName,
    //   'the invited boolean'
    // );

    if (invitedBool === 'true') {
      checkConnectivity();

      const foundGroup = groupsOfUser?.find(
        (group) => group.id === groupInviteId
      );

      if (foundGroup) {
        showToast(`You're already in ${groupInviteName}`, true, 'top');
        setSelectedGroup(foundGroup.id);
      } else {
        handleJoinGroup(groupInviteId, groupInviteName);
      }

      router.replace('/groups');
    }
  }, [invitedBool]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <QRCodeModal
        selectedGroup={selectedGroup}
        redirectUrl={redirectUrl}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        groupsOfUser={groupsOfUser}
      />
      <Image
        source={require('../../assets/bar-purple.jpg')}
        style={{
          width: Platform.isPad
            ? groupsOfUser?.length > 0
              ? 340
              : 540 // Larger size for iPad when groupsOfUser is not empty
            : groupsOfUser?.length > 0
            ? 240
            : 280, // Larger size for iPhone when groupsOfUser is not empty
          height: Platform.isPad
            ? groupsOfUser?.length > 0
              ? 340
              : 540 // Same logic for height
            : groupsOfUser?.length > 0
            ? 240
            : 280,
          objectFit: 'contain',
          marginTop: 40
        }}
      />

      <View
        style={{
          width: '100%',
          position: 'relative',
          flex: 1,
          justifyContent: groupsOfUser?.length > 0 ? 'space-around' : 'center'
        }}
      >
        <NewGroupForm setModalVisible={setModalVisible} />

        {groupsOfUser.length > 0 && (
          <View
            style={{
              width: Platform.isPad ? '59%' : '66%',
              alignSelf: 'center',
              marginBottom: 40
            }}
          >
            <Text
              style={{
                color: myColors.four,
                textAlign: 'center',
                fontFamily: 'KalMedium',
                fontSize: Platform.isPad ? 40 : 30
              }}
            >
              Your Groups
            </Text>
            <GroupPicker
              selectedGroup={selectedGroup || ''}
              groupsOfUser={groupsOfUser}
              setSelectedGroup={setSelectedGroup}
            />

            <MyButton
              onPress={() => setModalVisible(true)}
              label={`Invite someone to ${
                groupsOfUser.find((group) => group.id === selectedGroup)
                  ?.groupName || 'Unknown'
              }`}
            />
          </View>
        )}
      </View>
      <NoInternetModal
        connectedToInternet={connectedToInternet}
        setConnectedToInternet={setConnectedToInternet}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.one,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%'
  }
});
