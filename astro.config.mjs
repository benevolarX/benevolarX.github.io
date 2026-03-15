// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import solid from '@astrojs/solid-js';

export default defineConfig({
	site: 'https://benevolarx.github.io',
	integrations: [sitemap(), solid({
		devtools: true
	})],
	outDir: 'docs'
});

