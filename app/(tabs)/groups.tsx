import { StyleSheet,  Text, View , TouchableOpacity, Modal,TextInput, Button} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useState } from 'react';
import { createGroup, joinGroup } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking'; 
import {useLocalSearchParams} from 'expo-router';
import { useGroupStore } from '@/zustandStore';


export default function TabGroupScreen() {
  const groupsOfUser = useGroupStore((state) => state.groupsOfUser);
const logo  = "https://scontent.xx.fbcdn.net/v/t1.15752-9/453427519_447748768253915_3909984510166363846_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=LA9jN1Km0HMQ7kNvgEZFkfs&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFR0mQdMXIHfCZIX1LtCaghlnPl2aNembm-PMAByrp2qw&oe=66D8C60F"



  const redirectUrl = Linking.createURL('/groups', {
    queryParams: {groupId: groupsOfUser[0]?.id, invited:"true"}
  });
  

  const { groupId,invited } = useLocalSearchParams<{ groupId?: string, invited?:string }>();

  
  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const groupId = await createGroup({ members: [userId] }, groupName);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');

      if (!userId || !groupId) {
        throw new Error('User ID or Group ID is missing');
      }
      

      await joinGroup(groupId, userId);
      console.log(`User ${userId} joined group ${groupId}`);
    } catch (error) {
      console.error('Failed to join group:', error);
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <QRCode
            value={redirectUrl}
            size={350}
            enableLinearGradient
            logoSize={30}
            logo={{ uri: logo }}
          />
        </View>
      </View>
    </Modal>
  
  
    {invited === 'true' ? (
      <View>
        <Button title="Join Group" onPress={handleJoinGroup} />
      </View>
    ) : (
      <View>
         <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{ color: 'black', fontSize: 40 }}>Invite to Group</Text>
      </TouchableOpacity>
        <Text style={styles.modalTitle}>Enter Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={groupName}
          onChangeText={setGroupName}
        />
        <Button title="Create Group" onPress={handleCreateGroup} />
        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
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
