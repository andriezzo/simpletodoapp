// filepath: astro.config.mjs
import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Add this 'base' property
  base: '/simpletodoapp',

  integrations: [react()]
});