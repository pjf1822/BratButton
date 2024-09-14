import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import BitchButton from '@/components/BitchButton';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';

import { deleteUserId, viewUserData } from '@/utils';
import TallyComp from '@/components/TallyComp';
import { useEffect } from 'react';

export default function TabOneScreen() {
  const { selectedGroup, groupsOfUser, userData } = useGroupStore((state) => ({
    selectedGroup: state.selectedGroup,
    groupsOfUser: state.groupsOfUser,
    userData: state.userData
  }));

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
          }}
        >
          {groupsOfUser.length === 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.noGroupsText}>
                Hey, create or join a group first!
              </Text>
            </View>
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.title}>
                Is{' '}
                <Text style={{ fontFamily: 'KalBold' }}>
                  {
                    selectedGroup?.members[selectedGroup?.dailyIndex || 0]
                      .username
                  }
                </Text>{' '}
                Being A
              </Text>
            </View>
          )}

          <BitchButton
            userData={userData}
            selectedGroupId={selectedGroup?.id}
          />

          {groupsOfUser?.length > 0 && <Text style={styles.title}>Today</Text>}
        </View>

        {selectedGroup && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 60
            }}
          >
            <Text style={[styles.subtitle, { fontFamily: 'KalSemiBold' }]}>
              {selectedGroup?.groupName}
            </Text>
            <Text style={styles.subtitle}>Today's Brat Tally:</Text>
            <TallyComp
              selectedGroup={selectedGroup}
              groupsOfUser={groupsOfUser}
            />
          </View>
        )}

        {/* delete these */}
        <Button color="white" onPress={deleteUserId} title="Delete some shit" />

        <Button color="white" onPress={viewUserData} title="View stored data" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: myColors.three,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  title: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: Platform.isPad ? 50 : 29,
    fontWeight: '100'
  },
  tallyContainer: {
    position: 'relative',
    width: 50,
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 20
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
    borderRadius: 100
  },
  tallyMark: {
    height: 30,
    width: 4,
    backgroundColor: myColors.one,
    borderRadius: 100,
    marginLeft: 5
  },
  mainText: {
    fontFamily: 'KalRegular',
    color: myColors.five,
    fontSize: 100,
    fontWeight: '100'
  },
  subtitle: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: Platform.isPad ? 40 : 29,
    fontWeight: '100'
  },
  createGroupText: {
    color: myColors.five,
    fontSize: 40
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    color: myColors.five
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10
  },
  noGroupsText: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 33,
    textAlign: 'center',
    paddingBottom: 70
  },
  voteText: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 20,
    marginVertical: 5
  }
});
