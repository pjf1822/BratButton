import { StyleSheet,  Text, View , TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking'; 
import {useLocalSearchParams} from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { Picker } from '@react-native-picker/picker'; 
import NewGroupForm from '@/components/NewGroupForm';
import QRCodeModal from '@/components/QRCodeModal';
import { handleJoinGroup } from '@/utils';



export default function TabGroupScreen() {
  const { groupsOfUser, selectedGroup, setSelectedGroup,invited,setInvited,setInviteParams,inviteParams } = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    selectedGroup: state.selectedGroup,
    setSelectedGroup: state.setSelectedGroup,
    invited: state.invited,
    setInvited: state.setInvited,
    setInviteParams: state.setInviteParams,
    inviteParams: state.inviteParams
  }));  




  const [modalVisible, setModalVisible] = useState(false);

  const redirectUrl = Linking.createURL('/groups', {
    queryParams: { groupInviteId: selectedGroup?.id, invitedBool: "true" , groupInviteName: selectedGroup?.groupName  }
  });


  const { groupInviteId, invitedBool, groupInviteName } = useLocalSearchParams<{ groupInviteId?: string, invitedBool: string,groupInviteName:string }>();



  useEffect(() => {
    if (groupInviteId || invitedBool || groupInviteName) {
      setInviteParams(groupInviteId, invitedBool, groupInviteName);
      if (invitedBool === "true") {
        
        setInvited(true);
      }
    }
  }, [groupInviteId, invitedBool, groupInviteName]);



  const handlePickerChange = (itemValue: string) => {
    const selectedGroup = groupsOfUser.find(group => group.id === itemValue);
    if (selectedGroup) {
      setSelectedGroup(selectedGroup);
    }
  };


  return (
    <View style={styles.container}>
    <QRCodeModal selectedGroup={selectedGroup} redirectUrl={redirectUrl} modalVisible={modalVisible}setModalVisible={setModalVisible} />

    {invited === true ? (
      <View>
       <TouchableOpacity
          onPress={() => handleJoinGroup(inviteParams?.groupInviteId,setInvited)}
          style={{ 
            padding: 10, 
            backgroundColor: 'blue', 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
          Join {inviteParams.groupInviteName}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ width: "100%" }}>
     {groupsOfUser.length > 0 && (
      <View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: 'black', fontSize: 40, textAlign: 'center' }}>
            Shareable Group QR Code
          </Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Your Groups
        </Text>
      </View>
      )}
    
   
      
      {selectedGroup && (
        <Picker
          selectedValue={selectedGroup.id}
          onValueChange={handlePickerChange}
          style={{ display: selectedGroup ? "flex" : "none" }}
        >
          {groupsOfUser.map((group) => (
            <Picker.Item
              key={group.id}
              label={group.groupName}
              value={group.id}
            />
          ))}
        </Picker>
      )}

      <View style={{ height: 100, width: '100%' }} />

      <NewGroupForm groupsOfUser={groupsOfUser} />
    </View>
    )}
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:"100%"
  },
  title: {
    fontFamily: 'Thin',
    color: 'red',
    fontSize: 30,
    fontWeight: '100',
  },
  mainText: {
    fontFamily: 'KalThin',
    color: 'red',
    fontSize: 100,
    fontWeight: '100',
  },
  subtitle: {
    fontFamily: 'KalThin',
    color: 'red',
    fontSize: 30,
    fontWeight: '100',
  },
  createGroupText: {
    color: 'black',
    fontSize: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
});
