import adapter from '@sveltejs/adapter-cloudflare';
import { defineWebConfig } from '@kleinbem/web-config/vite';

export default defineWebConfig({
	adapter: adapter()
});
