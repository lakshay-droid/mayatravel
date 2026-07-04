/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|react-router-dom)/,
              priority: 40,
            },
            {
              name: 'supabase',
              test: /node_modules[\\/]@supabase/,
              priority: 30,
            },
            {
              name: 'leaflet',
              test: /node_modules[\\/]leaflet/,
              priority: 25,
            },
            {
              name: 'motion',
              test: /node_modules[\\/]framer-motion/,
              priority: 20,
            },
            {
              name: 'icons',
              test: /node_modules[\\/]lucide-react/,
              priority: 10,
            }
          ]
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
