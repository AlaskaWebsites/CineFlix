<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { ref, watch, markRaw } from 'vue';
import { useRoute, type RouteMeta } from 'vue-router'; // Importe 'type RouteMeta' para melhor tipagem

// Importe TODOS os layouts que você irá utilizar dinamicamente
import Auth from './layouts/Auth/index.vue';
import Default from './layouts/Default/index.vue';
// Importe outros layouts se tiver

// Defina a união de tipos para incluir todos os layouts possíveis
type Component = typeof Auth | typeof Default;

const route = useRoute();

const currentLayout = ref<Component>(markRaw(Auth));

watch(
  () => route.meta.layout as string | undefined, // <-- Ajuste aqui: forçar a tipagem
  (newLayoutName) => { // 'newLayoutName' agora será inferido corretamente como string | undefined
    const layoutMap: Record<string, Component> = {
      Auth: markRaw(Auth),
      Default: markRaw(Default),
      // Adicione outros mapeamentos aqui
    };
    currentLayout.value = layoutMap[newLayoutName || 'Auth'] || markRaw(Auth);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Seus estilos aqui, se houver */
</style>