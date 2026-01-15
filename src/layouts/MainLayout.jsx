// File: src/layouts/MainLayout.jsx
import React, { useState, useEffect, useRef } from "react";
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
} from "react-icons/fi";

const logoUrl = "/bjfs_logo.svg";

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
	const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
	const profileMenuRef = useRef(null);

	// Menutup menu profil saat klik di luar
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				profileMenuRef.current &&
				!profileMenuRef.current.contains(event.target)
			) {
				setIsProfileMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [profileMenuRef]);

	const handleLogout = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<div className="flex h-screen bg-gray-100">
			{/* Sidebar */}
			<aside
				className={`bg-primary shadow-lg transition-all duration-300 ease-in-out ${
					isSidebarCollapsed ? "w-20" : "w-64"
				}`}
			>
				<div
					className={`flex items-center p-4 border-b border-white/10 ${
						isSidebarCollapsed ? "justify-center" : "justify-between"
					}`}
				>
					{!isSidebarCollapsed && (
						<Link to="/admin/dashboard" className="flex items-center gap-2">
							<img src={logoUrl} alt="Logo" className="w-8 h-8 rounded" />
							<span className="font-bold text-lg text-white">Bogor Junior</span>
						</Link>
					)}
					{isSidebarCollapsed && (
						<img src={logoUrl} alt="Logo" className="w-8 h-8 rounded" />
					)}
				</div>
				<nav className="p-4">
					<SidebarNavLink
						to="/admin/dashboard"
						icon={FiGrid}
						label="Dashboard"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarNavLink
						to="/admin/cabang"
						icon={FiMapPin}
						label="Manajemen Cabang"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarNavLink
						to="/admin/users"
						icon={FiUsers}
						label="Manajemen User"
						isCollapsed={isSidebarCollapsed}
					/>
					<SidebarNavLink
						to="/admin/feedback"
						icon={FiMessageSquare}
						label="Feedback"
						isCollapsed={isSidebarCollapsed}
					/>
				<SidebarNavLink
					to="/admin/articles"
					icon={FiFileText}
					label="Manajemen Artikel"
					isCollapsed={isSidebarCollapsed}
				/>
				<SidebarNavLink
					to="/admin/pertandingan"
					icon={FiHome}
					label="Manajemen Matches"
					isCollapsed={isSidebarCollapsed}
				/>
				<SidebarNavLink
					to="/admin/hero-gallery"
					icon={FiImage}
					label="Hero Gallery"
					isCollapsed={isSidebarCollapsed}
				/>
			</nav>
		</aside>			{/* Konten Utama */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header */}
				<header className="bg-white shadow-md p-4 flex justify-between items-center">
					{/* Tombol Hamburger Menu */}
					<button
						onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
						className="p-2 rounded-full text-gray-600 hover:bg-gray-200"
					>
						<FiMenu size={24} />
					</button>

					{/* Menu Profil */}
					<div className="relative" ref={profileMenuRef}>
						<button
							onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
							className="flex items-center gap-2"
						>
							<img
								src={
									user?.avatar ||
									`https://placehold.co/40x40/D91E5B/FFFFFF?text=${
										user?.full_name?.charAt(0) || "A"
									}`
								}
								alt="Avatar"
								className="w-10 h-10 rounded-full object-cover border-2 border-secondary"
							/>
							<span className="font-semibold text-gray-700 hidden md:block">
								{user?.full_name || "Admin"}
							</span>
						</button>
						{isProfileMenuOpen && (
							<div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
								<div className="px-4 py-3 border-b">
									<p className="text-sm font-semibold text-gray-800 truncate">
										{user?.full_name || "Admin"}
									</p>
									<p className="text-xs text-gray-500">Super Admin</p>
								</div>
								<div className="py-1">
									<Link
										to="/admin/settings"
										onClick={() => setIsProfileMenuOpen(false)}
										className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										<FiSettings size={16} /> Pengaturan Profil
									</Link>
									<a
										href="#"
										onClick={handleLogout}
										className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										<FiLogOut size={16} /> Logout
									</a>
								</div>
							</div>
						)}
					</div>
				</header>

				{/* Area Konten Halaman */}
				<main className="flex-1 overflow-y-auto p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
