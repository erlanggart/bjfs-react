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
} from "react-icons/fi";
import AddBranchModal from "../../components/admin/AddBranchModal"; // Pastikan path ini benar

// Komponen Card untuk setiap cabang (didesain ulang)
const BranchCard = ({ branch }) => (
	<Link
		to={`/admin/cabang/${branch.id}`}
		className="block bg-primary rounded-xl shadow-md border-4 border-primary overflow-hidden group transition-all duration-300 hover:shadow-xl hover:border-[var(--color-secondary)] hover:border-4 hover:scale-105"
	>
		<div className="p-5">
			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-xl font-bold text-white group-hover:text-[var(--color-secondary)] mb-1">
						{branch.name}
					</h2>
					<p className="font-mono text-xs text-tertiary">{branch.id}</p>
				</div>
				<div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-[var(--color-secondary)] group-hover:text-white">
					<FiArrowRight />
				</div>
			</div>
			<p className="text-sm text-tertiary mt-3 min-h-[40px]">
				{branch.address || "Tidak ada alamat terdaftar."}
			</p>
		</div>
		<div className="bg-gray-50 group-hover:bg-[var(--color-tertiary)] px-5 py-4 border-t text-primary">
			<div className="flex justify-between items-center text-sm">
				<div className="flex items-center gap-2 text-gray-700">
					<FiUsers />
					<span className="font-semibold">Total Member</span>
				</div>
				<span className="font-bold text-lg text-primary">
					{branch.total_members}
				</span>
			</div>
			<div className="flex gap-4 text-xs mt-3">
				<div className="flex-1 flex items-center gap-2 p-2 bg-green-100 text-green-800 rounded-md">
					<FiCheckCircle />
					<span>
						Aktif: <strong>{branch.active_members || 0}</strong>
					</span>
				</div>
				<div className="flex-1 flex items-center gap-2 p-2 bg-red-100 text-red-800 rounded-md">
					<FiXCircle />
					<span>
						Nonaktif: <strong>{branch.inactive_members || 0}</strong>
					</span>
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
			const response = await axios.get("/api/branches/list.php");
			setBranches(response.data);
		} catch (err) {
			setError("Gagal memuat data cabang. Anda mungkin tidak memiliki akses.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchBranches();
	}, [fetchBranches]);

	return (
		<div>
			<AddBranchModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				refetch={fetchBranches}
			/>

			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">Manajemen Cabang</h1>
				<button
					onClick={() => setIsModalOpen(true)}
					className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
				>
					<FiPlus /> Tambah Cabang
				</button>
			</div>

			{loading ? (
				<p className="text-center text-gray-500">Memuat data cabang...</p>
			) : error ? (
				<p className="text-center text-red-500">{error}</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{branches.length > 0 ? (
						branches.map((branch) => (
							<BranchCard key={branch.id} branch={branch} />
						))
					) : (
						<div className="col-span-full text-center bg-white p-10 rounded-lg shadow-sm">
							<h3 className="text-lg font-semibold text-gray-700">
								Belum Ada Cabang
							</h3>
							<p className="text-gray-500 mt-1">
								Silakan tambahkan cabang baru untuk memulai.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default BranchManagementPage;
