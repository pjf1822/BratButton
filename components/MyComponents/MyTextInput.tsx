import {  TextInput, StyleSheet,  Platform } from 'react-native';
import React from 'react'
import { myColors } from '@/theme';

type MyTextInputProps = {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
  } 

  const MyTextInput: React.FC<MyTextInputProps> = ({
    placeholder,
    value,
    onChangeText,

  }) => {  return (
     <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          placeholderTextColor={"rgba(255,255,255,0.5)"}
          onChangeText={onChangeText}
          
        />
  )
}

export default MyTextInput

const styles = StyleSheet.create({
     input: {
      borderColor: myColors.four,
      borderWidth: 3,
      marginBottom: 20,
      padding:8,
      fontFamily: 'KalMedium',
      alignSelf:"center",
      borderRadius:10,
      color:myColors.four,
      width:"100%",
      fontSize:Platform.isPad ? 37: 25,
    },
})