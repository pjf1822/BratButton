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
        />

        <Button
          title="Create Group"
          color={'white'}
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