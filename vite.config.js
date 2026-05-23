import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, existsSync, writeFileSync } from 'fs';
import { resolve } from 'path';

/** GitHub repo name — must match: https://USERNAME.github.io/REPO_NAME/ */
const REPO_NAME = 'Darsi_Amaresh_Smart_Hospital_Management_System';

export const GITHUB_BASE = `/${REPO_NAME}/`;

function githubPagesPlugin() {
  return {
    name: 'github-pages',
    closeBundle() {
      const dist = resolve(__dirname, 'dist');
      if (!existsSync(dist)) return;
      // SPA fallback for GitHub Pages (direct /dashboard URLs)
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
      // Disable Jekyll processing on GitHub Pages
      const nojekyll = resolve(dist, '.nojekyll');
      if (existsSync(resolve(__dirname, 'public/.nojekyll'))) {
        copyFileSync(resolve(__dirname, 'public/.nojekyll'), nojekyll);
      } else {
        writeFileSync(nojekyll, '');
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), githubPagesPlugin()],
  base: GITHUB_BASE,
});
