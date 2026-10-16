import { apiFetch } from "../../../helpers/apiHelper";

export async function getMe() {
  const json = await apiFetch("/users/me");
  return json.data.user;
}

export async function getUsers() {
  const json = await apiFetch("/users");
  return json.data.users;
}

export async function updateMe({ name, email }: { name: string; email: string }) {
  return apiFetch("/users/me", {
    method: "PUT",
    body: { name, email },
  });
}

export async function updatePassword({
  password,
  newPassword,
  newPasswordConfirm,
}: {
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  return apiFetch("/users/me/password", {
    method: "PUT",
    body: {
      password,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    },
  });
}

export async function updatePhoto(file: File) {
  const formData = new FormData();
  formData.append("photo", file);

  return apiFetch("/users/me/photo", {
    method: "POST",
    formData,
  });
}
