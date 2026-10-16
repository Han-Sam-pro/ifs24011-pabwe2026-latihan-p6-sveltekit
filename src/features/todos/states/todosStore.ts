import { writable } from "svelte/store";
import todoApi, { type Todo } from "../api/todoApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export interface TodosState {
  todos: Todo[];
  todo: Todo | null;
  isTodo: boolean;
  isTodoAdd: boolean;
  isTodoAdded: boolean;
  isTodoChange: boolean;
  isTodoChanged: boolean;
  isTodoChangeCover: boolean;
  isTodoChangedCover: boolean;
  isTodoDelete: boolean;
  isTodoDeleted: boolean;
}

function createTodosStore() {
  const initial: TodosState = {
    todos: [],
    todo: null,
    isTodo: false,
    isTodoAdd: false,
    isTodoAdded: false,
    isTodoChange: false,
    isTodoChanged: false,
    isTodoChangeCover: false,
    isTodoChangedCover: false,
    isTodoDelete: false,
    isTodoDeleted: false,
  };

  let currentState: TodosState = { ...initial };
  const innerStore = writable<TodosState>(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  return {
    subscribe: innerStore.subscribe,
    get todos() {
      return currentState.todos;
    },
    get todo() {
      return currentState.todo;
    },
    get isTodo() {
      return currentState.isTodo;
    },
    get isTodoAdd() {
      return currentState.isTodoAdd;
    },
    get isTodoAdded() {
      return currentState.isTodoAdded;
    },
    get isTodoChange() {
      return currentState.isTodoChange;
    },
    get isTodoChanged() {
      return currentState.isTodoChanged;
    },
    get isTodoChangeCover() {
      return currentState.isTodoChangeCover;
    },
    get isTodoChangedCover() {
      return currentState.isTodoChangedCover;
    },
    get isTodoDelete() {
      return currentState.isTodoDelete;
    },
    get isTodoDeleted() {
      return currentState.isTodoDeleted;
    },
    get $state() {
      return currentState;
    },
    reset(state: Partial<TodosState> = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setTodos(todos: Todo[]) {
      innerStore.update((s) => ({ ...s, todos }));
    },
    setTodo(todo: Todo | null) {
      innerStore.update((s) => ({ ...s, todo }));
    },
    setIsTodo(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodo: status }));
    },
    setIsTodoAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoAdd: status }));
    },
    setIsTodoAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoAdded: status }));
    },
    setIsTodoChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChange: status }));
    },
    setIsTodoChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChanged: status }));
    },
    setIsChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChangeCover: status }));
    },
    setIsChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChangedCover: status }));
    },
    setIsTodoChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChangeCover: status }));
    },
    setIsTodoChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoChangedCover: status }));
    },
    setIsTodoDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoDelete: status }));
    },
    setIsTodoDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isTodoDeleted: status }));
    },
    async asyncSetTodos(is_finished: string | number = "") {
      try {
        const todos = await todoApi.getTodos(is_finished);
        this.setTodos(todos);
      } catch {
        this.setTodos([]);
      }
    },
    async asyncSetTodo(todoId: string | number) {
      try {
        const todo = await todoApi.getTodoById(todoId);
        this.setTodo(todo);
      } catch {
        this.setTodo(null);
      } finally {
        this.setIsTodo(true);
      }
    },
    async asyncSetIsTodoAdd(title: string, description: string) {
      try {
        await todoApi.postTodo(title, description);
        showSuccessDialog("Todo berhasil ditambahkan!");
        this.setIsTodoAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsTodoAdded(false);
      } finally {
        this.setIsTodoAdd(true);
      }
    },
    async asyncSetIsTodoChange(todoId: string | number, title: string, description: string, is_finished: boolean | number) {
      try {
        const message = await todoApi.putTodo(todoId, title, description, is_finished);
        showSuccessDialog(message || "Todo berhasil diubah!");
        this.setIsTodoChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsTodoChanged(false);
      } finally {
        this.setIsTodoChange(true);
      }
    },
    async asyncSetIsTodoChangeCover(todoId: string | number, cover: File) {
      try {
        const message = await todoApi.postTodoCover(todoId, cover);
        showSuccessDialog(message || "Cover todo berhasil diubah!");
        this.setIsTodoChangedCover(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsTodoChangedCover(false);
      } finally {
        this.setIsTodoChangeCover(true);
      }
    },
    async asyncSetIsTodoDelete(todoId: string | number) {
      try {
        const message = await todoApi.deleteTodo(todoId);
        showSuccessDialog(message || "Todo berhasil dihapus!");
        this.setIsTodoDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsTodoDeleted(false);
      } finally {
        this.setIsTodoDelete(true);
      }
    },
  };
}

export const todosStore = createTodosStore();
export const useTodosStore = () => todosStore;
export default todosStore;
