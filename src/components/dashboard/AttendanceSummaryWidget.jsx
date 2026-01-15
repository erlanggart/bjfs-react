// File: src/components/dashboard/AttendanceSummaryWidget.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
	FiCalendar,
	FiChevronDown,
	FiCheckCircle,
	FiAlertTriangle,
	FiInfo,
	FiXCircle,
	FiMinusCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const AttendanceSummaryWidget = () => {
	const currentYear = new Date().getFullYear();
	const [sessionsByBranch, setSessionsByBranch] = useState({});
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);
	const [loading, setLoading] = useState(true);

	// State untuk mengelola detail yang sedang terbuka
	const [expandedSessionKey, setExpandedSessionKey] = useState(null);
	// State untuk menyimpan daftar member yang dimuat secara on-demand
	const [detailedList, setDetailedList] = useState({
		key: null,
		members: [],
		loading: false,
	});

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

	// Fungsi untuk mengambil data rangkuman sesi
	const fetchSummary = useCallback(() => {
		setLoading(true);
		setExpandedSessionKey(null); // Tutup semua detail saat filter berubah
		setDetailedList({ key: null, members: [], loading: false }); // Reset detail list
		axios
			.get("/api/admin/dashboard_session_summary.php", {
				params: { month, year },
			})
			.then((res) => {
				setSessionsByBranch(res.data || {});
			})
			.catch((err) => {
				console.error("Gagal memuat rangkuman sesi", err);
				setSessionsByBranch({});
			})
			.finally(() => setLoading(false));
	}, [month, year]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	// Fungsi untuk mengambil daftar member detail saat tombol status diklik
	const fetchDetailedList = async (session, status) => {
		const detailKey = `${session.session_key}_${status}`;
		// Jika mengklik tombol yang sama lagi, tutup daftar detail
		if (detailedList.key === detailKey) {
			setDetailedList({ key: null, members: [], loading: false });
			return;
		}

		setDetailedList({ key: detailKey, members: [], loading: true });
		try {
			const response = await axios.get("/api/admin/get_session_attendees.php", {
				params: {
					schedule_id: session.schedule_id,
					date: session.attendance_date,
					status: status,
				},
			});
			setDetailedList({
				key: detailKey,
				members: response.data || [],
				loading: false,
			});
		} catch (error) {
			console.error("Gagal memuat detail member", error);
			setDetailedList({ key: detailKey, members: [], loading: false });
		}
	};

	// Komponen kecil untuk setiap baris statistik
	const StatItem = ({ session, status, icon, label, count, color }) => (
		<button
			onClick={() => fetchDetailedList(session, status)}
			className={`w-full flex justify-between items-center p-2 rounded-md transition-colors ${color} hover:opacity-90`}
		>
			<div className="flex items-center gap-2 text-sm font-semibold">
				{icon} {label}
			</div>
			<span className="font-bold">{count}</span>
		</button>
	);

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
				<h2 className="text-2xl font-bold text-primary flex items-center gap-2">
					<FiCalendar /> Rangkuman Absensi
				</h2>
				<div className="flex gap-2 w-full sm:w-auto">
					<select
						value={month}
						onChange={(e) => setMonth(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						{months.map((m) => (
							<option key={m.value} value={m.value}>
								{m.name}
							</option>
						))}
					</select>
					<select
						value={year}
						onChange={(e) => setYear(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="space-y-4 max-h-[40rem] overflow-y-auto pr-2">
				{loading ? (
					<p className="text-center text-gray-500">Memuat data sesi...</p>
				) : Object.keys(sessionsByBranch).length > 0 ? (
					Object.entries(sessionsByBranch).map(([branchName, sessions]) => (
						<div key={branchName}>
							<h3 className="font-bold text-lg text-gray-700 mb-2 border-b pb-1">
								{branchName}
							</h3>
							<div className="space-y-2">
								{sessions.map((session) => (
									<div key={session.session_key} className="border rounded-lg">
										<button
											onClick={() =>
												setExpandedSessionKey((prev) =>
													prev === session.session_key
														? null
														: session.session_key
												)
											}
											className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-50"
										>
											<div>
												<p className="font-bold text-gray-800">
													{new Date(
														session.attendance_date + "T00:00:00"
													).toLocaleDateString("id-ID", {
														weekday: "long",
														day: "numeric",
														month: "long",
													})}
												</p>
												<p className="text-sm text-gray-600">
													{session.age_group}
												</p>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-semibold">
													{session.counts.hadir}/{session.total_active_members}
												</span>
												<FiChevronDown
													className={`transition-transform ${
														expandedSessionKey === session.session_key
															? "rotate-180"
															: ""
													}`}
												/>
											</div>
										</button>
										{expandedSessionKey === session.session_key && (
											<div className="p-4 border-t bg-gray-50 space-y-2">
												<StatItem
													session={session}
													status="hadir"
													icon={<FiCheckCircle />}
													label="Hadir"
													count={session.counts.hadir}
													color="bg-green-100 text-green-800"
												/>
												<StatItem
													session={session}
													status="sakit"
													icon={<FiAlertTriangle />}
													label="Sakit"
													count={session.counts.sakit}
													color="bg-yellow-100 text-yellow-800"
												/>
												<StatItem
													session={session}
													status="izin"
													icon={<FiInfo />}
													label="Izin"
													count={session.counts.izin}
													color="bg-blue-100 text-blue-800"
												/>
												<StatItem
													session={session}
													status="alpa"
													icon={<FiXCircle />}
													label="Alpa"
													count={session.counts.alpa}
													color="bg-red-100 text-red-800"
												/>
												<StatItem
													session={session}
													status="unrecorded"
													icon={<FiMinusCircle />}
													label="Belum Diabsen"
													count={session.counts.unrecorded}
													color="bg-gray-200 text-gray-600"
												/>

												{detailedList.key?.startsWith(session.session_key) && (
													<div className="mt-2 p-2 bg-white rounded-md border">
														{detailedList.loading ? (
															<p className="text-center text-sm">
																Memuat daftar...
															</p>
														) : detailedList.members.length > 0 ? (
															<ul className="space-y-2 max-h-40 overflow-y-auto">
																{detailedList.members.map((member) => (
																	<li key={member.id}>
																		<Link
																			to={`/admin/member/${member.id}`}
																			className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded"
																		>
																			<img
																				src={
																					member.avatar ||
																					`https://placehold.co/32x32/E0E0E0/757575?text=${member.full_name.charAt(
																						0
																					)}`
																				}
																				alt={member.full_name}
																				className="w-8 h-8 rounded-full object-cover"
																			/>
																			<span className="text-sm font-semibold">
																				{member.full_name}
																			</span>
																		</Link>
																	</li>
																))}
															</ul>
														) : (
															<p className="text-center text-sm text-gray-500 py-2">
																Tidak ada member dengan status ini.
															</p>
														)}
													</div>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					))
				) : (
					<p className="text-center text-gray-500 py-8">
						Tidak ada data absensi yang tercatat di bulan ini.
					</p>
				)}
			</div>
		</div>
	);
};

export default AttendanceSummaryWidget;
