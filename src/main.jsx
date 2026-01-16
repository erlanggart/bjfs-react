import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios"; // 1. Import axios
// import { HelmetProvider } from "react-helmet-async"; // Temporarily disabled

// 2. KONFIGURASI GLOBAL AXIOS
// Atur agar Axios selalu mengirim cookie di setiap request.
// Ini adalah kunci untuk menyelesaikan masalah refresh.
axios.defaults.withCredentials = true;

// Add interceptor to include token from localStorage
axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		{/* <HelmetProvider> */}
			<App />
		{/* </HelmetProvider> */}
	</StrictMode>
);
