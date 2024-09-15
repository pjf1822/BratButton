import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { myColors } from '@/theme';
import { Group, User } from '@/zustandStore';

interface TallyCompProps {
  selectedGroup: string;
  groupsOfUser: Group[];
}
const TallyComp: React.FC<TallyCompProps> = ({
  selectedGroup,
  groupsOfUser
}) => {
  const [group, setGroup] = useState<Group | undefined>(undefined);

  useEffect(() => {
    const foundGroup = groupsOfUser.find((group) => group.id === selectedGroup);
    setGroup(foundGroup);
  }, [selectedGroup, groupsOfUser]);

  const getTallyGroups = () => {
    if (!group || !group.votesYes) return [];

    const tallyMarks = group.votesYes.length;
    const groups = [];

    for (let i = 0; i < tallyMarks; i += 5) {
      groups.push(group.votesYes.slice(i, i + 5));
    }

    return groups;
  };

  const renderItem = ({ item }: { item: User }) => (
    <Text style={{ color: 'black' }}>{item?.username}</Text>
  );

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
    <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
      {renderTallyGroups()}
    </View>
  );
};

export default TallyComp;

const styles = StyleSheet.create({
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

  voteText: {
    fontFamily: 'KalBold',
    color: myColors.five,
    fontSize: 20,
    marginVertical: 5
  }
});
