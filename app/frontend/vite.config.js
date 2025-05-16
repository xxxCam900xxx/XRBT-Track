import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    tailwindcss(),
  ],
  server: {
    host: true, // allows external access
    hmr: {
      clientPort: 443, // if you're using HTTPS tunnels
    },
    allowedHosts: ['nb-came.blue-elevator.ts.net'],
    watch: {
      usePolling: true,
    },
  },
})
