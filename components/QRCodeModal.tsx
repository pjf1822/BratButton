import { StyleSheet,  Text, View , TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react'
import QRCode from 'react-native-qrcode-svg';
import { myColors } from '@/theme';


interface QRCodeModalProps {
    selectedGroup?: { groupName?: string }; // Define the type based on your actual data structure
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
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <QRCode
            value={redirectUrl}
            size={350}
            enableLinearGradient

          />
        <Text style={{ color: myColors.three, fontSize: 25,fontFamily:'KalRegular',width:"100%",textAlign:"center" ,marginTop:20}}>
            Join The {''}
            {selectedGroup?.groupName || 'Unknown'}{' '}

            Group
          </Text>
        </View>
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
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: myColors.four,
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      marginBottom: 10,
    },
   
  });