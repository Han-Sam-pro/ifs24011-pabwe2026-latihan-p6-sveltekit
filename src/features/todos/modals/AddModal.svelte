<script lang="ts">
  import Modal from "./Modal.svelte";
  import MarkdownEditor from "../components/MarkdownEditor.svelte";
  import { useInput } from "../../../hooks/useInput";
  import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
  import { createTodo } from "../states/todosStore";

  let { onClose }: { onClose: () => void } = $props();

  const title = useInput("");
  let description = $state("");

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      await createTodo({ title: $title, description });
      await showSuccessDialog("Tugas berhasil ditambahkan.");
      onClose();
    } catch (error) {
      await showErrorDialog(error.message);
    }
  }
</script>

<Modal title="Tambah Tugas" {onClose}>
  <form class="space-y-4" onsubmit={handleSubmit}>
    <div>
      <label for="add-title" class="mb-1 block text-sm font-medium text-slate-700">Judul</label>
      <input
        id="add-title"
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
      <button type="submit" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700">
        Simpan
      </button>
    </div>
  </form>
</Modal>
