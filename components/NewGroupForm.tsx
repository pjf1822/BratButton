import { StyleSheet,  Text, View , TextInput, TouchableOpacity, Keyboard } from 'react-native';
import React, { useState } from 'react'
import { handleCreateGroup } from '@/utils';
import { NewGroupFormProps } from '@/zustandStore';
import { myColors } from '@/theme';


  
  const NewGroupForm: React.FC<NewGroupFormProps> = ({ groupsOfUser }) => {
    const [newGroupName, setNewGroupName] = useState('');

  return (
    <View style={{ width:groupsOfUser.length > 0 ?"60%": "90%",alignSelf:"center",marginBottom:  groupsOfUser.length > 0 ? 40: 0}}> 

        <Text style={styles.modalTitle}>Enter New Group Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Group Name"
          value={newGroupName}
          onChangeText={setNewGroupName}
          placeholderTextColor={"rgba(255,255,255,0.5)"}
        />

<TouchableOpacity
  onPress={() => handleCreateGroup(newGroupName, groupsOfUser,setNewGroupName)}
  style={{backgroundColor:myColors.five, alignSelf:"center", padding:5, borderRadius:14, borderWidth:3, borderColor:myColors.three, shadowColor: '#000',  width:"100%",
  shadowOffset: { width: 0, height: 4 }, 
  shadowOpacity: 0.4, 
  shadowRadius: 6, 
  
  }}
>
  <Text style={{ color: myColors.three, fontSize: 22,fontFamily:'KalRegular',width:"100%",textAlign:"center" }}>Create Group</Text>
</TouchableOpacity>
</View>
  )
}

export default NewGroupForm
const styles = StyleSheet.create({
  
  
   
   
    modalTitle: {
      fontSize: 28,
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