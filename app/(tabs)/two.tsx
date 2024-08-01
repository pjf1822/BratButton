import { StyleSheet,  Text, View , TouchableOpacity, Modal,TextInput, Button} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useState } from 'react';
import { createGroup } from '@/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabTwoScreen() {


  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        throw new Error('User ID not found in AsyncStorage');
      }
      
      const groupId = await createGroup({ members: [userId] }, groupName);
      setModalVisible(false); // Close the modal after creating the group
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const dynamicLink = "https://yourapp.page.link/join-group?groupId=gc0lOiSUCkPjqKNK08e6";

  return (
    <View style={styles.container}>
<QRCode value={dynamicLink} size={200} />

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={{color:"black",fontSize:40}}>create gruop</Text>
    </TouchableOpacity>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
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
        </View>
      </Modal>
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
