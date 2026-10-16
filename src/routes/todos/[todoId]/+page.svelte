<script lang="ts">
  import { page } from "$app/state";
  import DetailPage from "../../../features/todos/pages/DetailPage.svelte";

  let todoId = $derived(page.params.todoId);
</script>

<DetailPage {todoId} />
