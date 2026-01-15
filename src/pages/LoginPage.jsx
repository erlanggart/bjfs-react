// File: src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import ikon

// URL logo yang Anda unggah. Anda bisa menggantinya dengan path lokal jika mau.
const logoUrl = "/bjfs_logo.svg"; // Ganti dengan URL logo yang sesuai

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await login({ username, password });
			navigate("/portal");
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				setError(err.response.data.message);
			} else {
				setError("Gagal terhubung ke server. Pastikan backend berjalan.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="flex items-center justify-center min-h-screen p-4"
			style={{ backgroundColor: "#1A2347" }} // Warna biru tua dari logo
		>
			<div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
				{/* Logo Section */}
				<div className="flex flex-col items-center justify-center">
					<img
						src={logoUrl}
						alt="Logo BJFS"
						className="w-48 h-auto rounded-lg"
					/>
					<p className="font-semibold italic text-yellow-100 text-sm">
						Makin Berani Tiap Weekend
					</p>
				</div>

				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-100">Selamat Datang</h2>
					<p className="text-gray-300">Masuk untuk melanjutkan ke dashboard</p>
				</div>

				{/* Login Form */}
				<form className="space-y-6" onSubmit={handleLogin}>
					{/* Username Input */}
					<div>
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Username
						</label>
						<input
							id="username"
							type="text"
							required
							className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
							placeholder="Masukkan username Anda"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							autoComplete="username"
						/>
					</div>

					{/* Password Input */}
					<div className="relative">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-300 mb-1"
						>
							Password
						</label>
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							required
							className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
							placeholder="Masukkan password Anda"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							autoComplete="current-password"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute inset-y-0 right-0 top-7 pr-4 flex items-center text-gray-400 hover:text-gray-200"
						>
							{showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
						</button>
					</div>

					{error && <p className="text-sm text-center text-red-400">{error}</p>}

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							disabled={loading}
							className="w-full px-4 py-3 font-bold text-white rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#D91E5B] disabled:opacity-50"
							style={{ backgroundColor: "#D91E5B" }} // Warna magenta dari logo
						>
							{loading ? "MEMPROSES..." : "MASUK"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
