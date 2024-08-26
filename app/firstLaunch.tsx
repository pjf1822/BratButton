import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '@/api';
import { router,Stack } from 'expo-router';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';

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
          router.replace('/(tabs)');
        }

    }

  return (

<KeyboardAvoidingView style={{backgroundColor:myColors.one,flex:1,justifyContent:"center",alignContent:"center"}} behavior='height'>
         
        <Text style={styles.label}>Enter Your Username</Text>
      <Text style={styles.mainText}>BRAT</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          placeholderTextColor={"rgba(255,255,255,0.5)"}
          onChangeText={setUsername}
          
        />
              <TouchableOpacity onPress={addUserName} style={{backgroundColor:myColors.four,maxWidth:"70%", alignSelf:"center", padding:10, borderRadius:14, borderWidth:3, borderColor:myColors.one,marginTop:50, shadowColor: '#000',  
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.4, 
          shadowRadius: 6, 
          
      }}>
          <Text style={{ fontFamily: 'KalMedium',
      color: myColors.one,
      fontSize: 26,
      fontWeight: '200',
      textAlign:"center"}}>Add user name</Text>
        </TouchableOpacity>
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
      fontSize: 100,
      fontWeight: '100',
      alignItems:"center",
      textAlign:"center",
      paddingBottom:20
    },
    label: {
      fontFamily: 'KalRegular',
      color: myColors.four,
      fontSize: 33,
      textAlign:"center"
    },
    input: {
      borderColor: myColors.four,
      borderWidth: 3,
      marginBottom: 20,
      padding:8,
      fontFamily: 'KalMedium',
      width:"80%",
      alignSelf:"center",
      borderRadius:10,
      color:myColors.four,
      fontSize:25
    },
  });