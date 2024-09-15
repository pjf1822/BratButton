import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import BitchButton from '@/components/BitchButton';
import { useGroupStore } from '@/zustandStore';
import { myColors } from '@/theme';

import { deleteUserId, viewUserData } from '@/utils';
import TallyComp from '@/components/TallyComp';

export default function TabOneScreen() {
  const { selectedGroup, groupsOfUser, userData } = useGroupStore((state) => ({
    selectedGroup: state.selectedGroup,
    groupsOfUser: state.groupsOfUser,
    userData: state.userData
  }));

  console.log('inthe index pag eis loaded');

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
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {groupsOfUser.length === 0 ? (
              <Text style={styles.noGroupsText}>
                Hey, create or join a group first!
              </Text>
            ) : (
              (() => {
                const group = groupsOfUser.find(
                  (group) => group?.id === selectedGroup
                );
                const memberUsername =
                  group?.members[group?.dailyIndex || 0]?.username;

                return (
                  <Text style={styles.title}>
                    Is{' '}
                    <Text style={{ fontFamily: 'KalBold' }}>
                      {memberUsername || 'Unknown'}
                    </Text>{' '}
                    Being A
                  </Text>
                );
              })()
            )}
          </View>

          <BitchButton
            userData={userData || { id: '', username: 'Guest' }}
            selectedGroupId={selectedGroup}
          />

          {groupsOfUser?.length > 0 && <Text style={styles.title}>Today</Text>}
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 60
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 60
            }}
          >
            {selectedGroup ? (
              (() => {
                const group = groupsOfUser.find(
                  (group) => group?.id === selectedGroup
                );

                return group ? (
                  <>
                    <Text
                      style={[styles.subtitle, { fontFamily: 'KalSemiBold' }]}
                    >
                      {group?.groupName || 'No Group Name'}
                    </Text>
                    <Text style={styles.subtitle}>Today's Brat Tally:</Text>
                    <TallyComp
                      selectedGroup={group?.id}
                      groupsOfUser={groupsOfUser}
                    />
                  </>
                ) : (
                  <Text style={styles.subtitle}>Group not found</Text>
                );
              })()
            ) : (
              <Text style={styles.subtitle}>No group selected</Text>
            )}
          </View>
        </View>

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

  subtitle: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: Platform.isPad ? 40 : 29,
    fontWeight: '100'
  },
  noGroupsText: {
    fontFamily: 'KalMedium',
    color: myColors.one,
    fontSize: 33,
    textAlign: 'center',
    paddingBottom: 70
  }
});
