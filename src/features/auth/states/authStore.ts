import { derived, writable } from "svelte/store";
import { getAccessToken, putAccessToken, removeAccessToken } from "../../../helpers/apiHelper";
import * as authApi from "../api/authApi";

export type AuthUser = {
  id?: number;
  name?: string;
  email?: string;
  photo?: string | null;
  created_at?: string;
};

export const authStore = writable({
  token: typeof localStorage === "undefined" ? null : getAccessToken(),
  user: null as AuthUser | null,
  isLogin: false,
});

export const isAuthenticated = derived(authStore, ($auth) => Boolean($auth.token));

export async function login(email: string, password: string) {
  const { user, token } = await authApi.login(email, password);

  putAccessToken(token);
  authStore.set({ token, user, isLogin: true });

  return user;
}

export async function register(payload: { name: string; email: string; password: string }) {
  return authApi.register(payload);
}

/** Selalu membersihkan sesi lokal, meskipun permintaan logout ke server gagal. */
export async function logout() {
  try {
    await authApi.logout();
  } finally {
    removeAccessToken();
    authStore.set({ token: null, user: null, isLogin: false });
  }
}
