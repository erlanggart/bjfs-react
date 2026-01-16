// File: src/components/admin/LoginSummaryModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCalendar, FiUsers, FiTrendingUp } from "react-icons/fi";

const LoginSummaryModal = ({ isOpen, onClose, role }) => {
	const [period, setPeriod] = useState("weekly");
	const [summary, setSummary] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchSummary = async () => {
			if (!isOpen) return;
			
			setLoading(true);
			setError("");
			try {
				const response = await axios.get(
					`/api/admin/login-stats-summary?period=${period}&role=${role}`
				);
				setSummary(response.data);
			} catch (err) {
				setError("Gagal memuat rekap login.");
				console.error(err);
			} finally {
				setLoading(false);
			}
		};
		
		fetchSummary();
	}, [isOpen, period, role]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-[#1A2347] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
				{/* Header */}
				<div className="bg-[#1A2347] border-b border-gray-700 p-6 flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-white">Rekap Login User</h2>
						<p className="text-sm text-gray-400 mt-1">
							Statistik login {role === "admin_cabang" ? "Admin Cabang" : "Member"}
						</p>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-white transition-colors"
					>
						<FiX size={24} />
					</button>
				</div>

				{/* Period Selector */}
				<div className="bg-[#222B4C] p-4 border-b border-gray-700">
					<div className="flex items-center gap-4">
						<span className="text-sm text-gray-400">Periode:</span>
						<div className="flex gap-2">
							<button
								onClick={() => setPeriod("weekly")}
								className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
									period === "weekly"
										? "bg-[#D91E5B] text-white"
										: "bg-white/10 text-gray-300 hover:bg-white/20"
								}`}
							>
								7 Hari Terakhir
							</button>
							<button
								onClick={() => setPeriod("monthly")}
								className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
									period === "monthly"
										? "bg-[#D91E5B] text-white"
										: "bg-white/10 text-gray-300 hover:bg-white/20"
								}`}
							>
								30 Hari Terakhir
							</button>
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{loading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D91E5B] mx-auto"></div>
							<p className="text-gray-400 mt-4">Memuat data...</p>
						</div>
					) : error ? (
						<div className="text-center py-12">
							<p className="text-red-400">{error}</p>
						</div>
					) : summary ? (
						<div className="space-y-6">
							{/* Summary Cards */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiCalendar className="text-blue-400" size={20} />
										<h3 className="text-sm font-semibold text-blue-300">Periode</h3>
									</div>
									<p className="text-2xl font-bold text-white">{summary.days} Hari</p>
								</div>

								<div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiUsers className="text-green-400" size={20} />
										<h3 className="text-sm font-semibold text-green-300">Total User</h3>
									</div>
									<p className="text-2xl font-bold text-white">{summary.users.length}</p>
								</div>

								<div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-2">
										<FiTrendingUp className="text-purple-400" size={20} />
										<h3 className="text-sm font-semibold text-purple-300">Total Login</h3>
									</div>
									<p className="text-2xl font-bold text-white">{summary.total_logins}</p>
								</div>
							</div>

							{/* User Table */}
							<div className="bg-white/5 rounded-lg border border-gray-700 overflow-hidden">
								<div className="overflow-x-auto">
									<table className="w-full text-left text-sm">
										<thead className="bg-white/10">
											<tr>
												<th className="p-3 text-gray-300 font-semibold">No</th>
												<th className="p-3 text-gray-300 font-semibold">Username</th>
												<th className="p-3 text-gray-300 font-semibold">Nama Lengkap</th>
												<th className="p-3 text-gray-300 font-semibold">Cabang</th>
												<th className="p-3 text-gray-300 font-semibold text-center">Jumlah Login</th>
												<th className="p-3 text-gray-300 font-semibold">Login Terakhir</th>
											</tr>
										</thead>
										<tbody>
											{summary.users.length > 0 ? (
												summary.users.map((user, index) => (
													<tr
														key={user.id}
														className="border-b border-gray-700/50 hover:bg-white/5"
													>
														<td className="p-3 text-gray-400">{index + 1}</td>
														<td className="p-3 text-white font-medium">{user.username}</td>
														<td className="p-3 text-gray-300">{user.full_name}</td>
														<td className="p-3 text-gray-300">{user.branch_name}</td>
														<td className="p-3 text-center">
															<span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
																user.login_count > 0 
																	? 'bg-green-600/30 text-green-300'
																	: 'bg-gray-600/30 text-gray-400'
															}`}>
																{user.login_count}x
															</span>
														</td>
														<td className="p-3 text-gray-400 text-xs">
															{user.last_login 
																? new Date(user.last_login).toLocaleString('id-ID', {
																		day: '2-digit',
																		month: 'short',
																		hour: '2-digit',
																		minute: '2-digit'
																	})
																: '-'
															}
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan="6" className="p-8 text-center text-gray-400">
														Tidak ada data login dalam periode ini.
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</div>

							{/* Info */}
							<div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
								<p className="text-sm text-yellow-200">
									💡 <strong>Info:</strong> Tabel menampilkan semua user dan jumlah login mereka dalam periode yang dipilih. User yang tidak login akan tetap ditampilkan dengan jumlah login 0.
								</p>
							</div>
						</div>
					) : null}
				</div>

				{/* Footer */}
				<div className="bg-[#1A2347] border-t border-gray-700 p-6">
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

export default LoginSummaryModal;
