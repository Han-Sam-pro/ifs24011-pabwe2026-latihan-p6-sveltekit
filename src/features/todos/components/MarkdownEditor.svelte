<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Editor from "@toast-ui/editor";
  import "@toast-ui/editor/dist/toastui-editor.css";

  let {
    value = $bindable(""),
    placeholder = "Tulis deskripsi tugas...",
    label = "Deskripsi",
  }: {
    value?: string;
    placeholder?: string;
    label?: string;
  } = $props();

  let container: HTMLDivElement | undefined;
  let editor: Editor | null = null;
  let observer: MutationObserver | null = null;

  function patchAccessibility() {
    if (!container) return;
    container.querySelectorAll("textarea").forEach((el) => el.setAttribute("aria-label", label));
    container.querySelectorAll(".toastui-editor-tabs").forEach((el) => el.setAttribute("role", "tablist"));
    container.querySelectorAll(".more").forEach((el) => el.setAttribute("aria-label", "Menu lainnya"));
    container.querySelectorAll("[aria-role]").forEach((el) => {
      el.removeAttribute("aria-role");
      if (el.hasAttribute("aria-selected")) el.setAttribute("role", "tab");
    });
  }

  onMount(() => {
    editor = new Editor({
      el: container,
      initialValue: value,
      initialEditType: "markdown",
      previewStyle: "tab",
      height: "260px",
      placeholder,
      usageStatistics: false,
      events: {
        change: () => {
          const next = editor?.getMarkdown() ?? "";
          if (next !== value) value = next;
        },
      },
    });
    patchAccessibility();
    observer = new MutationObserver(patchAccessibility);
    observer.observe(container, { childList: true, subtree: true });
    patchAccessibility();
  });

  $effect(() => {
    if (editor && value !== editor.getMarkdown()) {
      editor.setMarkdown(value, false);
    }
  });

  onDestroy(() => {
    observer?.disconnect();
    editor?.destroy();
    editor = null;
  });
</script>

<div bind:this={container} data-testid="markdown-editor"></div>
