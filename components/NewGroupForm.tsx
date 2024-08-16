import { StyleSheet,  Text, View , TextInput, Button, } from 'react-native';
import React, { useState } from 'react'
import { handleCreateGroup } from '@/utils';
import { NewGroupFormProps } from '@/zustandStore';


  
  const NewGroupForm: React.FC<NewGroupFormProps> = ({ groupsOfUser }) => {
    const [newGroupName, setNewGroupName] = useState('');

  return (
    <View style={{ width:"100%"}}> 

        <Text style={styles.modalTitle}>Enter New Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholderTextColor={"red"}
        />

        <Button
          title="Create Group"
          color={'red'}
          onPress={() => handleCreateGroup(newGroupName,groupsOfUser)}
        />
</View>
  )
}

export default NewGroupForm
const styles = StyleSheet.create({
  
  
   
   
    modalTitle: {
      fontSize: 20,
      marginBottom: 10,
      fontFamily: 'KalThin',
      color: 'red',
      fontWeight: '100',
      textAlign:"center"
    },
    input: {
      height: 40,
      borderColor: 'red',
      borderRadius:10,
      borderWidth: 1,
      marginBottom: 20,
      width: '100%',
      paddingHorizontal: 10,
    },
  });