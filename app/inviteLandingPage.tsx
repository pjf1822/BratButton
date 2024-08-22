import { View, Text, TouchableOpacity ,  ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { handleJoinGroup, showToast } from '@/utils';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';


const inviteLandingPage = () => {
  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{ groupInviteId?: string, invitedBool: string,groupInviteName:string }>();

  const { groupsOfUser,inviteParams ,setInviteParams,setInvited} = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    setInviteParams: state.setInviteParams,
    inviteParams: state.inviteParams,
    setInvited:state.setInvited
  })); 
  
  const [checkIfAlreadyInGroupLoading,setCheckIfAlreadyInGroupLoading] = useState(true)


  useEffect(() => {
    setCheckIfAlreadyInGroupLoading(true);

    if (groupInviteId || invitedBool || groupInviteName) {
      setInviteParams(groupInviteId, invitedBool, groupInviteName);
      setInvited(true);
    }
  
    if (groupsOfUser.length > 0 && groupInviteId) {
      const foundGroup = groupsOfUser.find((group) => group.id === groupInviteId);
      if (foundGroup) {
        router.replace('/groups');
        showToast(`Youre already in ${groupInviteName} `, true, "top");
        setCheckIfAlreadyInGroupLoading(false);
      } else {
        setCheckIfAlreadyInGroupLoading(false);
      }
    }
  
  }, [groupInviteId, groupsOfUser]);



  return (
    <>
    {!checkIfAlreadyInGroupLoading && inviteParams?.groupInviteId ? (
      <View
        style={{
          flex: 1,
          backgroundColor: myColors.one,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => handleJoinGroup(inviteParams?.groupInviteId,setInvited)}
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
    ) : (
      <View
        style={{
          backgroundColor: myColors.two,
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center',
        }}
      >
 <ActivityIndicator
            size="large"
            color={myColors.five} 
            style={{ margin: 20 }}
          />  
              </View>
    )}
  </>
  )
}

export default inviteLandingPage