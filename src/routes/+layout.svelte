<script lang="ts">
  import type { Snippet } from "svelte";
  import "../index.css";
  import { page } from "$app/state";
  import TodoLayout from "../features/todos/layouts/TodoLayout.svelte";

  let { children }: { children?: Snippet } = $props();
  let isAuthRoute = $derived(page.url.pathname.startsWith("/auth"));
</script>

{#if isAuthRoute}
  {@render children?.()}
{:else}
  <TodoLayout>
    {@render children?.()}
  </TodoLayout>
{/if}
