import React from "react";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
	return (
		<header className="bg-[var(--color-primary)] shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
				<div className="flex items-center gap-2">
					<img src="/bjfs_logo.svg" alt="Logo BJFS" className="w-10 h-10" />
					<span className="text-white text-lg font-bold">Bogor Junior</span>
				</div>
				<Link
					to="/login"
					className="bg-secondary text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity"
				>
					Login
				</Link>
				{/* <div className="flex space-x-6 text-gray-600 font-semibold">
					<NavLink
						to="/"
						className={({ isActive }) =>
							isActive
								? "text-blue-600"
								: "hover:text-blue-600 transition-colors"
						}
					>
						Home
					</NavLink>
					<NavLink
						to="/articles"
						className={({ isActive }) =>
							isActive
								? "text-blue-600"
								: "hover:text-blue-600 transition-colors"
						}
					>
						Artikel
					</NavLink>
					
				</div> */}
			</nav>
		</header>
	);
};

export default Header;
