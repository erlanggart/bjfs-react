import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
	FiClipboard,
	FiCalendar,
	FiFileText,
	FiUsers,
	FiSettings,
	FiDollarSign,
	FiAward,
	FiMessageSquare,
} from "react-icons/fi";

const logoUrl = "/bjfs_logo.svg"; // Pastikan path logo ini benar

const BranchAdminLayout = () => {
	const navigate = useNavigate();
	const [isScrolled, setIsScrolled] = useState(false);
	const mainContentRef = useRef(null);

	// Efek untuk mendeteksi scroll pada area konten utama
	useEffect(() => {
		const mainEl = mainContentRef.current;
		if (!mainEl) return;

		const handleScroll = () => {
			// Jika scroll lebih dari 10px, set isScrolled menjadi true
			setIsScrolled(mainEl.scrollTop > 10);
		};

		mainEl.addEventListener("scroll", handleScroll);
		return () => mainEl.removeEventListener("scroll", handleScroll);
	}, []);

	// Komponen untuk item navigasi
	const NavItem = ({ to, icon: Icon, label }) => (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors duration-200 ${
					isActive
						? "bg-secondary text-white"
						: "text-gray-400 hover:bg-white/20 hover:text-white"
				}`
			}
		>
			<Icon size={20} />
			<span
				className={`text-[10px] font-semibold transition-all duration-300 ${
					isScrolled ? "hidden" : "block"
				}`}
			>
				{label}
			</span>
		</NavLink>
	);

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			<header className="bg-primary shadow-md px-4 py-3 sticky top-0 z-40 transition-all duration-300">
				{/* Logo Section (akan hilang saat scroll) */}
				<div
					className={`flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden ${
						isScrolled ? "h-0 opacity-0" : "h-8 opacity-100 mb-2"
					}`}
				>
					<img
						src={logoUrl}
						alt="Logo BJFS"
						className="w-8 h-8 cursor-pointer"
						onClick={() => navigate("/portal")}
					/>
					<span className="font-bold text-lg text-white">
						Bogor Junior Membership
					</span>
				</div>

				{/* Navigasi (akan tetap ada) */}
				<nav className="flex items-center justify-around gap-2 sm:gap-4">
					<NavItem to="/profil" icon={FiClipboard} label="Absensi" />
					<NavItem to="/rapor" icon={FiFileText} label="Rapor" />
					<NavItem to="/pembayaran" icon={FiAward} label="Membership" />
					<NavItem
						to="/feedback-saya"
						icon={FiMessageSquare}
						label="Feedback"
					/>
					<NavItem to="/member/settings" icon={FiSettings} label="Pengaturan" />
				</nav>
			</header>

			{/* Konten Halaman */}
			<main ref={mainContentRef} className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default BranchAdminLayout;
