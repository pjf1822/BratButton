import { StyleSheet,  Text, View , TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react'
import QRCode from 'react-native-qrcode-svg';
import { myColors } from '@/theme';

import logo from '../assets/brat.jpg';


interface QRCodeModalProps {
    selectedGroup?: { groupName?: string }; 
    redirectUrl: string;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
  }
  
  const QRCodeModal: React.FC<QRCodeModalProps> = ({
    selectedGroup,
    redirectUrl,
    modalVisible,
    setModalVisible,
  }) => {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(false);
    }}
  >
    <TouchableOpacity
      onPress={() => setModalVisible(false)}
      style={styles.modalContainer}
    >
        <View style={styles.modalContent}>
          <QRCode
            value={redirectUrl}
            size={350}
            enableLinearGradient
            linearGradient={[myColors.two,myColors.four]}
            logo={logo}
            logoSize={80}


          />
        <Text style={{ color: myColors.one, fontSize: 28,fontFamily:'KalMedium',width:"100%",textAlign:"center" ,marginTop:15}}>
            Join The {''}
            {selectedGroup?.groupName || 'Unknown'}{' '}

            Group
          </Text>
        </View>
    </TouchableOpacity>
  </Modal>

  )
}

export default QRCodeModal
const styles = StyleSheet.create({
   
   
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
      backgroundColor: myColors.four,
      padding: 25,
      borderRadius: 10,
      width: '100%',
      alignItems: 'center',
      
    },
    modalTitle: {
      fontSize: 23,
      marginBottom: 10,
    },
   
  });