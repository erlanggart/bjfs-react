// File: src/components/dashboard/LatestAttendanceWidget.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FiCalendar, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
	const styles = {
		hadir: { text: "Hadir", color: "bg-green-100 text-green-800" },
		sakit: { text: "Sakit", color: "bg-yellow-100 text-yellow-800" },
		izin: { text: "Izin", color: "bg-blue-100 text-blue-800" },
		alpa: { text: "Alpa", color: "bg-red-100 text-red-800" },
	};
	const current = styles[status] || { text: "N/A", color: "bg-gray-100" };
	return (
		<span
			className={`text-xs px-2 py-1 rounded-full font-semibold ${current.color}`}
		>
			{current.text}
		</span>
	);
};

const LatestAttendanceWidget = () => {
	const [attendance, setAttendance] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openBranch, setOpenBranch] = useState(null);

	useEffect(() => {
		axios
			.get("/api/admin/dashboard_latest_attendance.php")
			.then((res) => setAttendance(res.data))
			.catch((err) => console.error("Gagal memuat absensi terbaru", err))
			.finally(() => setLoading(false));
	}, []);

	const groupedByBranch = useMemo(() => {
		if (!Array.isArray(attendance)) return {};
		return attendance.reduce((acc, record) => {
			const branch = record.branch_name || "Tanpa Cabang";
			if (!acc[branch]) acc[branch] = [];
			acc[branch].push(record);
			return acc;
		}, {});
	}, [attendance]);

	const toggleBranch = (branchName) => {
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
				<FiCalendar /> Aktivitas Absensi Terbaru
			</h2>
			<div className="space-y-2 max-h-96 overflow-y-auto pr-2">
				{loading ? (
					<p>Memuat...</p>
				) : Object.keys(groupedByBranch).length > 0 ? (
					Object.entries(groupedByBranch).map(([branchName, records]) => (
						<div key={branchName} className="border rounded-lg">
							<button
								onClick={() => toggleBranch(branchName)}
								className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100"
							>
								<span className="font-bold text-gray-700">{branchName}</span>
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
										{records.length}
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
										{records.map((record, index) => (
											<li
												key={index}
												className="flex justify-between items-center"
											>
												<Link
													to={`/member/${record.member_id}`}
													className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-md flex-grow"
												>
													<img
														src={
															record.member_avatar ||
															`https://placehold.co/40x40/E0E0E0/757575?text=${record.member_name.charAt(
																0
															)}`
														}
														alt={record.member_name}
														className="w-10 h-10 rounded-full object-cover"
													/>
													<div>
														<p className="text-sm font-semibold text-gray-800">
															{record.member_name}
														</p>
														<p className="text-xs text-gray-500">
															{new Date(
																record.attendance_date
															).toLocaleDateString("id-ID", {
																day: "numeric",
																month: "short",
															})}
														</p>
													</div>
												</Link>
												<StatusBadge status={record.status} />
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						Tidak ada aktivitas absensi terbaru.
					</p>
				)}
			</div>
		</div>
	);
};

export default LatestAttendanceWidget;
