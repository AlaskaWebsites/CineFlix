<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from './layouts/AuthLayout/index.vue';

const route = useRoute();
const currentLayout = ref('AuthLayout');

// Watch route changes to update layout
watch(
  () => route.meta.layout,
  (newLayout) => {
    currentLayout.value = newLayout || 'AuthLayout';
  },
  { immediate: true }
);
</script>