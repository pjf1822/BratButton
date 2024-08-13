import { StyleSheet,  Text, View , TouchableOpacity} from 'react-native';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking'; 
import {useLocalSearchParams} from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { Picker } from '@react-native-picker/picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { joinGroup } from '@/api';
import NewGroupForm from '@/components/NewGroupForm';
import QRCodeModal from '@/components/QRCodeModal';



export default function TabGroupScreen() {
  const { groupsOfUser, selectedGroup, setSelectedGroup } = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    selectedGroup: state.selectedGroup,
    setSelectedGroup: state.setSelectedGroup,
  }));  

  const [selectedGroupName, setSelectedGroupName] = useState<string | undefined>(groupsOfUser[0]?.groupName)
  const [invited, setInvited] = useState<Boolean>(false); 
  const [modalVisible, setModalVisible] = useState(false);

  const redirectUrl = Linking.createURL('/groups', {
    queryParams: { groupId: selectedGroup?.id, invitedParam: "true" , groupName: selectedGroupName }
  });


  const { groupId, invitedParam, groupName } = useLocalSearchParams<{ groupId?: string, invitedParam: string,groupName:string }>();


  useEffect(() => {
    if (groupsOfUser.length > 0) {
      setSelectedGroupName(groupsOfUser[0]?.groupName);
    } else {
      setSelectedGroupName(undefined);
    }
  }, [groupsOfUser]);

  useEffect(() => {
    if (invitedParam === "true") {
      setInvited(true);
    }
  }, [invitedParam]);

  const handleJoinGroup = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const user = JSON.parse(userString); 
   
      

      if (!user || !groupId) {
        throw new Error('User ID or Group ID is missing');
      }

      const updatedGroup = await joinGroup(groupId, user.userId, user.username);

      if (updatedGroup) {
        const currentGroups = useGroupStore.getState().groupsOfUser;
        const updatedGroups = [...currentGroups, updatedGroup];
        useGroupStore.getState().setGroupsOfUser(updatedGroups);
      }

      setInvited(false);
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };



  const handlePickerChange = (itemValue: string) => {
    const selectedGroup = groupsOfUser.find(group => group.id === itemValue);
    if (selectedGroup) {
      setSelectedGroup(selectedGroup);
      setSelectedGroupName(selectedGroup.groupName);
    }
  };


  return (
    <View style={styles.container}>
    <QRCodeModal selectedGroup={selectedGroup} redirectUrl={redirectUrl} modalVisible={modalVisible}setModalVisible={setModalVisible} />

    {invited === true ? (
      <View>
       <TouchableOpacity
          onPress={() => handleJoinGroup()}
          style={{ 
            padding: 10, 
            backgroundColor: 'blue', 
            borderRadius: 5 
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
          Join {groupName}
          </Text>
        </TouchableOpacity>
      </View>
    ) : (
      <View style={{ width: "100%" }}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ color: 'black', fontSize: 40, textAlign: "center" }}>
          Shareable Group QR Code
        </Text>
      </TouchableOpacity>

      <Text style={{ color: 'white', textAlign: 'center' }}>
        Your Groups
      </Text>

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
    fontFamily: 'Kal',
    color: 'red',
    fontSize: 30,
    fontWeight: '100',
  },
  mainText: {
    fontFamily: 'Kal',
    color: 'red',
    fontSize: 100,
    fontWeight: '100',
  },
  subtitle: {
    fontFamily: 'Kal',
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
