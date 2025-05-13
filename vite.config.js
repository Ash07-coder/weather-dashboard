import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/weather-dashboard/', // <- This is the key addition
  plugins: [react()],
})