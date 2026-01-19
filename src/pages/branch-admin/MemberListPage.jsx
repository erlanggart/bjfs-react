// File: src/pages/branch-admin/MemberListPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
	FiSearch,
	FiPlus,
	FiAlertCircle,
	FiUsers,
	FiUserCheck,
	FiUserX,
	FiClock,
	FiMessageSquare,
	FiGrid,
	FiList,
	FiDownload,
	FiCheckCircle,
} from "react-icons/fi";
import AddUserModal from "../../components/admin/AddUserModal";
import { useAuth } from "../../context/AuthContext";
import BirthdayCalendar from "../../components/BirthdayCalendar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function untuk status pembayaran dengan payment_type
const getPaymentStatus = (member) => {
	if (!member.registration_date) {
		return { show: false };
	}
	if (member.current_month_proof_status === "pending") {
		return {
			show: true,
			status: "pending",
			text: "Menunggu Persetujuan",
			paymentType: member.current_month_payment_type || null,
		};
	}
	if (member.current_month_proof_status === "approved") {
		return { show: false };
	}
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const baseDate = new Date(
		member.last_payment_date || member.registration_date,
	);
	const nextDueDate = new Date(
		baseDate.getFullYear(),
		baseDate.getMonth() + 1,
		baseDate.getDate(),
	);
	const timeDiff = nextDueDate.getTime() - today.getTime();
	const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (daysRemaining <= 7) {
		const isOverdue = daysRemaining < 0;
		return {
			show: true,
			status: "due",
			text: isOverdue
				? `Telat ${Math.abs(daysRemaining)} hari`
				: `${daysRemaining} hari lagi`,
		};
	}
	return { show: false };
};

// Komponen StatCard (tidak ada perubahan)
const StatCard = ({ icon, label, value, color }) => (
	<div
		className={`bg-white p-4 rounded-lg shadow-md flex items-center gap-4 border-l-4 ${color}`}
	>
		<div
			className={`p-3 rounded-full ${color
				.replace("border", "bg")
				.replace("-500", "-100")} ${color.replace("border", "text")}`}
		>
			{icon}
		</div>
		<div>
			<p className="text-2xl font-bold text-gray-800">{value}</p>
			<p className="text-sm text-gray-500">{label}</p>
		</div>
	</div>
);

// Komponen untuk tampilan GRID (tidak ada perubahan)
const MemberCard = ({ member }) => {
	const paymentBadge = getPaymentStatus(member);
	return (
		<Link
			to={`/branch/member/${member.id}`}
			className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
		>
			<div className="relative mb-3">
				<img
					src={
						member.avatar
							? `${API_BASE_URL}${member.avatar}`
							: `https://placehold.co/96x96/E0E0E0/757575?text=${member.full_name.charAt(
									0,
								)}`
					}
					alt={member.full_name}
					className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 group-hover:border-secondary transition-colors"
				/>
				<span
					className={`absolute bottom-0 right-0 text-xs px-2 py-0.5 rounded-full font-semibold border-2 border-white ${
						member.status === "active"
							? "bg-green-500 text-white"
							: "bg-gray-500 text-white"
					}`}
				>
					{member.status === "active" ? "Aktif" : "Nonaktif"}
				</span>
			</div>
			<div className="flex-grow">
				<p className="font-bold text-lg text-primary leading-tight truncate">
					{member.full_name}
				</p>
				<p className="font-mono text-xs text-white rounded py-1 px-3 inline-block bg-secondary">
					{member.id}
				</p>
			</div>
			{paymentBadge.show && (
				<div className="mt-3 w-full space-y-1.5">
					<span
						className={`flex items-center justify-center gap-1 text-xs px-2 py-1 rounded-full font-semibold ${
							paymentBadge.status === "pending"
								? "bg-blue-100 text-blue-800"
								: "bg-yellow-100 text-yellow-800"
						}`}
					>
						{paymentBadge.status === "pending" ? (
							<FiClock size={12} />
						) : (
							<FiAlertCircle size={12} />
						)}{" "}
						{paymentBadge.text}
					</span>
					{paymentBadge.paymentType && (
						<span
							className={`block text-xs px-2 py-0.5 rounded-full font-semibold ${
								paymentBadge.paymentType === "full"
									? "bg-green-100 text-green-700"
									: "bg-purple-100 text-purple-700"
							}`}
						>
							{paymentBadge.paymentType === "full" ? "Full Payment" : "Cuti"}
						</span>
					)}
				</div>
			)}
		</Link>
	);
};

// =================================================================
// KOMPONEN BARU: Untuk Tampilan LIST
// =================================================================
const MemberListItem = ({ member }) => {
	const paymentBadge = getPaymentStatus(member);
	return (
		<Link
			to={`/branch/member/${member.id}`}
			className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-4 w-full transition-all duration-200 hover:shadow-md hover:bg-gray-50"
		>
			<img
				src={
					member.avatar
						? `${API_BASE_URL}${member.avatar}`
						: `https://placehold.co/48x48/E0E0E0/757575?text=${member.full_name.charAt(
								0,
							)}`
				}
				alt={member.full_name}
				className="w-12 h-12 rounded-full object-cover flex-shrink-0"
			/>
			<div className="flex-grow overflow-hidden">
				<p className="font-bold text-primary truncate">{member.full_name}</p>
				<p className="text-sm text-gray-500 font-mono">{member.id}</p>
			</div>
			<div className="flex-shrink-0 ml-auto flex items-center gap-2">
				{paymentBadge.show && (
					<>
						<span
							className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${
								paymentBadge.status === "pending"
									? "bg-blue-100 text-blue-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{paymentBadge.status === "pending" ? (
								<FiClock size={12} />
							) : (
								<FiAlertCircle size={12} />
							)}
							<span>{paymentBadge.text}</span>
						</span>
						{paymentBadge.paymentType && (
							<span
								className={`text-xs px-2 py-1 rounded-full font-semibold ${
									paymentBadge.paymentType === "full"
										? "bg-green-100 text-green-700"
										: "bg-purple-100 text-purple-700"
								}`}
							>
								{paymentBadge.paymentType === "full" ? "Full" : "Cuti"}
							</span>
						)}
					</>
				)}
			</div>
		</Link>
	);
};

// =================================================================
// KOMPONEN BARU: Pending Payments List
// =================================================================
const PendingPaymentsList = ({ branchId }) => {
	const [pendingPayments, setPendingPayments] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPendingPayments = async () => {
			try {
				const response = await axios.get("/api/branch-admin/members");
				const members = response.data;

				// Filter members with pending payment status
				const pending = members.filter(
					(m) => m.current_month_proof_status === "pending",
				);

				setPendingPayments(pending);
			} catch (error) {
				console.error("Gagal memuat pending payments", error);
			} finally {
				setLoading(false);
			}
		};

		if (branchId) {
			fetchPendingPayments();
		}
	}, [branchId]);

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-md p-4">
				<h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
					<FiClock className="text-yellow-600" />
					Menunggu Persetujuan
				</h3>
				<p className="text-sm text-gray-500 text-center py-4">Memuat data...</p>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-4">
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
					<FiClock className="text-yellow-600" />
					Menunggu Persetujuan
				</h3>
				<span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
					{pendingPayments.length}
				</span>
			</div>

			{pendingPayments.length > 0 ? (
				<div className="space-y-2 max-h-96 overflow-y-auto">
					{pendingPayments.map((member) => (
						<Link
							key={member.id}
							to={`/branch/member/${member.id}`}
							className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
						>
							<img
								src={
									member.avatar
										? `${API_BASE_URL}${member.avatar}`
										: `https://placehold.co/40x40/E0E0E0/757575?text=${member.full_name.charAt(0)}`
								}
								alt={member.full_name}
								className="w-10 h-10 rounded-full object-cover flex-shrink-0"
							/>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-semibold text-gray-800 truncate">
									{member.full_name}
								</p>
								<p className="text-xs text-gray-500 font-mono">{member.id}</p>
								{member.current_month_payment_type && (
									<span
										className={`inline-block text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
											member.current_month_payment_type === "full"
												? "bg-green-100 text-green-700"
												: "bg-purple-100 text-purple-700"
										}`}
									>
										{member.current_month_payment_type === "full"
											? "Full"
											: "Cuti"}
									</span>
								)}
							</div>
							<FiCheckCircle
								className="text-blue-500 flex-shrink-0"
								size={18}
							/>
						</Link>
					))}
				</div>
			) : (
				<p className="text-sm text-gray-500 text-center py-4">
					Tidak ada pembayaran yang menunggu persetujuan
				</p>
			)}
		</div>
	);
};

const MemberListPage = () => {
	const { user } = useAuth();
	const [members, setMembers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("active");
	const [isModalOpen, setIsModalOpen] = useState(false);
	// --- STATE BARU UNTUK VIEW MODE ---
	const [viewMode, setViewMode] = useState("list"); // 'grid' or 'list'

	const fetchMembers = useCallback(async () => {
		setLoading(true);
		try {
			const response = await axios.get("/api/branch-admin/members");
			setMembers(response.data);
		} catch (error) {
			console.error("Gagal memuat member", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const handleExportExcel = () => {
		// Cara termudah untuk mengunduh file adalah dengan mengarahkan browser ke URL API
		// Header yang diatur di PHP akan memaksa browser untuk mengunduh, bukan menampilkan
		window.location.href = "/api/branch-admin/export-members";
	};

	const stats = useMemo(() => {
		const activeMembers = members.filter((m) => m.status === "active");
		const inactiveCount = members.filter((m) => m.status === "inactive").length;
		const paymentDueCount = activeMembers.filter(
			(m) => getPaymentStatus(m).show,
		).length;
		return {
			total: members.length,
			active: activeMembers.length,
			inactive: inactiveCount,
			paymentDue: paymentDueCount,
		};
	}, [members]);

	const filteredMembers = useMemo(() => {
		let filtered = members.filter((member) => member.status === activeTab);

		// Apply search filter
		if (searchTerm.trim()) {
			const search = searchTerm.toLowerCase();
			filtered = filtered.filter(
				(member) =>
					member.full_name.toLowerCase().includes(search) ||
					member.id.toLowerCase().includes(search),
			);
		}

		return filtered;
	}, [members, activeTab, searchTerm]);

	const TabButton = ({ status, label }) => (
		<button
			onClick={() => setActiveTab(status)}
			className={`px-4 py-2 text-sm font-semibold transition-colors ${
				activeTab === status
					? "border-b-2 border-secondary text-secondary"
					: "text-gray-500 hover:text-gray-800"
			}`}
		>
			{label}
		</button>
	);

	return (
		<div className="p-4 ">
			<AddUserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				role="member"
				refetch={fetchMembers}
				defaultBranchId={user?.branch_id}
			/>

			<div className="flex flex-col sm:flex-row bg-primary p-4 justify-between items-start sm:items-center mb-6 gap-4 rounded-lg">
				<h1 className="text-2xl font-bold text-white">Daftar Member Cabang</h1>
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
					<button
						onClick={handleExportExcel}
						className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
					>
						<FiDownload /> Unduh Excel
					</button>
					<button
						onClick={() => setIsModalOpen(true)}
						className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg font-semibold w-full sm:w-auto shadow-sm hover:bg-secondary-dark"
					>
						<FiPlus /> Tambah Member Baru
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<StatCard
					icon={<FiUsers size={24} />}
					label="Total Member"
					value={stats.total}
					color="border-blue-500"
				/>
				<StatCard
					icon={<FiUserCheck size={24} />}
					label="Member Aktif"
					value={stats.active}
					color="border-green-500"
				/>
				<StatCard
					icon={<FiUserX size={24} />}
					label="Member Nonaktif"
					value={stats.inactive}
					color="border-gray-500"
				/>
				<StatCard
					icon={<FiAlertCircle size={24} />}
					label="Pembayaran Tertunda"
					value={stats.paymentDue}
					color="border-yellow-500"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 order-2 lg:order-1">
					<div className="relative mb-4 bg-white rounded-lg shadow-sm">
						<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Cari nama member atau ID..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
						/>
					</div>

					{/* --- AREA TAB DAN VIEW SWITCHER --- */}
					<div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						{/* Tabs */}
						<div className="flex gap-2 w-full sm:w-auto">
							<button
								onClick={() => setActiveTab("active")}
								className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
									activeTab === "active"
										? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								<span className="flex items-center justify-center gap-2">
									<FiUserCheck size={16} />
									Member Aktif
								</span>
							</button>
							<button
								onClick={() => setActiveTab("inactive")}
								className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
									activeTab === "inactive"
										? "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md"
										: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								}`}
							>
								<span className="flex items-center justify-center gap-2">
									<FiUserX size={16} />
									Member Nonaktif
								</span>
							</button>
						</div>

						{/* View Switcher */}
						<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
							<span className="text-xs text-gray-500 font-medium hidden sm:inline">
								Tampilan:
							</span>
							<div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shadow-inner">
								<button
									onClick={() => setViewMode("list")}
									className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
										viewMode === "list"
											? "bg-white text-secondary shadow-sm font-semibold"
											: "text-gray-500 hover:text-gray-700"
									}`}
									aria-label="List View"
								>
									<FiList size={16} />
									<span className="text-xs hidden sm:inline">List</span>
								</button>
								<button
									onClick={() => setViewMode("grid")}
									className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-1.5 ${
										viewMode === "grid"
											? "bg-white text-secondary shadow-sm font-semibold"
											: "text-gray-500 hover:text-gray-700"
									}`}
									aria-label="Grid View"
								>
									<FiGrid size={16} />
									<span className="text-xs hidden sm:inline">Grid</span>
								</button>
							</div>
						</div>
					</div>
					{/* --- AREA KONTEN DINAMIS BERDASARKAN VIEW MODE --- */}

					{loading ? (
						<p className="col-span-full text-center py-10 text-gray-500">
							Memuat data member...
						</p>
					) : filteredMembers.length > 0 ? (
						// Tampilkan Grid atau List berdasarkan state viewMode
						viewMode === "grid" ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{filteredMembers.map((member) => (
									<MemberCard key={member.id} member={member} />
								))}
							</div>
						) : (
							<div className="space-y-3">
								{filteredMembers.map((member) => (
									<MemberListItem key={member.id} member={member} />
								))}
							</div>
						)
					) : (
						<div className="col-span-full p-10 text-center bg-white rounded-lg shadow-sm">
							<p className="text-gray-500">
								Tidak ada member dengan status ini.
							</p>
						</div>
					)}
				</div>

				<div className="order-1 lg:order-2 space-y-6">
					<BirthdayCalendar branchId={user?.branch_id} />
					<PendingPaymentsList branchId={user?.branch_id} />
				</div>
			</div>
		</div>
	);
};

export default MemberListPage;
