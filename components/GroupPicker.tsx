import React from 'react';
import { Picker } from '@react-native-picker/picker';
import { myColors } from '@/theme';
import { Group } from '@/zustandStore';

interface GroupPickerProps {
  selectedGroup: Group | null;
  groupsOfUser: Group[];
  setSelectedGroup: (group: Group) => void;
}
const GroupPicker: React.FC<GroupPickerProps> = ({
  selectedGroup,
  groupsOfUser,
  setSelectedGroup
}) => {
  const handlePickerChange = (itemValue: string) => {
    const selectedGroup = groupsOfUser.find((group) => group.id === itemValue);
    if (selectedGroup) {
      setSelectedGroup(selectedGroup);
    }
  };
  return (
    <Picker
      selectedValue={selectedGroup?.id}
      onValueChange={handlePickerChange}
      itemStyle={{
        textAlign: 'center',
        fontFamily: 'KalMedium',
        fontSize: 25
      }}
      style={{
        display: selectedGroup ? 'flex' : 'none',
        maxHeight: 100,
        justifyContent: 'center',
        overflow: 'hidden',
        marginTop: 10,
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
