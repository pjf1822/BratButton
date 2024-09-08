import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '@/api';
import { router} from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import MyTextInput from '@/components/MyComponents/MyTextInput';
import MyButton from '@/components/MyComponents/MyButton';

const firstLaunch = () => {
    const [username, setUsername] = useState('');
    const { setUserData,invited } = useGroupStore(); 


    const addUserName= async() => {
        const newUserId = Math.floor(Math.random() * 1000000).toString();
        const userData = { id: newUserId, username };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUserData(userData);
        await createUser(userData);
        if(invited){
          router.replace('/inviteLandingPage');
        } else{
          router.replace('/groups');
        }
        

    }

  return (

<KeyboardAvoidingView style={{backgroundColor:myColors.one,flex:1,justifyContent:"center",alignContent:"center"}} behavior='height'>
         
        <Text style={styles.label}>Enter Your Username</Text>
        <Text style={styles.mainText}>BRAT</Text>
        <View style={{width:"80%",alignSelf:"center"}}> 
          <MyTextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
         />
          <MyButton onPress={addUserName}  label="Add user name"/>
        </View>
     
      </KeyboardAvoidingView>
  
  )
}

export default firstLaunch;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    mainText: {
      fontFamily: 'KalBold',
      color: myColors.four,
      fontSize:Platform.isPad ? 120: 100,
      fontWeight: '100',
      alignItems:"center",
      textAlign:"center",
      paddingBottom:20
    },
    label: {
      fontFamily: 'KalRegular',
      color: myColors.four,
      fontSize:Platform.isPad ? 50: 33,
      textAlign:"center"
    },
   
  });