import { apiFetch } from "../../../helpers/apiHelper";

export async function register({ name, email, password }: { name: string; email: string; password: string }) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}

/** Mengembalikan { user, token } dari respons login. */
export async function login(email: string, password: string) {
  const json = await apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  return json.data;
}

export async function logout() {
  return apiFetch("/auth/logout", { method: "POST" });
}
