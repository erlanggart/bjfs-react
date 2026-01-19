// File: src/pages/admin/BranchManagementPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
	FiPlus,
	FiUsers,
	FiCheckCircle,
	FiXCircle,
	FiArrowRight,
	FiMapPin,
} from "react-icons/fi";
import AddBranchModal from "../../components/admin/AddBranchModal"; // Pastikan path ini benar

// Komponen Card untuk setiap cabang (didesain ulang dengan dark theme)
const BranchCard = ({ branch }) => (
	<Link
		to={`/admin/cabang/${branch.id}`}
		className="block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group transform hover:-translate-y-2"
	>
		{/* Background gradient with dot pattern */}
		<div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
			<div
				className="absolute inset-0 opacity-30"
				style={{
					backgroundImage:
						"radial-gradient(circle, white 1px, transparent 1px)",
					backgroundSize: "20px 20px",
				}}
			></div>
		</div>

		{/* Glow effect on hover */}
		<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>

		{/* Content */}
		<div className="relative p-6 lg:p-8">
			{/* Header Section */}
			<div className="flex justify-between items-start mb-6">
				<div className="flex-1">
					<h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
						{branch.name}
					</h2>
					<p className="font-mono text-xs text-gray-400 tracking-wider">
						ID: {branch.id}
					</p>
				</div>
				<div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:bg-blue-500 group-hover:scale-110 group-hover:rotate-12 border border-white/10">
					<FiArrowRight className="text-xl lg:text-2xl" />
				</div>
			</div>

			{/* Address Section */}
			<div className="mb-6 min-h-[60px]">
				<div className="flex items-start gap-2 text-gray-300">
					<FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
					<p className="text-sm lg:text-base leading-relaxed">
						{branch.address || "Tidak ada alamat terdaftar."}
					</p>
				</div>
			</div>

			{/* Statistics Section */}
			<div className="space-y-4">
				{/* Total Members - Highlighted */}
				<div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 group-hover:bg-white/10 transition-all duration-300">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
								<FiUsers className="text-blue-400 text-xl lg:text-2xl" />
							</div>
							<span className="font-semibold text-white text-sm lg:text-base">
								Total Member
							</span>
						</div>
						<span className="font-bold text-3xl lg:text-4xl text-white">
							{branch.total_members}
						</span>
					</div>
				</div>

				{/* Active/Inactive Status - Side by side on desktop, stacked on mobile */}
				<div className="grid grid-cols-2 gap-3 lg:gap-4">
					<div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-green-500/20">
						<div className="flex flex-col items-center gap-2 text-center">
							<FiCheckCircle className="text-green-400 text-2xl lg:text-3xl" />
							<div>
								<div className="text-2xl lg:text-3xl font-bold text-green-400">
									{branch.active_members || 0}
								</div>
								<div className="text-xs lg:text-sm text-green-300 font-medium mt-1">
									Aktif
								</div>
							</div>
						</div>
					</div>
					<div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-3 lg:p-4 border border-red-500/20">
						<div className="flex flex-col items-center gap-2 text-center">
							<FiXCircle className="text-red-400 text-2xl lg:text-3xl" />
							<div>
								<div className="text-2xl lg:text-3xl font-bold text-red-400">
									{branch.inactive_members || 0}
								</div>
								<div className="text-xs lg:text-sm text-red-300 font-medium mt-1">
									Nonaktif
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Link>
);

const BranchManagementPage = () => {
	const [branches, setBranches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchBranches = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const response = await axios.get("/api/branches");
			setBranches(response.data);
		} catch {
			setError("Gagal memuat data cabang. Anda mungkin tidak memiliki akses.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBranches();
	}, [fetchBranches]);

	return (
		<div className="p-4">
			<AddBranchModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				refetch={fetchBranches}
			/>

			{/* Header Section */}
			<div className="mb-8 lg:mb-10">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div>
						<h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
							Manajemen Cabang
						</h1>
						<p className="text-gray-600 text-sm lg:text-base">
							Kelola semua cabang Bogor Junior Football School
						</p>
					</div>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
					>
						<FiPlus className="text-xl" />
						<span>Tambah Cabang</span>
					</button>
				</div>

				{/* Stats Summary */}
				{!loading && !error && branches.length > 0 && (
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-blue-600 text-sm font-medium">
										Total Cabang
									</p>
									<p className="text-3xl font-bold text-blue-900 mt-1">
										{branches.length}
									</p>
								</div>
								<div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
									<FiMapPin className="text-blue-700 text-2xl" />
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-green-600 text-sm font-medium">
										Member Aktif
									</p>
									<p className="text-3xl font-bold text-green-900 mt-1">
										{branches.reduce(
											(sum, b) => sum + Number(b.active_members || 0),
											0,
										)}
									</p>
								</div>
								<div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
									<FiCheckCircle className="text-green-700 text-2xl" />
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-purple-600 text-sm font-medium">
										Total Member
									</p>
									<p className="text-3xl font-bold text-purple-900 mt-1">
										{branches.reduce(
											(sum, b) => sum + Number(b.total_members || 0),
											0,
										)}
									</p>
								</div>
								<div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
									<FiUsers className="text-purple-700 text-2xl" />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Content Section */}
			{loading ? (
				<div className="flex flex-col items-center justify-center py-20">
					<div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
					<p className="text-gray-600 text-lg">Memuat data cabang...</p>
				</div>
			) : error ? (
				<div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
					<div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<FiXCircle className="text-red-600 text-3xl" />
					</div>
					<h3 className="text-xl font-semibold text-red-900 mb-2">
						Gagal Memuat Data
					</h3>
					<p className="text-red-600">{error}</p>
					<button
						onClick={fetchBranches}
						className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
					>
						Coba Lagi
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
					{branches.length > 0 ? (
						branches.map((branch) => (
							<BranchCard key={branch.id} branch={branch} />
						))
					) : (
						<div className="col-span-full">
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
								<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
									<FiMapPin className="text-gray-400 text-4xl" />
								</div>
								<h3 className="text-2xl font-semibold text-gray-700 mb-2">
									Belum Ada Cabang
								</h3>
								<p className="text-gray-500 mb-6">
									Silakan tambahkan cabang baru untuk memulai mengelola member.
								</p>
								<button
									onClick={() => setIsModalOpen(true)}
									className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
								>
									<FiPlus className="text-xl" />
									<span>Tambah Cabang Pertama</span>
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default BranchManagementPage;
