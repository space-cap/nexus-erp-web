<script setup lang="ts">
const { message, visible } = useToast()
</script>

<template>
  <div v-if="visible" class="toast">{{ message }}</div>
</template>
