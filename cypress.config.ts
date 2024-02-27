import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9000/',
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
});
