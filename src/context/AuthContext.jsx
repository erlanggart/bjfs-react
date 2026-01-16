// File: src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BirthdayModal from "../components/BirthdayModal";

const AuthContext = createContext(null);

// Session cache configuration
const SESSION_CACHE_KEY = 'auth_session_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let isCheckingAuth = false; // Prevent multiple simultaneous checks

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState(false);
	const navigate = useNavigate();

	// Session caching helpers
	const getCachedSession = () => {
		try {
			const cached = sessionStorage.getItem(SESSION_CACHE_KEY);
			if (!cached) return null;

			const { user: cachedUser, timestamp } = JSON.parse(cached);
			const now = Date.now();

			// Check if cache is still valid
			if (now - timestamp < CACHE_DURATION) {
				return cachedUser;
			}

			// Cache expired
			sessionStorage.removeItem(SESSION_CACHE_KEY);
			return null;
		} catch {
			return null;
		}
	};

	const setCachedSession = (userData) => {
		try {
			sessionStorage.setItem(
				SESSION_CACHE_KEY,
				JSON.stringify({
					user: userData,
					timestamp: Date.now(),
				})
			);
		} catch (error) {
			console.error('Failed to cache session:', error);
		}
	};

	const clearCachedSession = () => {
		try {
			sessionStorage.removeItem(SESSION_CACHE_KEY);
			sessionStorage.removeItem('birthdayShown');
			localStorage.removeItem('auth_token'); // Clear token too
		} catch (error) {
			console.error('Failed to clear cache:', error);
		}
	};

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
		const response = await axios.post("/api/auth/login", credentials);
		const userData = response.data.user;
		const token = response.data.token;
		
		// Store token in localStorage as fallback
		if (token) {
			localStorage.setItem('auth_token', token);
		}
		
		setUser(userData);
		setCachedSession(userData); // Cache session
		checkBirthday(userData); // <-- 4. Cek ulang tahun saat login berhasil
		return response.data;
	};

	// useEffect untuk verifikasi sesi (optimized with caching)
	useEffect(() => {
		const verifySession = async () => {
			// Prevent multiple simultaneous checks
			if (isCheckingAuth) {
				return;
			}

			// Check cache first
			const cachedUser = getCachedSession();
			if (cachedUser) {
				setUser(cachedUser);
				setLoading(false);
				checkBirthday(cachedUser);
				return;
			}

			// No cache, verify with server
			isCheckingAuth = true;
			try {
				const response = await axios.get("/api/auth/check-auth");
				const userData = response.data.user;
				setUser(userData);
				setCachedSession(userData); // Cache for next time
				checkBirthday(userData);
			} catch (error) {
				// Only clear user if it's actually a 401 (not network error)
				if (error.response?.status === 401) {
					setUser(null);
					clearCachedSession();
				}
			} finally {
				isCheckingAuth = false;
				setLoading(false);
			}
		};
		verifySession();
	}, []);

	const logout = async () => {
		try {
			await axios.post("/api/auth/logout");
		} finally {
			setUser(null);
			clearCachedSession(); // Clear all cached data
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
