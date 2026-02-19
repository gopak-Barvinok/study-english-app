import { create } from 'zustand';
import { DatabaseUser } from '@/types/databaseTypes';
import { fetchGet, fetchPost } from '@/utils/utils';

interface UserStore {
    user: DatabaseUser | null;
    loadUser: (userId: string) => Promise<void>;
    updateUser: (data: Partial<DatabaseUser>) => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    loadUser: async (userId: string) => {
        try {
            const userData = await fetchGet("/api/user-params", {
                'X-User-Id': userId,
            });
            set({ user: userData });
        } catch (e) {
            console.error("Load user error:", e);
        }
    },
    updateUser: async (data) => {
        const userId = get().user?.id;
        console.log("User id in update:", userId);
        if (!userId) return;
        console.log("Data:", data);
        set((state) => ({
            user: state.user ? { ...state.user, ...data } : null,
        }));

        const newBody = {
            id: userId,
            params: data,
        }
        
        try {
            const resp = await fetchPost("/api/user-params", newBody);
            if (resp.status !== 200) {
                await get().loadUser(userId);
            }
        } catch (e) {

        }
    }
}));

interface RoomStore {
    room: string | null;
    setRoom: (room: string | null) => void;
};

export const useRoomStore = create<RoomStore>((set) => ({
    room: null,
    setRoom: (room) => set({ room }),
}));