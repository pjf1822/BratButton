import { create } from 'zustand';
import { voteYes } from './api';

export interface User {
  id: string;
  username: string;
}
export interface Group {
  id: string;
  groupName: string;
  members: User[];
  dailyIndex?: number;
  lastUpdated?: string;
  votesYes: string[];
}

export interface NewGroupFormProps {
  setModalVisible: (visible: boolean) => void;
}

interface StoreState {
  loading: boolean;
  setLoading: (loading: boolean) => void;

  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;

  selectedGroup: string | undefined;
  setSelectedGroup: (groupId: string | undefined) => void;

  userData: User | null;
  setUserData: (data: User) => void;

  addVoteYes: (groupId: string, member: User) => Promise<void>;
}

export const useGroupStore = create<StoreState>((set) => ({
  loading: true,
  setLoading: (loading) => set({ loading }),

  userData: null,
  setUserData: (data: User) => {
    set({ userData: data });
  },
  groupsOfUser: [],
  setGroupsOfUser: (groups: Group[]) => {
    set({ groupsOfUser: groups });
  },
  selectedGroup: undefined,
  setSelectedGroup: (groupId: string | undefined) => {
    set({ selectedGroup: groupId });
  },

  addVoteYes: async (groupId: string, member: User) => {
    try {
      await voteYes(groupId, member);

      set((state) => {
        const updatedGroups = state.groupsOfUser.map((group) => {
          if (group.id === groupId) {
            if (!group.votesYes.includes(member.id)) {
              const updatedGroup = {
                ...group,
                votesYes: [...group.votesYes, member.id]
              };

              return updatedGroup;
            }
          }
          return group;
        });

        return { groupsOfUser: updatedGroups };
      });
    } catch (error) {
      console.error('Error adding vote:', error);
    }
  }
}));
