import { StyleSheet,  Text, View , KeyboardAvoidingView, Platform,Image} from 'react-native';
import {  useState } from 'react';
import * as Linking from 'expo-linking'; 
import { useGroupStore } from '@/zustandStore';
import { Picker } from '@react-native-picker/picker'; 
import NewGroupForm from '@/components/NewGroupForm';
import QRCodeModal from '@/components/QRCodeModal';
import { myColors } from '@/theme';
import MyButton from '@/components/MyComponents/MyButton';




export default function TabGroupScreen() {
  const { groupsOfUser, selectedGroup, setSelectedGroup,invited } = useGroupStore((state) => ({
    groupsOfUser: state.groupsOfUser,
    selectedGroup: state.selectedGroup,
    setSelectedGroup: state.setSelectedGroup,
    invited:state.invited
  }));  

  const [modalVisible, setModalVisible] = useState(false);

  const redirectUrl = Linking.createURL('/inviteLandingPage', {
    queryParams: { groupInviteId: selectedGroup?.id, invitedBool: "true" , groupInviteName: selectedGroup?.groupName  }
  });


  const handlePickerChange = (itemValue: string) => {
    const selectedGroup = groupsOfUser.find(group => group.id === itemValue);
    if (selectedGroup) {
      setSelectedGroup(selectedGroup);
    }
  };
  




  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
    <QRCodeModal selectedGroup={selectedGroup} redirectUrl={redirectUrl} modalVisible={modalVisible}setModalVisible={setModalVisible} />
    <Image
      source={require('../../assets/bar-purple.jpg')} 
      style={{ 
        width: Platform.isPad ?  340 : 200,
        height: Platform.isPad ?  340 : 200, 
        objectFit: "contain", 
        marginTop:40
        // position: "absolute",
        // top:0
      }} 
    />

      <View style={{ width: "100%",position:"relative" ,flex:1,justifyContent: groupsOfUser.length > 0 ? "space-around" :"center"}}>
        <NewGroupForm groupsOfUser={groupsOfUser} setModalVisible={setModalVisible} />

     {groupsOfUser.length > 0 && (
      <View style={{width: Platform.isPad ? "59%":"66%",alignSelf:"center",marginBottom:40}}>
        
        <Text style={{ color: myColors.four, textAlign: 'center',fontFamily:"KalMedium",fontSize:Platform.isPad ? 40:30 }}>
          Your Groups
        </Text>
        <Picker
          selectedValue={selectedGroup?.id}
          onValueChange={handlePickerChange}
          itemStyle={{ textAlign: 'center',fontFamily:"KalMedium",fontSize:25}}
          style={{ display: selectedGroup ? "flex" : "none" ,maxHeight:100,justifyContent:"center",overflow:"hidden",marginTop:10,marginBottom:10}}

          >
          {groupsOfUser.map((group) => (
            <Picker.Item
            key={group.id}
            color={myColors.three}
            label={group.groupName}
            value={group.id}
            />

          ))}
        </Picker>
 
        <MyButton onPress={() => setModalVisible(true)} label={`Invite someone to ${selectedGroup?.groupName}`} />
      </View>
      )}
    
   
    </View>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:myColors.one,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width:"100%"
  },
  title: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 30,
    fontWeight: '100',
  },
  mainText: {
    fontFamily: 'KalThin',
    color: myColors.five,
    fontSize: 100,
    fontWeight: '100',
  },
  subtitle: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 30,
    fontWeight: '100',
  },
  createGroupText: {
    color: myColors.five,
    fontSize: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: myColors.three,
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  qrCodeSection: {
  // paddingTop:100,
  // paddingBottom:100,
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
});
