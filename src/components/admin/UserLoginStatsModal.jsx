// File: src/components/admin/UserLoginStatsModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCalendar, FiClock } from "react-icons/fi";

const UserLoginStatsModal = ({ isOpen, onClose, userId }) => {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchStats = async () => {
			if (!isOpen || !userId) return;
			
			setLoading(true);
			setError("");
			try {
				const response = await axios.get(`/api/admin/user_login_stats.php?user_id=${userId}`);
				setStats(response.data);
			} catch (err) {
				setError("Gagal memuat statistik login.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		
		fetchStats();
	}, [isOpen, userId]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-[#1A2347] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="sticky top-0 bg-[#1A2347] border-b border-gray-700 p-6 flex justify-between items-center">
					<h2 className="text-2xl font-bold text-white">Statistik Login User</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
						<FiX size={24} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{loading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D91E5B] mx-auto"></div>
							<p className="text-gray-400 mt-4">Memuat data...</p>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-red-400">{error}</p>
						</div>
					) : stats ? (
						<div className="space-y-6">
							{/* Statistik Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* Login Minggu Ini */}
								<div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiCalendar className="text-blue-400" size={20} />
										<h3 className="text-sm font-semibold text-blue-300">7 Hari Terakhir</h3>
									</div>
									<p className="text-3xl font-bold text-white">{stats.weekly_logins}</p>
									<p className="text-xs text-gray-400 mt-1">kali login</p>
								</div>

								{/* Login Bulan Ini */}
								<div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiCalendar className="text-green-400" size={20} />
										<h3 className="text-sm font-semibold text-green-300">30 Hari Terakhir</h3>
									</div>
									<p className="text-3xl font-bold text-white">{stats.monthly_logins}</p>
									<p className="text-xs text-gray-400 mt-1">kali login</p>
								</div>

								{/* Total Login */}
								<div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiClock className="text-purple-400" size={20} />
										<h3 className="text-sm font-semibold text-purple-300">Total Semua</h3>
									</div>
									<p className="text-3xl font-bold text-white">{stats.total_logins}</p>
									<p className="text-xs text-gray-400 mt-1">kali login</p>
								</div>
							</div>

							{/* Login Terakhir */}
							{stats.last_login && (
								<div className="bg-white/5 rounded-lg p-4 border border-gray-700">
									<h3 className="text-sm font-semibold text-gray-400 mb-2">Login Terakhir</h3>
									<p className="text-white font-medium">
										{new Date(stats.last_login).toLocaleString('id-ID', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>
							)}

							{/* Info Box */}
							<div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
								<p className="text-sm text-yellow-200">
									💡 <strong>Info:</strong> Statistik ini menghitung setiap kali user melakukan login ke sistem.
								</p>
							</div>
						</div>
					) : null}
				</div>

				{/* Footer */}
				<div className="sticky bottom-0 bg-[#1A2347] border-t border-gray-700 p-6">
					<button
						onClick={onClose}
						className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
					>
						Tutup
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserLoginStatsModal;
