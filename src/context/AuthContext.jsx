// File: src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BirthdayModal from "../components/BirthdayModal";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
	const navigate = useNavigate();

	// Ganti fungsi lama Anda dengan yang ini di dalam AuthContext.jsx

	const checkBirthday = (userData) => {
		// 1. Cek apakah pengguna adalah member dan memiliki tanggal lahir
		if (userData?.role === "member" && userData.date_of_birth) {
			const today = new Date();
			today.setHours(0, 0, 0, 0); // Normalisasi waktu hari ini untuk perbandingan yang akurat

			const birthDate = new Date(userData.date_of_birth);
			// Atur tahun ulang tahun ke tahun ini untuk perbandingan
			const birthdayThisYear = new Date(
				today.getFullYear(),
				birthDate.getMonth(),
				birthDate.getDate()
			);

			// 2. Hitung selisih hari antara hari ini dan ulang tahun
			const timeDiff = today.getTime() - birthdayThisYear.getTime();
			const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

			// 3. Cek apakah ulang tahun terjadi hari ini atau dalam 6 hari terakhir (total rentang 7 hari)
			if (dayDiff >= 0 && dayDiff < 7) {
				// 4. Buat kunci unik untuk localStorage berdasarkan ID user dan tahun ini
				// Contoh: 'birthdayShown_c3e2b1a0..._2025'
				const storageKey = `birthdayShown_${
					userData.id
				}_${today.getFullYear()}`;

				// 5. Hanya tampilkan modal jika belum pernah ditampilkan di tahun ini
				if (!localStorage.getItem(storageKey)) {
					setIsBirthdayModalOpen(true);
					localStorage.setItem(storageKey, "true");
				}
			}
		}
	};

	const login = async (credentials) => {
		const response = await axios.post("/api/auth/login.php", credentials);
		setUser(response.data.user);
		checkBirthday(response.data.user); // <-- 4. Cek ulang tahun saat login berhasil
		return response.data;
	};

	// useEffect untuk verifikasi sesi (tidak berubah)
	useEffect(() => {
		const verifySession = async () => {
			try {
				const response = await axios.get("/api/auth/check-auth.php");
				setUser(response.data.user);
				checkBirthday(response.data.user);
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		verifySession();
	}, []);

	const logout = async () => {
		try {
			await axios.post("/api/auth/logout.php");
		} finally {
			setUser(null);
			sessionStorage.removeItem("birthdayShown");
			navigate("/login");
		}
	};

	const authContextValue = { user, loading, login, logout };

	return (
		<AuthContext.Provider value={authContextValue}>
			<BirthdayModal
				isOpen={isBirthdayModalOpen}
				onClose={() => setIsBirthdayModalOpen(false)}
				userName={user?.full_name}
			/>
			{!loading && children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
