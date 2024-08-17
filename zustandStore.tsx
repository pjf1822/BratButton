import {create }from 'zustand';
import { voteYes } from './api';

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
  invited: boolean;  // Add this line
  setInvited: (invited: boolean) => void;  // Add this line
  inviteParams: {
    groupId?: string;
    invitedParam?: string;
    groupName?: string;
  };
  setInviteParams: (groupId?: string, invitedParam?: string, groupName?: string) => void;
}

export const useGroupStore = create<StoreState>((set) => ({
  userData: null,
  groupsOfUser: [],
  selectedGroup: undefined,

  invited: false,  
  setInvited: (invited) => set({ invited }),
  setGroupsOfUser: (groups: Group[]) => {
    set({ groupsOfUser: groups });
  },

  setSelectedGroup: (group: Group | undefined) => {
    set({ selectedGroup: group });
  },
  setUserData: (data: User) => {
    set({ userData: data });
  },
  addVoteYes: async (groupId: string, member: User) => {
    try {
      await voteYes(groupId, member);
      
      // Update local state
      set((state) => {
        const updatedGroups = state.groupsOfUser.map((group) => {
          if (group.id === groupId) {
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
    } catch (error) {
      console.error('Error adding vote:', error);
    }
  },
  inviteParams: {},
  setInviteParams: (groupId, invitedParam, groupName) => set({
    inviteParams: { groupId, invitedParam, groupName }
  }),
}));