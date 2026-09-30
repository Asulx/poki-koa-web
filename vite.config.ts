import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

<<<<<<< HEAD

=======
>>>>>>> rama-temporal
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
<<<<<<< HEAD
      '@': path.resolve(__dirname, './src'),
    },
  },
})

=======
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
>>>>>>> rama-temporal
