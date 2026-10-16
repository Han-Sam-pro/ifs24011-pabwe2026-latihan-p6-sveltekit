<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { authStore } from "../states/authStore";
  import { refreshProfile } from "../../users/states/usersStore";
  import { getAccessToken } from "../../../helpers/apiHelper";

  onMount(() => {
    const token = getAccessToken();
    if (token && !$authStore.user) {
      refreshProfile().catch(() => {});
    }
  });

  $effect(() => {
    const { token, isLogin, user } = $authStore;
    if (token && isLogin && user) {
      goto("/");
    }
  });
</script>
