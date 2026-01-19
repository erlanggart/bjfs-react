// File: src/components/dashboard/ReportAnalyticsWidget.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
	FiFileText,
	FiCheckCircle,
	FiAlertTriangle,
	FiChevronDown,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Komponen untuk menampilkan daftar member di dalam widget
const MemberListColumn = ({ title, members, icon }) => {
	const [openBranch, setOpenBranch] = useState(null);

	const groupedByBranch = useMemo(() => {
		if (!Array.isArray(members)) return {};
		return members.reduce((acc, member) => {
			const branch = member.branch_name || "Tanpa Cabang";
			if (!acc[branch]) acc[branch] = [];
			acc[branch].push(member);
			return acc;
		}, {});
	}, [members]);

	const toggleBranch = (branchName) => {
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	};

	return (
		<div>
			<h3 className="text-lg font-bold mb-3 flex items-center gap-2">
				{icon} {title} ({members.length})
			</h3>
			<div className="space-y-2 max-h-80 overflow-y-auto pr-2">
				{members.length > 0 ? (
					Object.entries(groupedByBranch).map(([branchName, branchMembers]) => (
						<div key={branchName} className="bg-slate-100 rounded-lg">
							<button
								onClick={() => toggleBranch(branchName)}
								className="w-full flex justify-between items-center p-3  hover:bg-slate-200 rounded-lg"
							>
								<span className="font-bold text-gray-700">{branchName}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
										{branchMembers.length}
									</span>
									<FiChevronDown
										className={`transition-transform ${
											openBranch === branchName ? "rotate-180" : ""
										}`}
									/>
								</div>
							</button>
							{openBranch === branchName && (
								<div className="p-3 border-t">
									<ul className="space-y-3">
										{branchMembers.map((member) => (
											<li key={member.id}>
												<Link
													to={`/admin/member/${member.id}`}
													className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
												>
													<img
														src={
															member.avatar
																? `${API_BASE_URL}${member.avatar}`
																: `https://placehold.co/40x40/E0E0E0/757575?text=${member.full_name.charAt(
																		0,
																	)}`
														}
														alt={member.full_name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<p className="text-sm font-semibold text-gray-800">
														{member.full_name}
													</p>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))
				) : (
					<p className="text-sm text-gray-400 text-center py-4">
						Tidak ada data.
					</p>
				)}
			</div>
		</div>
	);
};

const ReportAnalyticsWidget = () => {
	const currentYear = new Date().getFullYear();
	const [reported, setReported] = useState([]);
	const [unreported, setUnreported] = useState([]);
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);
	const [loading, setLoading] = useState(true);

	const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
	const months = [
		{ value: 1, name: "Januari" },
		{ value: 2, name: "Februari" },
		{ value: 3, name: "Maret" },
		{ value: 4, name: "April" },
		{ value: 5, name: "Mei" },
		{ value: 6, name: "Juni" },
		{ value: 7, name: "Juli" },
		{ value: 8, name: "Agustus" },
		{ value: 9, name: "September" },
		{ value: 10, name: "Oktober" },
		{ value: 11, name: "November" },
		{ value: 12, name: "Desember" },
	];

	const fetchData = useCallback(() => {
		setLoading(true);
		axios
			.get("/api/admin/dashboard-report-status", {
				params: { month, year },
			})
			.then((res) => {
				setReported(res.data.reported_members || []);
				setUnreported(res.data.unreported_members || []);
			})
			.catch((err) => {
				console.error("Gagal memuat data rapor", err);
				setReported([]);
				setUnreported([]);
			})
			.finally(() => setLoading(false));
	}, [month, year]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<div className="">
			<div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<h1 className="text-xl font-semibold text-primary flex items-center gap-2">
					<FiFileText /> Status Rapor Member Aktif
				</h1>
				<div className="flex gap-2 w-full sm:w-xs">
					<div className="w-full bg-slate-100 p-2 rounded-md">
						<select
							value={month}
							onChange={(e) => setMonth(e.target.value)}
							className="w-full"
						>
							{months.map((m) => (
								<option key={m.value} value={m.value}>
									{m.name}
								</option>
							))}
						</select>
					</div>
					<div className="w-full bg-slate-100 p-2 rounded-md">
						<select
							value={year}
							onChange={(e) => setYear(e.target.value)}
							className="w-full"
						>
							{years.map((y) => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{loading ? (
				<p className="text-center">Memuat data...</p>
			) : (
				<div className="bg-white p-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg shadow-md">
					<MemberListColumn
						title="Sudah Diberi Rapor"
						members={reported}
						icon={<FiCheckCircle className="text-green-600" />}
					/>
					<MemberListColumn
						title="Belum Diberi Rapor"
						members={unreported}
						icon={<FiAlertTriangle className="text-yellow-600" />}
					/>
				</div>
			)}
		</div>
	);
};

export default ReportAnalyticsWidget;
