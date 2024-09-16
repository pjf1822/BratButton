import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { myColors } from '@/theme';
import { Group } from '@/zustandStore';
import { Platform } from 'react-native';

interface GroupPickerProps {
  selectedGroup: string;
  groupsOfUser: Group[];
  setSelectedGroup: (groupId: string) => void;
}
const GroupPicker: React.FC<GroupPickerProps> = ({
  selectedGroup,
  groupsOfUser,
  setSelectedGroup
}) => {
  return (
    <Picker
      selectedValue={selectedGroup}
      onValueChange={(itemValue: string) => setSelectedGroup(itemValue)}
      itemStyle={{
        textAlign: 'center',
        fontFamily: 'KalMedium',
        fontSize: Platform.isPad ? 35 : 25
      }}
      style={{
        display: selectedGroup ? 'flex' : 'none',
        maxHeight: 80,
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 10
      }}
    >
      {groupsOfUser?.map((group) => (
        <Picker.Item
          key={group?.id}
          color={myColors.three}
          label={group.groupName}
          value={group?.id}
        />
      ))}
    </Picker>
  );
};

export default GroupPicker;
