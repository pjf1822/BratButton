import { StyleSheet,  Text, View ,  Button, Alert, ActivityIndicator, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BitchButton from '@/components/BitchButton';
import { User, useGroupStore } from '@/zustandStore';

export default function TabOneScreen() {

  const {  selectedGroup, groupsOfUser ,userData} = useGroupStore((state) => ({
    selectedGroup: state.selectedGroup,
    groupsOfUser: state.groupsOfUser,
    userData: state.userData
  })); 




  const deleteUserId = async () => {
    await AsyncStorage.removeItem('user');
  };



  const viewUserData = async () => {
    try {
      const user = await AsyncStorage.getItem('user'); 
      if (user !== null) {
        Alert.alert('User Data', user);
      } else {
        Alert.alert('No User Data Found');
      }
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      Alert.alert('Error', 'Failed to retrieve user data');
    }
  };
  const renderItem = ({ item }: { item: User }) => (
    <Text  style={{color:"white"}}>{item.username}</Text>
  );

  return (
    <View style={styles.container}>
    
 
        {groupsOfUser.length === 0 ? (
          <Text style={styles.noGroupsText}>Hey,create or  join a group!</Text>
        ) : selectedGroup && selectedGroup.selectedMember.username ? (
          <>
         {selectedGroup && (
          <FlatList
            data={selectedGroup?.votesYes}
            renderItem={renderItem}
            keyExtractor={(item) =>{
              console.log(item)
              return(item?.id)}
              }
          />
        )}
             
                <Text>{selectedGroup.groupName}</Text>
            <Text style={styles.title}>IS {selectedGroup.selectedMember.username} BEING A</Text>
            <Text style={styles.mainText}>BITCH</Text>
            <Text style={styles.subtitle}>TODAY</Text>
          </>
        ) : (
          <ActivityIndicator size="large" color="white" />
        )}
  
        {userData &&  <BitchButton  userData={userData} selectedGroupId={selectedGroup?.id}/>}
       
  
        {/* delete these */}
        <Button color="white" onPress={deleteUserId} title="Delete some shit" />
        <Button color="white" onPress={viewUserData} title="View stored data" />

  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop:300
  },
  title: {
    fontFamily: 'Kalthin',
    color: 'red',
    fontSize: 30,
    fontWeight: '100',
  },
  mainText: {
    fontFamily: 'Kalthin',
    color: 'red',
    fontSize: 100,
    fontWeight: '100',
  },
  subtitle: {
    fontFamily: 'Kalthin',
    color: 'red',
    fontSize: 30,
    fontWeight: '100',
  },
  createGroupText: {
    color: 'black',
    fontSize: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
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
  noGroupsText:{
    fontFamily: 'Kal',
    color: 'red',
    fontSize: 40,
    fontWeight: '100',
    textAlign:"center"
  },
  voteText: {
    fontFamily: 'Kalthin',
    color: 'white',
    fontSize: 20,
    marginVertical: 5,
  },
});

