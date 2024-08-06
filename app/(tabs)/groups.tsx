import { StyleSheet,  Text, View , TouchableOpacity, Modal,TextInput, Button, TouchableWithoutFeedback} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking'; 
import {useLocalSearchParams} from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { Picker } from '@react-native-picker/picker'; 
import { handleCreateGroup, handleJoinGroup } from '@/utils';



export default function TabGroupScreen() {
  const groupsOfUser = useGroupStore((state) => state.groupsOfUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(groupsOfUser[0]?.id)

  const redirectUrl = Linking.createURL('/groups', {
    queryParams: {groupId: groupsOfUser[0]?.id, invited:"true"}
  });
  const { groupId,invited } = useLocalSearchParams<{ groupId?: string, invited?:string }>();

   useEffect(() => {
    if (groupsOfUser.length > 0) {
      setSelectedGroup(groupsOfUser[0]?.id);
    } else {
      setSelectedGroup(undefined);
    }
  }, [groupsOfUser])
  

  

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
              {groupsOfUser.find((group) => group.id === selectedGroup)
                ?.groupName || 'Unknown'}{' '}
              Group
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>

    {invited === 'true' ? (
      <View>
        <Button
          title="Join Group"
          onPress={() => handleJoinGroup(groupId || '')}
        />
      </View>
    ) : (
      <View style={{ width:"100%"}}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={{ color: 'black', fontSize: 40 ,textAlign:"center"}}>Shareable Group QR Code</Text>
        </TouchableOpacity>

        <Picker
          selectedValue={selectedGroup}
          onValueChange={(itemValue) => setSelectedGroup(itemValue)}
        >
          {groupsOfUser?.map((group) => (
            <Picker.Item
              key={group?.id}
              label={group?.groupName}
              value={group?.id}
            />
          ))}
        </Picker>

        <View style={{ height: 100, backgroundColor: 'green', width: '100%' }}></View>

<View style={{ width:"100%"}}> 

        <Text style={styles.modalTitle}>Enter New Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />

        <Button
          title="Create Group"
          color={'white'}
          onPress={() => handleCreateGroup(groupName,groupsOfUser)}
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
