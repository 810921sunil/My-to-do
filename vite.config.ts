import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function removeCrossorigin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html: string) {
      return html.replace(/crossorigin/g, '');
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), removeCrossorigin()],
  build: {
    modulePreload: false,
    target: 'es2015',
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
