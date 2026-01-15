// File: src/components/dashboard/MemberActivityWidget.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiUserPlus, FiUserX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const AccordionBranchList = ({ title, icon, dataByBranch }) => {
	const [openBranch, setOpenBranch] = useState(null);
	const toggleBranch = (branchName) =>
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	return (
		<div className="bg-white p-4 rounded-md shadow-md">
			<h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
				{icon} {title}
			</h3>
			<div className="space-y-2 max-h-96 overflow-y-auto pr-2">
				{Object.keys(dataByBranch).length > 0 ? (
					Object.entries(dataByBranch).map(([branch, members]) => (
						<div key={branch} className="bg-slate-100 rounded-lg">
							<button
								onClick={() => toggleBranch(branch)}
								className="w-full flex justify-between items-center p-3 hover:bg-slate-200 rounded-lg"
							>
								<span className="font-bold text-gray-700">{branch}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
										{members.length}
									</span>
									<FiChevronDown
										className={`transition-transform ${
											openBranch === branch ? "rotate-180" : ""
										}`}
									/>
								</div>
							</button>
							{openBranch === branch && (
								<div className="p-3 border-t">
									<ul className="space-y-3">
										{members.map((m) => (
											<li key={m.id}>
												<Link
													to={`/member/${m.id}`}
													className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md"
												>
													<img
														src={
															m.avatar ||
															`https://placehold.co/40x40/E0E0E0/757575?text=${m.full_name.charAt(
																0
															)}`
														}
														alt={m.full_name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<span className="text-sm text-gray-800">
														{m.full_name}
													</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						Tidak ada data.
					</p>
				)}
			</div>
		</div>
	);
};

const groupByBranch = (data) => {
	if (!Array.isArray(data)) return {};
	return data.reduce((acc, item) => {
		const branch = item.branch_name || "Tanpa Cabang";
		if (!acc[branch]) acc[branch] = [];
		acc[branch].push(item);
		return acc;
	}, {});
};

const MemberActivityWidget = () => {
	const currentYear = new Date().getFullYear();
	const [data, setData] = useState({
		new_members: [],
		deactivated_members: [],
	});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);
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
	const selectedMonthName = months.find((m) => m.value == month)?.name;

	const fetchData = useCallback(() => {
		axios
			.get("/api/admin/dashboard_activity_data.php", {
				params: { month, year },
			})
			.then((res) => setData(res.data))
			.catch((err) => console.error("Gagal memuat data aktivitas", err));
	}, [month, year]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const newMembersByBranch = groupByBranch(data.new_members);
	const deactivatedMembersByBranch = groupByBranch(data.deactivated_members);

	return (
		<div className="">
			<div className="flex flex-col bg-white  p-4 rounded-md shadow-md sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<h1 className="text-xl font-semibold text-primary pl-2">
					Aktivitas Member
				</h1>
				<div className="flex gap-2 w-full sm:w-xs">
					<div className="w-full bg-slate-100 p-2 rounded-md">
						<select
							value={month}
							onChange={(e) => setMonth(e.target.value)}
							className="w-full"
						>
							<option value="">Pilih Bulan</option>
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
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<AccordionBranchList
					title={`Member Baru (${selectedMonthName} ${year})`}
					icon={<FiUserPlus />}
					dataByBranch={newMembersByBranch}
				/>
				<AccordionBranchList
					title={`Member Nonaktif (${selectedMonthName} ${year})`}
					icon={<FiUserX />}
					dataByBranch={deactivatedMembersByBranch}
				/>
			</div>
		</div>
	);
};
export default MemberActivityWidget;
