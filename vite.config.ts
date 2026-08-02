import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 静态站点部署到 GitHub Pages,使用相对路径
  base: './',
});
