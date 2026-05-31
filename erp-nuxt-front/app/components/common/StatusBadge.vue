<script setup lang="ts">
import { getStatusClass } from '~/utils/status'

defineProps<{
  status: string
}>()
</script>

<template>
  <span class="status" :class="getStatusClass(status)">{{ status }}</span>
</template>
