import { apiFetch } from "../../../helpers/apiHelper";

/** Mengambil daftar todo. isMe true hanya mengembalikan milik pengguna yang login. */
export async function getTodos(isMe = false) {
  const json = await apiFetch("/todos", { query: { is_me: isMe ? 1 : null } });
  return json.data.todos;
}

export async function getTodo(todoId: string | number) {
  const json = await apiFetch(`/todos/${todoId}`);
  return json.data.todo;
}

/** Membuat todo dan mengembalikan id-nya. */
export async function createTodo({ title, description }: { title: string; description: string }) {
  const json = await apiFetch("/todos", {
    method: "POST",
    body: { title, description },
  });
  return json.data.todo_id;
}

export async function updateTodo(
  todoId: string | number,
  { title, description, is_finished }: { title: string; description: string; is_finished: number }
) {
  return apiFetch(`/todos/${todoId}`, {
    method: "PUT",
    body: { title, description, is_finished },
  });
}

/** Mengunggah atau mengganti cover dengan multipart/form-data. */
export async function updateTodoCover(todoId: string | number, file: File) {
  const formData = new FormData();
  formData.append("cover", file);

  return apiFetch(`/todos/${todoId}/cover`, {
    method: "POST",
    formData,
  });
}

export async function deleteTodo(todoId: string | number) {
  return apiFetch(`/todos/${todoId}`, { method: "DELETE" });
}

export async function deleteAllTodos() {
  return apiFetch("/todos", { method: "DELETE" });
}
