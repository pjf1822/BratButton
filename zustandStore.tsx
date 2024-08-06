import {create }from 'zustand';

interface Group {
  id: string;
}

interface StoreState {
  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;
}

export const useGroupStore = create<StoreState>((set) => ({
  groupsOfUser: [],
  setGroupsOfUser: (groups: Group[]) => set({ groupsOfUser: groups }),
}));