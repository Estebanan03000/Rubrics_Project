/* Archivo: Frontend\vite.config.js
   Proposito: Implementa la logica principal del archivo vite.config.
*/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
