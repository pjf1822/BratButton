import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { handleJoinGroup, showToast } from '@/utils';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { logDebugInfo } from '@/api';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';

const inviteLandingPage = () => {
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

  const {
    groupsOfUser,
    inviteParams,
    setInviteParams,
    setInvited,
    setSelectedGroup,
    loading,
    setLoading
  } = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    setInviteParams: state.setInviteParams,
    inviteParams: state.inviteParams,
    setInvited: state.setInvited,
    setSelectedGroup: state.setSelectedGroup,
    loading: state.loading,
    setLoading: state.setLoading
  }));

  const trySomeDebug = async () => {
    try {
      await logDebugInfo({
        message: 'arrival at group invite page',
        groupInviteId,
        invitedBool,
        groupInviteName,
        groupsOfUser
      });
    } catch (error) {
      console.error('Failed to log debug info:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      checkConnectivity();
      trySomeDebug();

      // this assigns the route params to the global state that we have
      if (groupInviteId || invitedBool || groupInviteName) {
        setInviteParams(groupInviteId, invitedBool, groupInviteName);
        setInvited(true);
      }
      // this will only run if we dont get pulled away to the add username page
      if (groupInviteId) {
        const foundGroup = groupsOfUser?.find(
          (group) => group.id === groupInviteId
        );
        if (foundGroup) {
          router.replace('/groups');
          showToast(`You're already in ${groupInviteName}`, true, 'top');
          setSelectedGroup(foundGroup);
        } else {
          // or we join the group
          handleJoinGroup(groupInviteId, setInvited, groupInviteName);
        }
      } else {
        handleJoinGroup(
          inviteParams?.groupInviteId,
          setInvited,
          inviteParams?.groupInviteName
        );
      }
    }
  }, [loading]);

  const handleModalClose = () => {
    setConnectedToInternet(true);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: myColors.one,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: myColors.three
          }}
        >
          <Image
            source={require('../assets/brat-button.jpg')}
            style={{
              objectFit: 'contain',
              minHeight: Platform.isPad ? '55%' : 10,
              minWidth: Platform.isPad ? '90%' : 10,
              maxHeight: Platform.isPad ? 1000 : 350
            }}
          />
        </View>
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
          {/* <TouchableOpacity onPress={handleModalClose} style={{ backgroundColor: myColors.four, padding: 10, borderRadius: 5, }}>
            <Text style={{ color: myColors.one,fontFamily:"KalMedium", fontSize: 20 }}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </Modal>
    </>
  );
};

export default inviteLandingPage;
