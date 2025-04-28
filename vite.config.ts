import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig(({ }) => {
  // Load env file based on `mode` in the current working directory

  return {
  plugins: [
    react(),
    crx({ 
      manifest,
      contentScripts: {
        injectCss: true
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        index: 'index.html'
      },
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    }
  }
}
})