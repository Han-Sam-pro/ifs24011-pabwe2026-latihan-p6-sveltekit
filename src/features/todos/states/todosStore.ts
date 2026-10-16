import { derived, get, writable } from "svelte/store";
import * as todoApi from "../api/todoApi";

export type TodoItem = {
  id: number;
  title: string;
  description?: string;
  cover?: string | null;
  is_finished?: number;
  created_at?: string;
  author?: { name?: string; photo?: string | null };
};

export const todos = writable<TodoItem[]>([]);
export const selectedTodo = writable<TodoItem | null>(null);
export const showOnlyMine = writable(false);
export const searchQuery = writable("");

/** Bendera mutasi: true selama permintaan tulis sedang berjalan. */
export const mutations = writable({
  isAdding: false,
  isChanging: false,
  isChangingCover: false,
  isDeleting: false,
  isDeletingAll: false,
});

/** Mencocokkan judul, deskripsi, dan nama pemilik tanpa membedakan huruf besar-kecil. */
export function filterTodos(list: TodoItem[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return list;

  return list.filter((todo) =>
    [todo.title, todo.description, todo.author?.name].some((value) =>
      (value ?? "").toLowerCase().includes(keyword)
    )
  );
}

export const visibleTodos = derived([todos, searchQuery], ([$todos, $searchQuery]) =>
  filterTodos($todos, $searchQuery)
);

export const todoStats = derived(todos, ($todos) => ({
  total: $todos.length,
  finished: $todos.filter((todo) => Boolean(todo.is_finished)).length,
  unfinished: $todos.filter((todo) => !todo.is_finished).length,
}));

async function withMutation<T>(flag: keyof typeof mutations extends never ? string : string, action: () => Promise<T>) {
  mutations.update((state) => ({ ...state, [flag]: true }));
  try {
    return await action();
  } finally {
    mutations.update((state) => ({ ...state, [flag]: false }));
  }
}

export async function loadTodos() {
  todos.set(await todoApi.getTodos(get(showOnlyMine)));
}

export async function setShowOnlyMine(value: boolean) {
  showOnlyMine.set(value);
  await loadTodos();
}

export async function loadTodo(todoId: string | number) {
  selectedTodo.set(await todoApi.getTodo(todoId));
}

async function refreshTodo(todoId: string | number) {
  await loadTodo(todoId);
  await loadTodos();
}

export function createTodo(payload: { title: string; description: string }) {
  return withMutation("isAdding", async () => {
    const todoId = await todoApi.createTodo(payload);
    await loadTodos();
    return todoId;
  });
}

export function updateTodo(
  todoId: string | number,
  payload: { title: string; description: string; is_finished: number }
) {
  return withMutation("isChanging", async () => {
    await todoApi.updateTodo(todoId, payload);
    await refreshTodo(todoId);
  });
}

export function changeCover(todoId: string | number, file: File) {
  return withMutation("isChangingCover", async () => {
    await todoApi.updateTodoCover(todoId, file);
    await refreshTodo(todoId);
  });
}

export function removeTodo(todoId: string | number) {
  return withMutation("isDeleting", async () => {
    await todoApi.deleteTodo(todoId);
    selectedTodo.set(null);
    await loadTodos();
  });
}

export function removeAllTodos() {
  return withMutation("isDeletingAll", async () => {
    await todoApi.deleteAllTodos();
    selectedTodo.set(null);
    await loadTodos();
  });
}
