import {create }from 'zustand';

export interface User {
  id: string; 
  username: string; 
}
export interface Group {
  id: string;
  groupName: string
  members: User[];
  dailyIndex?: number; 
  lastUpdated?: string; 
  votesYes: User[];
  selectedMember: User
}
export interface NewGroupFormProps {
  groupsOfUser: Group[];
}


interface StoreState {
  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;
  selectedGroup: Group | undefined;
  setSelectedGroup: (group: Group | undefined) => void;
  userData: User | null;
  setUserData: (data: User) => void;
  addVoteYes: (groupId: string, member: User) => void;  

}

export const useGroupStore = create<StoreState>((set) => ({
  userData: null,
  groupsOfUser: [],
  selectedGroup: undefined,

  setGroupsOfUser: (groups: Group[]) => {
    set({ groupsOfUser: groups });
  },

  setSelectedGroup: (group: Group | undefined) => {
    set({ selectedGroup: group });
  },
  setUserData: (data: User) => {
    set({ userData: data });
  },
  addVoteYes: (groupId: string, member: User) => {
    set((state) => {
      const updatedGroups = state.groupsOfUser.map((group) => {
        if (group.id === groupId) {
          // Check if member is already in votesYes
          if (!group.votesYes.find(vote => vote.id === member.id)) {
            return {
              ...group,
              votesYes: [...group.votesYes, member],
            };
          }
        }
        return group;
      });
      return { groupsOfUser: updatedGroups };
    });
  },
}));