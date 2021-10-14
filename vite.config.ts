import { VITE_SERVER_IP } from './src/utils/config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
export default defineConfig({
  plugins: [vue(),vueJsx()],
  server:{
    host:'127.0.0.1',
    port:8081,
    strictPort: false,
    https: false,
    open: false,
    proxy:{
      '/api': {
        target: VITE_SERVER_IP,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      },
    }
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname, './src')
    }
  },
  build:{
    outDir:'dist'
  }
})