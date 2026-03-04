import { create } from "zustand";
import type { AuthState, User } from "./types";

type AuthStore = AuthState & {
  setAuth: (payload: { token: string; user: User }) => void;
  setUser: (user: User) => void;
  setStatus: (status: AuthState["status"]) => void;
  logout: () => void;
};

const TOKEN_KEY = "i2026_token";
const USER_KEY = "i2026_user";

function loadInitial(): Pick<AuthState, "token" | "user" | "status"> {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  const user = rawUser ? (JSON.parse(rawUser) as User) : null;
  return {
    token: token ?? null,
    user,
    status: token && user ? "authenticated" : "idle",
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  ...loadInitial(),

  setAuth: ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ token, user, status: "authenticated" });
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  setStatus: (status) => set({ status }),

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ token: null, user: null, status: "idle" });
  },
}));
