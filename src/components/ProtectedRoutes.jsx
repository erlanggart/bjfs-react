// File: src/components/ProtectedRoutes.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
	// Ambil juga state 'loading' dari context
	const { user, loading } = useAuth();

	// 1. Saat aplikasi sedang memverifikasi sesi (misal: setelah refresh),
	//    tampilkan loading indicator atau null agar tidak terjadi redirect prematur.
	if (loading) {
		// Anda bisa mengganti ini dengan komponen spinner atau loading screen yang lebih bagus
		return (
			<div
				className="flex items-center justify-center h-screen"
				style={{ backgroundColor: "#293252" }}
			>
				<p className="text-white">Memverifikasi sesi...</p>
			</div>
		);
	}

	// 2. Setelah proses loading selesai, baru lakukan pengecekan user.
	//    Jika tidak ada user, baru arahkan ke halaman login.
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// 3. Cek apakah peran pengguna diizinkan untuk mengakses rute ini.
	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// Jika tidak diizinkan, arahkan ke halaman "unauthorized" atau dashboard.
		return <Navigate to="/dashboard" replace />;
	}

	// 4. Jika semua pengecekan lolos, tampilkan konten halaman yang diminta.
	return <Outlet />;
};

export default ProtectedRoute;
