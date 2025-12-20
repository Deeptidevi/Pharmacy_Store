import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  proxy: {
    '/admin_register': 'https://pharmacy-store-backend.onrender.com',
    '/admin_login': 'https://pharmacy-store-backend.onrender.com',
    '/add_medicine': 'https://pharmacy-store-backend.onrender.com',
    '/get_medicines': 'https://pharmacy-store-backend.onrender.com',
    '/update_medicine': 'https://pharmacy-store-backend.onrender.com',
    '/delete_medicine': 'https://pharmacy-store-backend.onrender.com',
    '/customer_register': 'https://pharmacy-store-backend.onrender.com',
    '/customer_login': 'https://pharmacy-store-backend.onrender.com',
    '/place_order': 'https://pharmacy-store-backend.onrender.com',
    '/get_orders': 'https://pharmacy-store-backend.onrender.com'
    
  }
});
