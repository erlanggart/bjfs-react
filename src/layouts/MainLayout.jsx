// File: src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
	FiHome,
	FiMapPin,
	FiUsers,
	FiSettings,
	FiLogOut,
	FiMenu,
	FiX,
	FiFileText,
	FiMessageSquare,
	FiGrid,
	FiImage,
	FiChevronLeft,
	FiChevronRight,
	FiAward,
} from "react-icons/fi";

const logoUrl = "/bjfs_logo.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Komponen untuk link navigasi di sidebar
const SidebarNavLink = ({ to, icon: Icon, label, isCollapsed }) => (
	<NavLink
		to={to}
		className={({ isActive }) =>
			`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
				isActive
					? "bg-secondary text-white shadow-md"
					: "text-gray-300 hover:bg-white/10 hover:text-white"
			}`
		}
	>
		<Icon size={22} />
		<span
			className={`ml-4 transition-opacity duration-200 ${
				isCollapsed ? "opacity-0 hidden" : "opacity-100"
			}`}
		>
			{label}
		</span>
	</NavLink>
);

const MainLayout = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	// Menu configuration based on user role
	const menuConfig = {
		admin: [
			{ to: "/admin/dashboard", icon: FiGrid, label: "Dashboard" },
			{ to: "/admin/cabang", icon: FiMapPin, label: "Cabang" },
			{ to: "/admin/users", icon: FiUsers, label: "User" },
			{ to: "/admin/feedback", icon: FiMessageSquare, label: "Feedback" },
			{ to: "/admin/articles", icon: FiFileText, label: "Manajemen Artikel" },
			{ to: "/admin/pertandingan", icon: FiAward, label: "Manajemen Matches" },
			{ to: "/admin/hero-gallery", icon: FiImage, label: "Hero Gallery" },
		],
		admin_cabang: [
			{ to: "/absensi", icon: FiGrid, label: "Absensi" },
			{ to: "/laporan", icon: FiFileText, label: "Laporan" },
			{ to: "/members", icon: FiUsers, label: "Member" },
			{ to: "/feedback", icon: FiMessageSquare, label: "Feedback" },
		],
		member: [
			{ to: "/profil", icon: FiGrid, label: "Profil" },
			{ to: "/rapor", icon: FiFileText, label: "Rapor" },
			{ to: "/pembayaran", icon: FiAward, label: "Membership" },
			{ to: "/feedback-saya", icon: FiMessageSquare, label: "Feedback" },
		],
	};

	const currentMenu = menuConfig[user?.role] || menuConfig.member;
	const settingsPath =
		user?.role === "admin"
			? "/admin/settings"
			: user?.role === "admin_cabang"
				? "/cabang/settings"
				: "/member/settings";
	const dashboardPath =
		user?.role === "admin"
			? "/admin/dashboard"
			: user?.role === "admin_cabang"
				? "/absensi"
				: "/profil";
	const roleLabel =
		user?.role === "admin"
			? "Super Admin"
			: user?.role === "admin_cabang"
				? "Admin Cabang"
				: "Member";

	return (
		<div className="flex h-screen bg-slate-200">
			{/* Sidebar - Hidden on mobile */}
			<div className="hidden md:block lg:p-4">
				<aside
					className={`bg-primary shadow-lg transition-all duration-300 ease-in-out fixed lg:relative h-full rounded-lg z-40 hidden lg:block ${
						isSidebarCollapsed ? "w-20" : "w-64"
					}`}
				>
					<div className="flex items-center border-b border-white/10">
						<div
							className={`flex items-center p-4 flex-1 ${isSidebarCollapsed ? "justify-center" : ""}`}
						>
							{!isSidebarCollapsed && (
								<Link to={dashboardPath} className="flex items-center gap-2">
									<img src={logoUrl} alt="Logo" className="w-8 h-8 rounded" />
									<span className="font-bold text-lg text-white">
										Bogor Junior
									</span>
								</Link>
							)}
							{isSidebarCollapsed && (
								<img src={logoUrl} alt="Logo" className="w-8 h-8 rounded" />
							)}
						</div>
						{/* Desktop Toggle Button - Menyatu dengan Header */}

						<button
							onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
							className="hidden lg:flex items-center justify-center w-5 h-16 rounded-tr-lg bg-secondary hover:bg-white/20 transition-colors border-l border-white/10"
							title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
						>
							{isSidebarCollapsed ? (
								<FiChevronRight size={20} className="text-white" />
							) : (
								<FiChevronLeft size={20} className="text-white" />
							)}
						</button>
					</div>
					<nav className="p-4">
						{currentMenu.map((item) => (
							<SidebarNavLink
								key={item.to}
								to={item.to}
								icon={item.icon}
								label={item.label}
								isCollapsed={isSidebarCollapsed}
							/>
						))}

						{/* Logout & Profile di Bottom Sidebar */}
						<div className="absolute bottom-4 left-0 right-0 px-4 border-t border-white/10 pt-4">
							<div
								className={`flex items-center gap-2 mb-3 ${isSidebarCollapsed ? "justify-center" : ""}`}
							>
								<img
									src={
										user?.avatar
											? `${API_BASE_URL}${user.avatar}`
											: `https://placehold.co/40x40/D91E5B/FFFFFF?text=${
													user?.full_name?.charAt(0) || "A"
												}`
									}
									alt="Avatar"
									className="w-8 h-8 rounded-full object-cover border-2 border-secondary"
								/>
								{!isSidebarCollapsed && (
									<div className="flex-1">
										<p className="text-white text-sm font-semibold truncate">
											{user?.full_name || "User"}
										</p>
										<p className="text-gray-300 text-xs">{roleLabel}</p>
									</div>
								)}
							</div>
							<Link
								to={settingsPath}
								className="flex items-center p-2 my-1 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
							>
								<FiSettings size={20} />
								{!isSidebarCollapsed && (
									<span className="ml-4 text-sm">Pengaturan</span>
								)}
							</Link>
							<button
								onClick={handleLogout}
								className="w-full flex items-center p-2 my-1 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
							>
								<FiLogOut size={20} />
								{!isSidebarCollapsed && (
									<span className="ml-4 text-sm">Logout</span>
								)}
							</button>
						</div>
					</nav>
				</aside>
			</div>
			{/* Konten Utama */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Area Konten Halaman */}
				<main className="flex-1 overflow-y-auto pb-20 lg:pb-4 lg:pr-4">
					<Outlet />
				</main>

				{/* Bottom Navigation for Mobile */}
				<nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
					<div className="flex justify-around items-center h-16 px-2">
						{currentMenu.slice(0, 4).map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
										isActive
											? "text-secondary"
											: "text-gray-500 hover:text-primary"
									}`
								}
							>
								<item.icon size={22} />
								<span className="text-xs mt-1">{item.label}</span>
							</NavLink>
						))}
						<NavLink
							to={settingsPath}
							className={({ isActive }) =>
								`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
									isActive
										? "text-secondary"
										: "text-gray-500 hover:text-primary"
								}`
							}
						>
							<FiSettings size={22} />
							<span className="text-xs mt-1">Settings</span>
						</NavLink>
					</div>
				</nav>
			</div>
		</div>
	);
};

export default MainLayout;
