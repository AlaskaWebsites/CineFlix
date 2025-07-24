// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// REMOVA esta linha: import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // REMOVA esta linha: tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'services': path.resolve(__dirname, './src/services'),
      'stores': path.resolve(__dirname, './src/stores'),
      'types': path.resolve(__dirname, './src/types'),
      'utils': path.resolve(__dirname, './src/utils'),
      'views': path.resolve(__dirname, './src/views'),
    },
  },
})