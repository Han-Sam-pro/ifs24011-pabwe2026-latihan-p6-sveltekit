import { writable } from "svelte/store";
import { authStore } from "../../auth/states/authStore";
import * as usersApi from "../api/usersApi";

export const users = writable([]);

export async function loadUsers() {
  users.set(await usersApi.getUsers());
}

/** Mengambil profil terbaru dan menyimpannya ke authStore tanpa mereset isLogin. */
export async function refreshProfile() {
  const user = await usersApi.getMe();
  authStore.update((state) => ({ ...state, user, isLogin: true }));
  return user;
}

export async function updateProfile(payload: { name: string; email: string }) {
  await usersApi.updateMe(payload);
  await refreshProfile();
}

export async function changePassword(payload: {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  return usersApi.updatePassword(payload);
}

export async function changePhoto(file: File) {
  await usersApi.updatePhoto(file);
  await refreshProfile();
}
