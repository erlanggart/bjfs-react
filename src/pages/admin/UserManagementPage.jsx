// File: src/pages/admin/UserManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	FiSearch,
	FiChevronLeft,
	FiChevronRight,
	FiPlus,
	FiBarChart2,
	FiEye,
} from "react-icons/fi";
import { useDebounce } from "use-debounce";
import AddUserModal from "../../components/admin/AddUserModal"; // Impor modal
import UserLoginStatsModal from "../../components/admin/UserLoginStatsModal"; // Modal statistik login
import LoginSummaryModal from "../../components/admin/LoginSummaryModal"; // Modal rekap login

const UserManagementPage = () => {
	const [activeTab, setActiveTab] = useState("admin_cabang");
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
	const [isStatsModalOpen, setIsStatsModalOpen] = useState(false); // Modal statistik user
	const [selectedUserId, setSelectedUserId] = useState(null); // User ID yang dipilih
	const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false); // Modal rekap login

	const fetchData = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const response = await axios.get("/api/admin/users", {
				params: {
					role: activeTab,
					page: currentPage,
					search: debouncedSearchTerm,
					limit: 10,
				},
			});
			setUsers(response.data.data);
			console.log(response.data);
			setPagination(response.data.pagination);
		} catch (err) {
			console.error("Error fetching users:", err);
			setError("Gagal memuat data. Anda mungkin tidak memiliki akses.");
		} finally {
			setLoading(false);
		}
	}, [activeTab, currentPage, debouncedSearchTerm]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setCurrentPage(1);
	}, [activeTab, debouncedSearchTerm]);

	const handleTabClick = (tab) => {
		setActiveTab(tab);
	};

	const TabButton = ({ tabName, label }) => (
		<button
			onClick={() => handleTabClick(tabName)}
			className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
				activeTab === tabName
					? "bg-[#D91E5B] text-white"
					: "bg-white/10 text-gray-300 hover:bg-white/20"
			}`}
		>
			{label}
		</button>
	);

	const handleViewStats = (userId) => {
		setSelectedUserId(userId);
		setIsStatsModalOpen(true);
	};

	return (
		<div className="text-white">
			<AddUserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				role={activeTab}
				refetch={fetchData}
			/>
			
			<UserLoginStatsModal
				isOpen={isStatsModalOpen}
				onClose={() => setIsStatsModalOpen(false)}
				userId={selectedUserId}
			/>
			
			<LoginSummaryModal
				isOpen={isSummaryModalOpen}
				onClose={() => setIsSummaryModalOpen(false)}
				role={activeTab}
			/>

			{/* Header Section */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-[var(--color-primary)] mb-2">
					Manajemen Pengguna
				</h1>
				<p className="text-gray-400">Kelola data admin cabang dan member</p>
			</div>

			{/* Control Panel */}
			<div className="bg-gradient-to-br from-[#1A2347] to-[#222B4C] rounded-2xl shadow-2xl p-6 mb-6 border border-gray-700/50">
				<div className="flex flex-col lg:flex-row justify-between items-center gap-4">
					{/* Tab Buttons */}
					<div className="flex items-center gap-2 bg-[#0F1629] p-1.5 rounded-xl shadow-inner">
						<button
							onClick={() => handleTabClick("admin_cabang")}
							className={`px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
								activeTab === "admin_cabang"
									? "bg-gradient-to-r from-[#D91E5B] to-[#FF1654] text-white shadow-lg shadow-pink-500/50 scale-105"
									: "text-gray-400 hover:text-white hover:bg-white/5"
							}`}
						>
							Admin Cabang
						</button>
						<button
							onClick={() => handleTabClick("member")}
							className={`px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
								activeTab === "member"
									? "bg-gradient-to-r from-[#D91E5B] to-[#FF1654] text-white shadow-lg shadow-pink-500/50 scale-105"
									: "text-gray-400 hover:text-white hover:bg-white/5"
							}`}
						>
							Member
						</button>
					</div>

					{/* Search & Actions */}
					<div className="flex items-center gap-3 w-full lg:w-auto">
						{/* Search Bar */}
						<div className="relative flex-grow lg:flex-grow-0 lg:w-80">
							<div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
								<FiSearch size={20} />
							</div>
							<input
								type="text"
								placeholder="Cari nama atau username..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 bg-[#0F1629] text-white border-2 border-gray-700/50 rounded-xl focus:outline-none focus:border-[#D91E5B] focus:ring-2 focus:ring-[#D91E5B]/20 transition-all placeholder-gray-500 shadow-inner"
							/>
						</div>

						{/* Action Buttons */}
						<button
							onClick={() => setIsSummaryModalOpen(true)}
							className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
						>
							<FiBarChart2 size={18} /> 
							<span className="hidden sm:inline">Rekap</span>
						</button>
						<button
							onClick={() => setIsModalOpen(true)}
							className="flex-shrink-0 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#D91E5B] to-[#FF1654] text-white rounded-xl font-bold hover:from-[#FF1654] hover:to-[#D91E5B] transition-all shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-105"
						>
							<FiPlus size={18} /> 
							<span className="hidden sm:inline">Tambah</span>
						</button>
					</div>
				</div>
			</div>

			{/* Tabel Pengguna */}
			<div className="bg-gradient-to-br from-[#1A2347] to-[#222B4C] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gradient-to-r from-[#0F1629] to-[#1A2347] border-b border-gray-700">
								{activeTab === "member" && (
									<th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
										ID
									</th>
								)}
								<th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
									Username
								</th>
								<th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
									Nama Lengkap
								</th>
								<th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
									Cabang
								</th>
								<th className="px-6 py-4 text-center text-xs font-bold text-gray-300 uppercase tracking-wider">
								Login Stats
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700/50">
							{loading ? (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D91E5B]"></div>
											<p className="text-gray-400">Memuat data...</p>
										</div>
									</td>
								</tr>
							) : error ? (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center gap-2">
											<p className="text-red-400 text-lg">⚠️ {error}</p>
										</div>
									</td>
								</tr>
							) : users.length > 0 ? (
								users.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-gradient-to-r hover:from-[#D91E5B]/10 hover:to-transparent transition-all duration-200 group"
									>
										{activeTab === "member" && (
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#D91E5B] to-[#FF1654] text-white font-bold text-sm shadow-lg">
													{user.nomor_id}
												</span>
											</td>
										)}
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
													{user.username.charAt(0).toUpperCase()}
												</div>
												<div>
													<p className="text-white font-semibold">{user.username}</p>
													<p className="text-xs text-gray-400">@{user.username.toLowerCase()}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<p className="text-white font-medium">{user.full_name}</p>
										</td>
										<td className="px-6 py-4">
											<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30">
											 {user.branch_name}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex justify-center">
												<button 
													onClick={() => handleViewStats(user.id)}
													className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 group-hover:scale-110"
												>
													<FiEye size={16} /> 
													<span>Lihat Stats</span>
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="5" className="px-6 py-12 text-center">
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center">
												<FiSearch size={32} className="text-gray-500" />
											</div>
											<p className="text-gray-400 text-lg">Tidak ada data ditemukan</p>
											<p className="text-gray-500 text-sm">Coba ubah kata kunci pencarian Anda</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Paginasi */}
			{!loading && pagination.totalPages > 1 && (
				<div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 bg-gradient-to-r from-[#1A2347] to-[#222B4C] rounded-xl p-4 border border-gray-700/50">
					<button
						onClick={() => setCurrentPage(currentPage - 1)}
						disabled={currentPage === 1}
						className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
					>
						<FiChevronLeft size={18} /> 
						<span>Sebelumnya</span>
					</button>
					
					<div className="flex items-center gap-2">
						<span className="px-4 py-2 bg-gradient-to-r from-[#D91E5B] to-[#FF1654] text-white rounded-lg font-bold shadow-lg">
							{pagination.currentPage}
						</span>
						<span className="text-gray-400 font-medium">dari</span>
						<span className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg font-bold">
							{pagination.totalPages}
						</span>
					</div>
					
					<button
						onClick={() => setCurrentPage(currentPage + 1)}
						disabled={currentPage === pagination.totalPages}
						className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
					>
						<span>Selanjutnya</span>
						<FiChevronRight size={18} />
					</button>
				</div>
			)}
		</div>
	);
};

export default UserManagementPage;
