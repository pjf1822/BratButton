import {create }from 'zustand';

export interface Member {
  id: string; 
  username: string; 
}
export interface Group {
  id: string;
  groupName: string
  members: Member[];
  dailyIndex?: number; 
  lastUpdated?: string; 
}
export interface NewGroupFormProps {
  groupsOfUser: Group[];
}

interface UserData {
  userId: string;
  username: string;
}


interface StoreState {
  groupsOfUser: Group[];
  setGroupsOfUser: (groups: Group[]) => void;
  selectedGroup: Group | undefined;
  setSelectedGroup: (group: Group | undefined) => void;
  userData: UserData | null;
  setUserData: (data: UserData) => void;
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
  setUserData: (data: UserData) => {
    set({ userData: data });
  },
}));