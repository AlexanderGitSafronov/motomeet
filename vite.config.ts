/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon-64.png', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'MotoMeet — Мотоспільнота',
        short_name: 'MotoMeet',
        description:
          'Знайди свою команду. Катай разом. Райдери зустрічаються на живій карті, відкривають події, прокладають маршрути, вступають у клуби та спілкуються.',
        lang: 'uk',
        theme_color: '#0F172A',
        background_color: '#0F172A',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['social', 'travel', 'navigation', 'lifestyle'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          { name: 'Жива карта', short_name: 'Карта', url: '/map' },
          { name: 'Події', short_name: 'Події', url: '/events' },
          { name: 'Повідомлення', short_name: 'Чати', url: '/chats' },
        ],
      },
      workbox: {
        // Precache only the lightweight app shell + icons; ride photos are
        // runtime-cached on first view to keep the service worker lean.
        globPatterns: ['**/*.{js,css,html,woff2}', 'favicon-64.png', 'pwa-*.png', 'apple-touch-icon.png'],
        globIgnores: ['**/img/**', '**/icon-source.svg', '**/favicon.svg'],
        maximumFileSizeToCacheInBytes: 3_000_000,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith('/img/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'ride-photos',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.host.includes('basemaps.cartocdn.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.host.includes('fonts.gstatic.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  // For local dev against the live backend, run with
  //   VITE_API_URL=https://motomeet-xi.vercel.app npm run dev
  // (otherwise the app runs in offline demo mode). Production uses same-origin /api.
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: false,
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
})
