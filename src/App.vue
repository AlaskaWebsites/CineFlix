<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentLayout: any = ref('AuthLayout');
watch(
  () => route.meta.layout,
  (newLayout) => {
    currentLayout.value = newLayout || 'AuthLayout';
  },
  { immediate: true }
);
</script>