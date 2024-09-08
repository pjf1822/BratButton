import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react'
import { myColors } from '@/theme';


type MyButtonProps = {
    onPress: () => void;
    label: string;
  };
  const MyButton: React.FC<MyButtonProps> = ({ onPress, label }) => {
    return (
    <TouchableOpacity onPress={onPress} style={{backgroundColor:myColors.four, alignSelf:"center", padding: Platform.isPad ? 14 : 10, borderRadius:14, borderWidth:3, borderColor:myColors.one,marginTop:10, shadowColor: '#000',  
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 6, 
    width:"100%",

    
}}>
    <Text style={{ fontFamily: 'KalMedium',
color: myColors.one,
fontSize:Platform.isPad ? 36: 26,
fontWeight: '200',
textAlign:"center"}}>{label}</Text>
  </TouchableOpacity>
  )
}

export default MyButton