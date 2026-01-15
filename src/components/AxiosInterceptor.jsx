// File: src/components/AxiosInterceptor.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

const AxiosInterceptor = ({ children }) => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	useEffect(() => {
		const responseInterceptor = axios.interceptors.response.use(
			(response) => response,
			(error) => {
				const { config, response } = error;
				const originalRequestUrl = config.url;

				// PERBAIKAN: Cek jika error adalah 401 DAN BUKAN dari API login
				if (
					response &&
					response.status === 401 &&
					originalRequestUrl !== "/api/auth/login.php"
				) {
					// Hanya jalankan logout dan notifikasi jika error BUKAN dari login
					logout();

					Swal.fire({
						title: "Sesi Kedaluwarsa",
						text: "Sesi Anda telah berakhir. Silakan login kembali.",
						icon: "warning",
						confirmButtonText: "Login",
					}).then(() => {
						navigate("/login");
					});
				}

				// Selalu kembalikan error agar bisa ditangani oleh komponen pemanggil (seperti LoginPage)
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
