<script lang="ts">
  let { children } = $props();
</script>

<main class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Delcom Todo</h1>
      <p class="text-sm text-slate-500 mt-1">Catat dan selesaikan tugasmu setiap hari</p>
    </div>
    {@render children()}
  </div>
</main>
