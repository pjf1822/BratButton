import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import React from 'react';
import QRCode from 'react-native-qrcode-svg';
import { myColors } from '@/theme';
import * as Clipboard from 'expo-clipboard';

import logo from '../assets/brat.jpg';
import { Group } from '@/zustandStore';
import { showToast } from '@/utils';

interface QRCodeModalProps {
  selectedGroup?: string;
  redirectUrl: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  groupsOfUser: Group[];
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  selectedGroup,
  redirectUrl,
  modalVisible,
  setModalVisible,
  groupsOfUser
}) => {
  const handleCopyLink = () => {
    Clipboard.setStringAsync(redirectUrl);
    showToast('Invite link copied to clipboard!', true, 'top');
  };

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
        onLongPress={handleCopyLink} // Correctly pass the function here
        activeOpacity={1}
      >
        <View style={styles.modalContent}>
          <QRCode
            value={redirectUrl}
            size={Platform.isPad ? 800 : 350}
            enableLinearGradient
            linearGradient={[myColors.two, myColors.four]}
            logo={logo}
            logoSize={Platform.isPad ? 150 : 80}
          />
          <Text
            style={{
              color: myColors.one,
              fontSize: 28,
              fontFamily: 'KalMedium',
              width: '100%',
              textAlign: 'center',
              marginTop: 15
            }}
          >
            Join The {''}
            {groupsOfUser.find((group) => group.id === selectedGroup)
              ?.groupName || 'Unknown'}{' '}
            Group
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default QRCodeModal;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modalContent: {
    backgroundColor: myColors.four,
    padding: 25,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 23,
    marginBottom: 10
  }
});
