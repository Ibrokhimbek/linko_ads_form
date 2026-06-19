import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev paytida frontend (5173) -> backend (3001) ga /api so'rovlarini uzatadi.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // tarmoqqa ochadi (telefon shu WiFi orqali kira oladi)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
