import { View, Text } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { myColors } from '@/theme';

interface NoInternetModalProps {
  connectedToInternet: boolean;
  setConnectedToInternet: (connected: boolean) => void;
}

const NoInternetModal: React.FC<NoInternetModalProps> = ({
  connectedToInternet,
  setConnectedToInternet
}) => {
  // const handleModalClose = () => {
  //   setConnectedToInternet(true);
  // };
  return (
    <Modal isVisible={!connectedToInternet} onBackdropPress={() => {}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: myColors.three,
          padding: 20,
          borderRadius: 10
        }}
      >
        <Text
          style={{ fontSize: 18, marginBottom: 40, fontFamily: 'KalMedium' }}
        >
          You are not connected to the internet.Please check your connection and
          refresh the app/rescan the QR code
        </Text>
      </View>
    </Modal>
  );
};

export default NoInternetModal;
