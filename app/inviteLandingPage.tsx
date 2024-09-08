import { View, Text, TouchableOpacity   } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { handleJoinGroup, showToast } from '@/utils';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { logDebugInfo } from '@/api';
import NetInfo from '@react-native-community/netinfo';
import Modal from 'react-native-modal';




const inviteLandingPage = () => {
  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{ groupInviteId?: string, invitedBool: string,groupInviteName:string }>();
const [connectedToInternet ,setConnectedToInternet] = useState(true)
  const checkConnectivity = async () => {
    const state = await NetInfo.fetch();
    setConnectedToInternet(state?.isConnected)
    return
  };

  const { groupsOfUser,inviteParams ,setInviteParams,setInvited,invited} = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    setInviteParams: state.setInviteParams,
    inviteParams: state.inviteParams,
    setInvited:state.setInvited,
    invited:state.invited
  })); 

  
  const trySomeDebug = async () => {
    try {
      await logDebugInfo({ message: 'arrival at group invite page', groupInviteId, invitedBool, groupInviteName, groupsOfUser });
    } catch (error) {
      console.error('Failed to log debug info:', error);
    }
  };
  const firstRender = useRef(true);

  useEffect(() => {
    checkConnectivity()
    trySomeDebug()
    if (groupInviteId || invitedBool || groupInviteName) {
      setInviteParams(groupInviteId, invitedBool, groupInviteName);
      setInvited(true);
    }

    if (firstRender.current) {
      firstRender.current = false;

      if (groupsOfUser.length > 0 && groupInviteId) {
        const foundGroup = groupsOfUser.find((group) => group.id === groupInviteId);
        if (foundGroup) {
          router.replace('/groups');
          showToast(`You're already in ${groupInviteName}`, true, 'top');
        } 
      }
    }
    
  }, [groupInviteId, groupsOfUser]);


  const handleModalClose = () => {
    setConnectedToInternet(true)
  };


  return (
    <>
  
      <View
        style={{
          flex: 1,
          backgroundColor: myColors.one,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => handleJoinGroup(inviteParams?.groupInviteId,setInvited,inviteParams?.groupInviteName)}
          style={{
            backgroundColor: myColors.four,
            alignSelf: 'center',
            padding: 10,
            borderRadius: 14,
            borderWidth: 3,
            borderColor: myColors.five,
            shadowColor: '#000',
            width: '80%',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 6,
          }}
        >
          <Text
            style={{
              color: myColors.three,
              fontSize: 22,
              fontFamily: 'KalRegular',
              width: '100%',
              textAlign: 'center',
            }}
          >
            Join {inviteParams.groupInviteName || groupInviteName}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={!connectedToInternet} onBackdropPress={handleModalClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: myColors.three, padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 40,fontFamily:"KalMedium", }}>You are not connected to the internet. Please check connection and rescan the QR code</Text>
          {/* <TouchableOpacity onPress={handleModalClose} style={{ backgroundColor: myColors.four, padding: 10, borderRadius: 5, }}>
            <Text style={{ color: myColors.one,fontFamily:"KalMedium", fontSize: 20 }}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </Modal>
   
  </>
  )
}

export default inviteLandingPage