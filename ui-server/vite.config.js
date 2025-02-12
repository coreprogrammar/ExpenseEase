import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
  server: {
    host: '0.0.0.0', // Allows external access from Docker
    port: 5173,      // Ensures it's using the correct port
    strictPort: true // Ensures it fails if the port is unavailable
  }
})
