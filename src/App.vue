<template>
  <component :is="currentLayout">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { ref, watch, markRaw } from 'vue';
import { useRoute } from 'vue-router';

// Importe TODOS os layouts que você irá utilizar dinamicamente
import AuthLayout from './layouts/AuthLayout/index.vue';
import DefaultLayout from './layouts/DefaultLayout/index.vue';
// Importe outros layouts se tiver

// Defina a união de tipos para incluir todos os layouts possíveis
type Component = typeof AuthLayout | typeof DefaultLayout; // <-- Ajuste aqui para incluir todos

const route = useRoute();
// Inicialize com um layout padrão que faça sentido para a rota inicial ou um fallback seguro
// Por exemplo, AuthLayout para a rota inicial de login, ou um layout vazio
const currentLayout = ref<Component>(markRaw(AuthLayout)); // Pode ser ajustado conforme a lógica de inicialização

watch(
  () => route.meta.layout,
  (newLayoutName: string | undefined) => { // Tipagem para o nome do layout
    const layoutMap: Record<string, Component> = {
      AuthLayout: markRaw(AuthLayout),
      DefaultLayout: markRaw(DefaultLayout), // <-- Adicione este mapeamento
      // Adicione outros mapeamentos aqui
    };
    // Use o novo nome do layout ou um fallback seguro (ex: AuthLayout ou um layout de erro)
    currentLayout.value = layoutMap[newLayoutName || 'AuthLayout'] || markRaw(AuthLayout);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Seus estilos aqui, se houver */
</style>