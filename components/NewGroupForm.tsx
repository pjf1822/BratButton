import { StyleSheet,  Text, View , TextInput, TouchableOpacity, Keyboard, Platform } from 'react-native';
import React, { useState } from 'react'
import { handleCreateGroup } from '@/utils';
import { NewGroupFormProps } from '@/zustandStore';
import { myColors } from '@/theme';
import MyButton from './MyComponents/MyButton';
import MyTextInput from './MyComponents/MyTextInput';


  
  const NewGroupForm: React.FC<NewGroupFormProps> = ({ groupsOfUser,setModalVisible }) => {
    const [newGroupName, setNewGroupName] = useState('');

  return (
    <View style={{ width: "90%",alignSelf:"center"}}> 
        <Text style={styles.modalTitle}>Enter New Group Name</Text>
        <MyTextInput
          placeholder="Group Name"
          value={newGroupName}
          onChangeText={setNewGroupName}
        />
        <MyButton  onPress={() => handleCreateGroup(newGroupName, groupsOfUser,setNewGroupName, setModalVisible)} label="Create Group"/>

</View>
  )
}

export default NewGroupForm
const styles = StyleSheet.create({
  
  
   
   
    modalTitle: {
      fontSize: Platform.isPad ? 40 : 28,
      marginBottom: 10,
      fontFamily: 'KalMedium',
      color: myColors.four,
      fontWeight: '100',
      textAlign:"center"
    },
    input: {
      borderColor: myColors.four,
      borderWidth: 3,
      marginBottom: 20,
      padding:5,
      fontFamily: 'KalMedium',
      width:"100%",
      alignSelf:"center",
      borderRadius:10,
      color:myColors.four,
      fontSize:22
    },
  });