// @ts-check
import { defineConfig } from 'astro/config';
// import sitemap from '@astrojs/sitemap';
import solid from "@solidjs/vite-plugin";
// https://astro.build/config
export default defineConfig({
	//site: 'https://benevolarx.github.io',
	integrations: [/*sitemap(),*/ solid({
		devtools: true
	})],
	outDir: 'docs'
});
