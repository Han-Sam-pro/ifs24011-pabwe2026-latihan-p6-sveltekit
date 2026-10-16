<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";
  import { getAccessToken } from "../../../helpers/apiHelper";
  import { refreshProfile } from "../../users/states/usersStore";

  let { children } = $props();
  let isSidebarOpen = $state(false);

  onMount(() => {
    if (!getAccessToken()) {
      goto("/auth/login");
      return;
    }
    refreshProfile().catch(() => goto("/auth/login"));
  });
</script>

<div class="min-h-screen">
  <Navbar onToggleSidebar={() => (isSidebarOpen = !isSidebarOpen)} />
  <Sidebar isOpen={isSidebarOpen} onClose={() => (isSidebarOpen = false)} />

  <main class="p-4 sm:p-6 lg:pl-72">
    {@render children()}
  </main>
</div>
