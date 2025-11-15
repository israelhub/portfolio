import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '6222ef73376c.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  }
})
