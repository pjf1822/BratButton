import {create }from 'zustand';

export interface Group {
  id: string;
  groupName: string
  members:string[]
}

interface StoreState {
  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;
}

export const useGroupStore = create<StoreState>((set) => ({
  groupsOfUser: [],
  setGroupsOfUser: (groups: Group[]) => {
    set({ groupsOfUser: groups });
    console.log('Updated groupsOfUser:', groups); 
  },}));