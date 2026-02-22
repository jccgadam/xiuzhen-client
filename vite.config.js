import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true, // 监听 0.0.0.0，端口转发时外网可访问
    allowedHosts: true, // 允许任意 Host（端口转发/反向代理时避免被拒绝）
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        timeout: 30000
      }
    }
  }
})
