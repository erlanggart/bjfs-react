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
				// Use localhost for local development (without Docker)
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
