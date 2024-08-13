import { StyleSheet,  Text, View , TouchableOpacity, Modal,TextInput, Button, } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking'; 
import {useLocalSearchParams} from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { Picker } from '@react-native-picker/picker'; 
import { handleCreateGroup } from '@/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { joinGroup } from '@/api';



export default function TabGroupScreen() {
  const { groupsOfUser, selectedGroupId,  setSelectedGroupId } = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    selectedGroupId: state.selectedGroupId,
    setSelectedGroupId: state.setSelectedGroupId,
  }));  
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupName, setSelectedGroupName] = useState<string | undefined>(groupsOfUser[0]?.groupName)


  const [invited, setInvited] = useState<Boolean >(false); 

  const redirectUrl = Linking.createURL('/groups', {
    queryParams: { groupId: selectedGroupId, invitedParam: "true" , groupName: selectedGroupName }
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
      setSelectedGroupId(selectedGroup.id);
      setSelectedGroupName(selectedGroup.groupName);
    }
  };

  return (
    <View style={styles.container}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        style={styles.modalContainer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <QRCode
              value={redirectUrl}
              size={350}
              enableLinearGradient
            />
            <Text>
              hey join{' '}
              {groupsOfUser.find((group) => group.id === selectedGroupId)
                ?.groupName || 'Unknown'}{' '}
              Group
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>

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
      <View style={{ width:"100%"}}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: 'black', fontSize: 40 ,textAlign:"center"}}>Shareable Group QR Code</Text>
        </TouchableOpacity>

<Text style={{ color: 'white', textAlign: 'center' }}> your groups</Text>
        <Picker
          selectedValue={selectedGroupId}
          onValueChange={handlePickerChange}
          style={{display:selectedGroupId === undefined ? "none" : "flex"}}
        >
          {groupsOfUser?.map((group) => (
            <Picker.Item
              key={group?.id}
              label={group?.groupName}
              value={group?.id}
            />
          ))}
        </Picker>

        <View style={{ height: 100, width: '100%' }}></View>

          <View style={{ width:"100%"}}> 

        <Text style={styles.modalTitle}>Enter New Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={newGroupName}
          onChangeText={setNewGroupName}
        />

        <Button
          title="Create Group"
          color={'white'}
          onPress={() => handleCreateGroup(newGroupName,groupsOfUser)}
        />
</View>

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
