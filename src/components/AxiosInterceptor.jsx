// File: src/components/AxiosInterceptor.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

// Track if we're already showing the session expired alert
let isShowingAlert = false;

const AxiosInterceptor = ({ children }) => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	useEffect(() => {
		const responseInterceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				const { config, response } = error;
				const originalRequestUrl = config.url;

				// Handle 401 errors (except from login endpoint)
				if (
					response &&
					response.status === 401 &&
					originalRequestUrl !== "/api/auth/login" &&
					!isShowingAlert // Prevent multiple alerts
				) {
					isShowingAlert = true;
					logout();

					Swal.fire({
						title: "Sesi Kedaluwarsa",
						text: "Sesi Anda telah berakhir. Silakan login kembali.",
						icon: "warning",
						confirmButtonText: "Login",
					}).then(() => {
						isShowingAlert = false;
						navigate("/login");
					});
				}

				// Handle 429 (Too Many Requests)
				if (response && response.status === 429) {
					Swal.fire({
						title: "Terlalu Banyak Permintaan",
						text: response.data?.message || "Silakan tunggu beberapa saat sebelum mencoba lagi.",
						icon: "warning",
						confirmButtonText: "OK",
					});
				}

				// Selalu kembalikan error agar bisa ditangani oleh komponen pemanggil
				return Promise.reject(error);
			}
		);

		// Cleanup interceptor saat komponen unmount
		return () => {
			axios.interceptors.response.eject(responseInterceptor);
		};
	}, [navigate, logout]);

	return children;
};

export default AxiosInterceptor;
