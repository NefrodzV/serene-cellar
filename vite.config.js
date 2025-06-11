import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5273,
    allowedHosts: true
  },
});
