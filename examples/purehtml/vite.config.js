import { defineConfig } from 'vite';

// `vite preview` serves build.outDir; point it at the example root so the pure-HTML entry is
// served verbatim — no build step, no dev-client injection into the HTML.
export default defineConfig({
  build: { outDir: '.', emptyOutDir: false },
});
