import { View, Text, TouchableOpacity   } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { handleJoinGroup, showToast } from '@/utils';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';


const inviteLandingPage = () => {
  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{ groupInviteId?: string, invitedBool: string,groupInviteName:string }>();

  const { groupsOfUser,inviteParams ,setInviteParams,setInvited,invited} = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    setInviteParams: state.setInviteParams,
    inviteParams: state.inviteParams,
    setInvited:state.setInvited,
    invited:state.invited
  })); 
  
 

  useEffect(() => {
    if (groupInviteId || invitedBool || groupInviteName) {
      setInviteParams(groupInviteId, invitedBool, groupInviteName);
      setInvited(true);
    }
  
    if (groupsOfUser.length > 0 && groupInviteId && invited === false) {
      const foundGroup = groupsOfUser.find((group) => group.id === groupInviteId);
      if (foundGroup) {
        router.replace('/groups');
        showToast(`Youre already in ${groupInviteName} `, true, "top");
      } 
    }
  
  }, [groupInviteId, groupsOfUser]);


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
            Join {inviteParams?.groupInviteName}
          </Text>
        </TouchableOpacity>
      </View>
   
  </>
  )
}

export default inviteLandingPage