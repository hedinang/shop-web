import { create } from "zustand";

export const useSideBarStore = create((set) => ({
  isSelectedConversation: false,
  isAuction: false,
  isCart: false,
  isProfileDetail: false,
  isUser: true,
  isNotification: false,
  isMenuSideBar: false,

  isAdminSettingUserOptions: true,
  isAdminSettingUser: false,

  setIsMenuSideBar: (value) => set((state) => ({ isMenuSideBar: value })),

  setIsSelectedConversation: (value) =>
    set((state) => ({ isSelectedConversation: value })),

  switchIsAuction: (value) =>
    set((state) => ({
      isAuction: state.isAuction === value ? value : !state.isAuction,
    })),

  switchIsProfileDetail: () =>
    set((state) => ({ isProfileDetail: !state.isProfileDetail })),

  switchIsUser: () =>
    set((state) => ({ isUser: !state.isUser })),

  switchIsCart: () =>
    set((state) => ({ isCart: !state.isCart })),

  setIsNotification: (value) => set((state) => ({ isNotification: value })),
}));
