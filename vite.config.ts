// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // Importe o módulo 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  resolve: {
    alias: {
      // Use path.resolve para garantir que os caminhos sejam absolutos e consistentes
      // com o diretório atual (process.cwd())
      '@': path.resolve(__dirname, './src'), // Alias comum para a pasta src
      'components': path.resolve(__dirname, './src/components'),
      'layouts': path.resolve(__dirname, './src/layouts'),
      'services': path.resolve(__dirname, './src/services'),
      'stores': path.resolve(__dirname, './src/stores'),
      'types': path.resolve(__dirname, './src/types'),
      'utils': path.resolve(__dirname, './src/utils'),
      'views': path.resolve(__dirname, './src/views'),
      // Você pode adicionar aliases para sub-pastas específicas se desejar, como:
      // 'atoms': path.resolve(__dirname, './src/components/atoms'),
    },
  },
})