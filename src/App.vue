<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { ref, watch, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import AuthLayout from './layouts/AuthLayout/index.vue';

type Component = typeof AuthLayout;

const route = useRoute();
const currentLayout = ref<Component>(markRaw(AuthLayout));

watch(
  () => route.meta.layout,
  (newLayout: any) => {
    const layoutMap: Record<string, Component> = {
      AuthLayout: markRaw(AuthLayout)
    };
    currentLayout.value = layoutMap[newLayout] || markRaw(AuthLayout);
  },
  { immediate: true }
);
</script>