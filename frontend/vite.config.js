import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.svg', 'logo.png'],
      manifest: {
        name: 'Htein Lin Thar Realestate',
        short_name: 'HTL Realestate',
        description: 'Elite Real Estate Management System',
        theme_color: '#6366f1',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        display: 'standalone',
        background_color: '#0f172a'
      }
    })
  ],
})
