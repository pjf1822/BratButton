import { StyleSheet,  Text, View ,  Button, Alert, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BitchButton from '@/components/BitchButton';
import { User, useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';
import { useEffect } from 'react';

export default function TabOneScreen() {

  const {  selectedGroup, groupsOfUser ,userData} = useGroupStore((state) => ({
    selectedGroup: state.selectedGroup,
    groupsOfUser: state.groupsOfUser,
    userData: state.userData
  })); 




  const deleteUserId = async () => {
    await AsyncStorage.removeItem('user');
  };


  useEffect(() => {
      getTallyGroups()
  },[selectedGroup])

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
    <Text  style={{color:"black"}}>{item?.username}</Text>
  );


  const getTallyGroups = () => {
    if (!selectedGroup || !selectedGroup.votesYes) return [];
    
    const tallyMarks = selectedGroup.votesYes.length;
    const groups = [];


    for (let i = 0; i < tallyMarks; i += 5) {
      groups.push(selectedGroup.votesYes.slice(i, i + 5));
    }

    return groups;
  };




  const renderTallyGroups = () => {
    const tallyGroups = getTallyGroups();
    return tallyGroups.map((group, index) => (
      <View key={index} style={[styles.tallyContainer]}>
      {group.map((_, idx) => (
          <View key={idx} style={styles.tallyMark}></View>
        ))}
        {group.length === 5 && <View style={styles.diagonalTallyMark}></View>}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={{ display:"flex",
    justifyContent: 'center',
    alignItems: 'center',
  

    flex: 1,}}>

      {groupsOfUser.length === 0 ? (
                  <View style={{ justifyContent: "center", alignItems: "center" }}>

        <Text style={styles.noGroupsText}>Hey, create or join a group first!</Text>
        </View>

      ) : selectedGroup && selectedGroup.selectedMember.username ? (
        <>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={styles.title}>Is <Text style={{fontFamily:"KalBold"}}>{selectedGroup.selectedMember.username}</Text> Being A</Text>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" color="white" />
      )}
  
      {userData && <BitchButton userData={userData} selectedGroupId={selectedGroup?.id} />}
      
      {groupsOfUser.length > 0 && ( <Text style={styles.title}>Today</Text>)}
     
      </View>
  
      {selectedGroup && (
        <View style={{ display: "flex", justifyContent: "center", alignItems: "center",marginBottom:60}}>
          <Text style={styles.subtitle}>{selectedGroup?.groupName}</Text>
          <Text style={styles.subtitle}>Today's Brat Tally:</Text>
          <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
            {renderTallyGroups()}
          </View>
        </View>
      )}
  
      {/* delete these */}
      {/* <Button color="white" onPress={deleteUserId} title="Delete some shit" />
      <Button color="white" onPress={viewUserData} title="View stored data" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.three,
    display:"flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 30,
    fontWeight: '100',
  },
  tallyContainer: {
    position: 'relative',
    width:50,
    display:"flex",flexDirection:"row",
    marginLeft:20,
  },
  diagonalTallyMark: {
    position: 'absolute',
    height: 65,
    width: 4,
    backgroundColor: myColors.five,
    transform: [{ rotate: '-70deg' }],
    left: 23,
    top: -18, 
    zIndex: 1, 
    borderRadius:100

  },
  tallyMark: {
    height: 30,
    width: 4,
    backgroundColor: myColors.one,
    borderRadius:100,
    marginLeft:5
  },
  mainText: {
    fontFamily: 'KalRegular',
    color: myColors.five,
    fontSize: 100,
    fontWeight: '100',
  },
  subtitle: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 29,
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
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: myColors.five,

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
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 33,
    textAlign:"center",
    paddingBottom:70,

    
  },
  voteText: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 20,
    marginVertical: 5,
  },
});

