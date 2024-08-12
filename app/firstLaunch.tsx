import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser } from '@/api';
import { router,Stack } from 'expo-router';

const firstLaunch = () => {
    const [username, setUsername] = useState('');

    const addUserName= async() => {
        const newUserId = Math.floor(Math.random() * 1000000).toString();
        const userData = { userId: newUserId, username };

        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await createUser(userData, newUserId);
        router.replace('/(tabs)');

    }

  return (
    <>
      <Stack.Screen options={{headerShown:false }} />
      <View style={{backgroundColor:"purple",flex:1,justifyContent:"center",alignContent:"center"}}>
        <Text style={styles.label}>Enter Your Username</Text>
      <Text style={styles.mainText}>BITCH</Text>

        <TextInput
          style={styles.input}
          placeholder="username"
          value={username}
          placeholderTextColor={"red"}
          onChangeText={setUsername}

        />
        <TouchableOpacity onPress={addUserName}>
          <Text style={styles.label}>Add user name</Text>
        </TouchableOpacity>
      </View>
    </>
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
      fontFamily: 'Kal',
      color: 'red',
      fontSize: 100,
      fontWeight: '100',
      alignItems:"center",
      textAlign:"center"
    },
    label: {
      fontFamily: 'Kal',
      color: 'red',
      fontSize: 30,
      fontWeight: '200',
      textAlign:"center"
      
    },
    input: {
      height: 40,
      borderColor: 'red',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      
    },
  });