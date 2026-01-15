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
	FiGrid, // <-- ICON BARU
	FiList,
	FiDownload, // <-- ICON BARU
} from "react-icons/fi";
import AddUserModal from "../../components/admin/AddUserModal";
import { useAuth } from "../../context/AuthContext";
import BirthdayCalendar from "../../components/BirthdayCalendar";

// Helper function untuk status pembayaran (tidak ada perubahan)
const getPaymentStatus = (member) => {
	if (!member.registration_date) {
		return { show: false };
	}
	if (member.current_month_proof_status === "pending") {
		return { show: true, status: "pending", text: "Menunggu Persetujuan" };
	}
	if (member.current_month_proof_status === "approved") {
		return { show: false };
	}
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const baseDate = new Date(
		member.last_payment_date || member.registration_date
	);
	const nextDueDate = new Date(
		baseDate.getFullYear(),
		baseDate.getMonth() + 1,
		baseDate.getDate()
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
						member.avatar ||
						`https://placehold.co/96x96/E0E0E0/757575?text=${member.full_name.charAt(
							0
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
				<div className="mt-3 w-full">
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
					member.avatar ||
					`https://placehold.co/48x48/E0E0E0/757575?text=${member.full_name.charAt(
						0
					)}`
				}
				alt={member.full_name}
				className="w-12 h-12 rounded-full object-cover flex-shrink-0"
			/>
			<div className="flex-grow overflow-hidden">
				<p className="font-bold text-primary truncate">{member.full_name}</p>
				<p className="text-sm text-gray-500 font-mono">{member.id}</p>
			</div>
			<div className="flex-shrink-0 ml-auto">
				{paymentBadge.show && (
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
				)}
			</div>
		</Link>
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
			const response = await axios.get("/api/branch-admin/list_members.php", {
				params: { search: searchTerm },
			});
			setMembers(response.data);
		} catch (error) {
			console.error("Gagal memuat member", error);
		} finally {
			setLoading(false);
		}
	}, [searchTerm]);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const handleExportExcel = () => {
		// Cara termudah untuk mengunduh file adalah dengan mengarahkan browser ke URL API
		// Header yang diatur di PHP akan memaksa browser untuk mengunduh, bukan menampilkan
		window.location.href = "/api/branch-admin/export_members.php";
	};

	const stats = useMemo(() => {
		const activeMembers = members.filter((m) => m.status === "active");
		const inactiveCount = members.filter((m) => m.status === "inactive").length;
		const paymentDueCount = activeMembers.filter(
			(m) => getPaymentStatus(m).show
		).length;
		return {
			total: members.length,
			active: activeMembers.length,
			inactive: inactiveCount,
			paymentDue: paymentDueCount,
		};
	}, [members]);

	const filteredMembers = useMemo(() => {
		return members.filter((member) => member.status === activeTab);
	}, [members, activeTab]);

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
		<div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
			<AddUserModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				role="member"
				refetch={fetchMembers}
				defaultBranchId={user?.branch_id}
			/>
			<Link
				to="/feedback"
				className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold w-full mb-6 shadow-sm hover:bg-primary-dark"
			>
				<FiMessageSquare /> Lihat Feedback
			</Link>

			<BirthdayCalendar branchId={user?.branch_id} />

			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-6 gap-4">
				<h1 className="text-2xl font-bold text-gray-800">
					Daftar Member Cabang
				</h1>
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

			<div className="relative mb-4">
				<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Cari nama member atau ID..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
				/>
			</div>

			{/* --- AREA TAB DAN VIEW SWITCHER --- */}
			<div className="flex justify-between items-center border-b mb-6">
				{/* Tabs */}
				<div>
					<TabButton status="active" label="Member Aktif" />
					<TabButton status="inactive" label="Member Nonaktif" />
				</div>
				{/* View Switcher */}
				<div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
					<button
						onClick={() => setViewMode("grid")}
						className={`p-1.5 rounded-md transition-colors ${
							viewMode === "grid"
								? "bg-secondary text-white shadow"
								: "text-gray-500 hover:bg-gray-300"
						}`}
						aria-label="Grid View"
					>
						<FiGrid />
					</button>
					<button
						onClick={() => setViewMode("list")}
						className={`p-1.5 rounded-md transition-colors ${
							viewMode === "list"
								? "bg-secondary text-white shadow"
								: "text-gray-500 hover:bg-gray-300"
						}`}
						aria-label="List View"
					>
						<FiList />
					</button>
				</div>
			</div>

			{/* --- AREA KONTEN DINAMIS BERDASARKAN VIEW MODE --- */}
			<div>
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
						<p className="text-gray-500">Tidak ada member dengan status ini.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default MemberListPage;
