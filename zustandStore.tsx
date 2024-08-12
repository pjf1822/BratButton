import {create }from 'zustand';

export interface Member {
  id: string; // User ID
  username: string; // Username
}
export interface Group {
  id: string;
  groupName: string
  members: Member[];
}

interface StoreState {
  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;
  selectedGroupId: string | undefined;
  setSelectedGroupId: (id: string | undefined) => void;
}

export const useGroupStore = create<StoreState>((set) => ({
  groupsOfUser: [],
    selectedGroupId: undefined,

  setGroupsOfUser: (groups: Group[]) => {
    set({ groupsOfUser: groups });
  },
  setSelectedGroupId: (id: string | undefined) => set({ selectedGroupId: id }),
  }
  ));