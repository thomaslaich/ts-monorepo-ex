import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
	// optimizeDeps: {
	// 	// esbuildOptions: {
	// 	// 	plugins: [esbuildCommonjs(['@mono-ex/api-contract'])]
	// 	// },
	// 	include: ['@mono-ex/api-contract'] // also here
	// },
	// build: {
	// 	commonjsOptions: {
	// 		// include: [/api-contract/]
	// 		include: [/api-contract/, /node_modules/]
	// 	}
	// }
});
