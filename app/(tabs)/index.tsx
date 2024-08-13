import { StyleSheet,  Text, View , TouchableOpacity, Modal,TextInput, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BitchButton from '@/components/BitchButton';
import { useGroupStore } from '@/zustandStore';
import { useEffect, useState } from 'react';

export default function TabOneScreen() {
  const {  selectedGroupId,  groupsOfUser } = useGroupStore((state) => ({
    selectedGroupId: state.selectedGroupId,
    groupsOfUser:state.groupsOfUser
  })); 
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const deleteUserId = async () => {
    await AsyncStorage.removeItem('user');
  };


  useEffect(() => {
    console.log("so we dont have the selected Group id")
    if (selectedGroupId) {
      const group = groupsOfUser.find((group) => group.id === selectedGroupId);

      if (group && group.dailyIndex !== undefined) {
        const member = group.members[group.dailyIndex];
        setSelectedMember(member?.username || 'No member selected');
      } else {
        setSelectedMember('No member selected');
      }
    }
  }, [selectedGroupId, groupsOfUser]);

  const viewUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user'); 
      if (user !== null) {
        Alert.alert('User Data', user);
      } else {
        Alert.alert('No User Data Found');
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      Alert.alert('Error', 'Failed to retrieve user data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IS {selectedMember} BEING A</Text>
      <Text style={styles.mainText}>BITCH</Text>
      <Text style={styles.subtitle}>TODAY</Text>
      <BitchButton />

      <Button color={"white"} onPress={deleteUserId} title="delete some shit"></Button>
      <Button color="white" onPress={viewUserData} title="View stored data" />

     
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
