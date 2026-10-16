<script lang="ts">
  import Modal from "./Modal.svelte";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
  import { updateTodo, type TodoItem } from "../states/todosStore";

  let { todo, onClose }: { todo: TodoItem; onClose: () => void } = $props();

  // svelte-ignore state_referenced_locally
  const title = useInput(todo.title);
  // svelte-ignore state_referenced_locally
  let description = $state(todo.description ?? "");
  let isSaving = $state(false);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    isSaving = true;

    try {
      await updateTodo(todo.id, {
        title: $title,
        description,
        is_finished: todo.is_finished ? 1 : 0,
      });
      await showSuccessDialog("Tugas berhasil diubah.");
      onClose();
    } catch (error) {
      await showErrorDialog(error.message);
    } finally {
      isSaving = false;
    }
  }
</script>

<Modal title="Ubah Tugas" {onClose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <div>
      <label for="change-title" class="mb-1 block text-sm font-medium text-slate-700">Judul</label>
      <input
        id="change-title"
        type="text"
        required
        class="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        bind:value={$title}
      />
    </div>

    <div>
      <p class="mb-1 block text-sm font-medium text-slate-700">Deskripsi</p>
      <MarkdownEditor bind:value={description} />
    </div>

    <div class="flex justify-end gap-2">
      <button type="button" class="rounded-lg px-4 py-2 font-medium text-slate-700 hover:bg-slate-100" onclick={onClose}>
        Batal
      </button>
      <button
        type="submit"
        disabled={isSaving}
        class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isSaving ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  </form>
</Modal>
