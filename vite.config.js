import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		host: '0.0.0.0', // Allow external connections (for Docker)
		proxy: {
			// Proxy API requests to backend
			"/api": {
				// Use bogorjunior-backend (Docker container name in same network)
				target: "http://bogorjunior-backend:80",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
