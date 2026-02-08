import { create } from 'zustand';
import { User } from '@/types/user';

interface UserStore {
    user: User | null;
    setUser: (user: User | null) => void;
    updateUser: (data: Partial<User>) => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    updateUser: (data) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...data } : null
        })),
}));

interface RoomStore {
    room: string | null;
    setRoom: (room: string | null) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
    room: null,
    setRoom: (room) => set({ room }),
}))