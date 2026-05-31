<script setup lang="ts">
import AppToast from '~/components/common/AppToast.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import Topbar from '~/components/layout/Topbar.vue'

const menuOpen = ref(false)
</script>

<template>
  <div class="app-shell">
    <Sidebar :class="{ open: menuOpen }" />
    <main class="main">
      <Topbar @toggle-menu="menuOpen = !menuOpen" />
      <slot />
    </main>
    <AppToast />
  </div>
</template>
