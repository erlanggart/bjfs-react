// File: src/components/dashboard/AttendanceComparisonWidget.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	FiUsers,
	FiArrowRight,
	FiTrendingDown,
	FiChevronDown,
} from "react-icons/fi";

const AttendanceComparisonWidget = () => {
	const [sessions, setSessions] = useState([]);
	const [previousSession, setPreviousSession] = useState("");
	const [currentSession, setCurrentSession] = useState("");
	const [comparisonData, setComparisonData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [openBranch, setOpenBranch] = useState(null);

	useEffect(() => {
		// Ambil daftar semua sesi latihan yang pernah ada
		axios
			.get("/api/admin/list_all_attendance_sessions.php")
			.then((res) => {
				setSessions(res.data);
				// Set default value jika memungkinkan
				if (res.data.length > 1) {
					setPreviousSession(JSON.stringify(res.data[1]));
					setCurrentSession(JSON.stringify(res.data[0]));
				}
			})
			.catch((err) => console.error("Gagal memuat sesi latihan", err));
	}, []);

	const handleCompare = async () => {
		if (!previousSession || !currentSession) {
			alert("Harap pilih dua sesi untuk dibandingkan.");
			return;
		}
		setLoading(true);
		setComparisonData([]);

		const prev = JSON.parse(previousSession);
		const curr = JSON.parse(currentSession);

		try {
			const response = await axios.get(
				"/api/admin/dashboard_attendance_comparison.php",
				{
					params: {
						previous_date: prev.attendance_date,
						previous_schedule_id: prev.schedule_id,
						current_date: curr.attendance_date,
						current_schedule_id: curr.schedule_id,
					},
				}
			);
			setComparisonData(response.data);
		} catch (error) {
			console.error("Gagal membandingkan absensi", error);
		} finally {
			setLoading(false);
		}
	};

	const toggleBranch = (branchName) => {
		setOpenBranch((prev) => (prev === branchName ? null : branchName));
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-2xl font-bold text-primary mb-4">
				Analisis Kehadiran Antar Sesi
			</h2>

			{/* Filter */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
				<div className="md:col-span-1">
					<label className="text-sm font-semibold">Sesi Sebelumnya</label>
					<select
						value={previousSession}
						onChange={(e) => setPreviousSession(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						<option value="">Pilih Sesi</option>
						{sessions.map((s, i) => (
							<option key={i} value={JSON.stringify(s)}>
								{s.branch_name} - {s.age_group} (
								{new Date(s.attendance_date).toLocaleDateString("id-ID")})
							</option>
						))}
					</select>
				</div>
				<div className="md:col-span-1">
					<label className="text-sm font-semibold">Sesi Sekarang</label>
					<select
						value={currentSession}
						onChange={(e) => setCurrentSession(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						<option value="">Pilih Sesi</option>
						{sessions.map((s, i) => (
							<option key={i} value={JSON.stringify(s)}>
								{s.branch_name} - {s.age_group} (
								{new Date(s.attendance_date).toLocaleDateString("id-ID")})
							</option>
						))}
					</select>
				</div>
				<button
					onClick={handleCompare}
					disabled={loading}
					className="w-full md:w-auto px-4 py-2 bg-secondary text-white font-semibold rounded-md disabled:bg-gray-400"
				>
					{loading ? "Menganalisis..." : "Bandingkan"}
				</button>
			</div>

			{/* Hasil Analisis */}
			<div className="space-y-4">
				{comparisonData.map((branch) => (
					<div key={branch.branch_name} className="border rounded-lg p-4">
						<h3 className="font-bold text-lg text-gray-800">
							{branch.branch_name}
						</h3>
						<div className="flex items-center gap-4 mt-2">
							<div className="text-center">
								<p className="text-2xl font-bold">
									{branch.previous_attendance_count}
								</p>
								<p className="text-xs text-gray-500">Hadir Sesi Lalu</p>
							</div>
							<FiArrowRight className="text-gray-400" />
							<div className="text-center">
								<p className="text-2xl font-bold">
									{branch.current_attendance_count}
								</p>
								<p className="text-xs text-gray-500">Hadir Sesi Sekarang</p>
							</div>
							<div className="ml-auto text-center text-red-600">
								<p className="text-2xl font-bold">
									{branch.absent_members_count}
								</p>
								<p className="text-xs">Tidak Hadir</p>
							</div>
						</div>
						{branch.absent_members_count > 0 && (
							<div className="mt-3">
								<button
									onClick={() => toggleBranch(branch.branch_name)}
									className="text-xs text-blue-600 hover:underline flex items-center gap-1"
								>
									Lihat Daftar yang Tidak Hadir{" "}
									<FiChevronDown
										className={`transition-transform ${
											openBranch === branch.branch_name ? "rotate-180" : ""
										}`}
									/>
								</button>
								{openBranch === branch.branch_name && (
									<div className="mt-2 p-2 bg-red-50 rounded text-sm max-h-40 overflow-y-auto">
										<ul className="list-disc list-inside text-red-800">
											{branch.absent_members_names.map((name) => (
												<li key={name}>{name}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default AttendanceComparisonWidget;
