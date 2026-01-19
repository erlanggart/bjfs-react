// File: src/pages/branch-admin/AttendanceReportPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import {
	FiUsers,
	FiCheck,
	FiX,
	FiAlertTriangle,
	FiMinus,
	FiTrash2,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AttendanceReportPage = () => {
	const currentYear = new Date().getFullYear();
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);

	const [sessions, setSessions] = useState([]);
	const [selectedSession, setSelectedSession] = useState(null);
	const [report, setReport] = useState([]);
	const [loading, setLoading] = useState({ sessions: false, report: false });
	const [activeTab, setActiveTab] = useState("all"); // State sekarang bisa: all, attended, absent, hadir, sakit, izin, alpa

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

	const fetchSessions = async () => {
		setLoading((prev) => ({ ...prev, sessions: true }));
		setReport([]);
		setSelectedSession(null);
		try {
			const response = await api.get(
				`/api/attendance/monthly_summary?month=${month}&year=${year}`,
			);
			setSessions(response.data);
		} catch (error) {
			console.error("Gagal memuat ringkasan bulanan", error);
		} finally {
			setLoading((prev) => ({ ...prev, sessions: false }));
		}
	};

	useEffect(() => {
		fetchSessions();
	}, [month, year]);

	const handleSelectSession = async (session) => {
		setSelectedSession(session);
		setActiveTab("all");
		setLoading((prev) => ({ ...prev, report: true }));
		try {
			const response = await api.get(
				`/api/attendance/report?schedule_id=${session.schedule_id}&date=${session.attendance_date}`,
			);
			setReport(response.data);
		} catch (error) {
			console.error("Gagal memuat laporan detail", error);
		} finally {
			setLoading((prev) => ({ ...prev, report: false }));
		}
	};
	const handleDeleteReport = () => {
		if (!selectedSession) return;

		Swal.fire({
			title: "Hapus Laporan Absensi Ini?",
			text: `Semua data absensi untuk sesi ${selectedSession.age_group} pada tanggal ${selectedSession.attendance_date} akan dihapus permanen.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await api.post("/api/attendance/delete_by_session", {
						schedule_id: selectedSession.schedule_id,
						attendance_date: selectedSession.attendance_date,
					});
					Swal.fire("Dihapus!", "Laporan absensi telah dihapus.", "success");
					fetchSessions(); // Muat ulang daftar sesi
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal menghapus laporan.",
						"error",
					);
				}
			}
		});
	};

	// Logika untuk memfilter member berdasarkan tab dan sub-tab
	const displayedMembers = useMemo(() => {
		if (["hadir", "sakit", "izin", "alpa"].includes(activeTab)) {
			return report.filter((member) => member.attendance_status === activeTab);
		}
		if (activeTab === "attended") {
			return report.filter((member) => member.attendance_status !== null);
		}
		if (activeTab === "absent") {
			return report.filter((member) => member.attendance_status === null);
		}
		return report; // 'all'
	}, [report, activeTab]);

	// Menghitung jumlah untuk setiap status
	const statusCounts = useMemo(() => {
		return report.reduce(
			(acc, member) => {
				if (member.attendance_status) {
					acc[member.attendance_status] =
						(acc[member.attendance_status] || 0) + 1;
				}
				return acc;
			},
			{ hadir: 0, sakit: 0, izin: 0, alpa: 0 },
		);
	}, [report]);

	const StatusBadge = ({ status }) => {
		const styles = {
			hadir: {
				icon: <FiCheck />,
				text: "Hadir",
				color: "bg-green-100 text-green-800",
			},
			sakit: {
				icon: <FiAlertTriangle />,
				text: "Sakit",
				color: "bg-yellow-100 text-yellow-800",
			},
			izin: {
				icon: <FiAlertTriangle />,
				text: "Izin",
				color: "bg-blue-100 text-blue-800",
			},
			alpa: { icon: <FiX />, text: "Alpa", color: "bg-red-100 text-red-800" },
			default: {
				icon: <FiMinus />,
				text: "Belum Absen",
				color: "bg-gray-100 text-gray-800",
			},
		};
		const current = styles[status] || styles.default;
		return (
			<span
				className={`flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full ${current.color}`}
			>
				{current.icon} {current.text}
			</span>
		);
	};

	const TabButton = ({ tabName, label, count, activeCondition }) => (
		<button
			onClick={() => setActiveTab(tabName)}
			className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-2 ${
				activeCondition
					? "border-b-2 border-secondary text-secondary"
					: "text-gray-500 hover:text-gray-800"
			}`}
		>
			{label}{" "}
			<span
				className={`text-xs px-2 py-0.5 rounded-full ${
					activeCondition
						? "bg-secondary text-white"
						: "bg-gray-200 text-gray-600"
				}`}
			>
				{count}
			</span>
		</button>
	);

	const SubTabButton = ({ tabName, label, count }) => (
		<button
			onClick={() => setActiveTab(tabName)}
			className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5 ${
				activeTab === tabName
					? "bg-secondary text-white"
					: "text-gray-600 bg-gray-200 hover:bg-gray-300"
			}`}
		>
			{label} <span className="font-normal opacity-75">{count}</span>
		</button>
	);

	return (
		<div className="p-4 ">
			<div className="bg-primary p-4 mb-6 rounded-lg">
				<h1 className="text-2xl font-bold text-white">
					Laporan Absensi Bulanan
				</h1>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Bulan
					</label>
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
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Tahun
					</label>
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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-1">
					<h2 className="font-bold text-lg mb-2">Sesi Latihan Bulan Ini</h2>
					<div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
						{loading.sessions ? (
							<p>Memuat sesi...</p>
						) : Object.keys(sessions).length > 0 ? (
							Object.entries(
								sessions.reduce((acc, session) => {
									const date = session.attendance_date;
									if (!acc[date]) acc[date] = [];
									acc[date].push(session);
									return acc;
								}, {}),
							).map(([date, sessionsOnDate]) => {
								// Parse date safely - date should be in format YYYY-MM-DD from backend
								const parseDate = (dateStr) => {
									// Ensure we have valid date string
									if (!dateStr) return new Date();
									// Try parsing as YYYY-MM-DD or full ISO string
									const d = new Date(
										dateStr.includes("T") ? dateStr : dateStr + "T00:00:00",
									);
									// Fallback if invalid
									return isNaN(d.getTime()) ? new Date() : d;
								};
								return (
									<div key={date}>
										<p className="font-semibold text-gray-600 text-sm mb-1">
											{parseDate(date).toLocaleDateString("id-ID", {
												weekday: "long",
												day: "numeric",
												month: "long",
											})}
										</p>
										<div className="space-y-1">
											{sessionsOnDate.map((session) => {
												// PERBAIKAN: Logika untuk menampilkan rentang usia
												let ageRangeText = "";
												if (session.min_age && session.max_age) {
													ageRangeText = ` (Usia ${session.min_age}-${session.max_age} Thn)`;
												} else if (session.min_age) {
													ageRangeText = ` (Usia ${session.min_age}+ Thn)`;
												} else if (session.max_age) {
													ageRangeText = ` (Usia s/d ${session.max_age} Thn)`;
												}

												return (
													<button
														key={session.schedule_id}
														onClick={() => handleSelectSession(session)}
														className={`w-full text-left p-2 rounded-md text-sm ${
															selectedSession?.schedule_id ===
																session.schedule_id &&
															selectedSession?.attendance_date ===
																session.attendance_date
																? "bg-secondary text-white"
																: "bg-white hover:bg-gray-50"
														}`}
													>
														<span className="font-semibold">
															{session.age_group}
														</span>
														<span className="text-xs opacity-75">
															{ageRangeText}
														</span>
														<span className="block text-xs">
															({session.start_time.slice(0, 5)})
														</span>
													</button>
												);
											})}
										</div>
									</div>
								);
							})
						) : (
							<p className="text-sm text-gray-500">
								Tidak ada data absensi di bulan ini.
							</p>
						)}
					</div>
				</div>

				<div className="md:col-span-2">
					<div className="flex justify-between">
						<h2 className="font-bold text-lg mb-2">Detail Kehadiran</h2>
						{selectedSession && (
							<button
								onClick={handleDeleteReport}
								className="flex jutify-end items-center gap-2 text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-md hover:bg-red-200 mb-2"
							>
								<FiTrash2 /> Hapus Laporan Ini
							</button>
						)}
					</div>
					<div className="bg-white rounded-lg shadow-sm min-h-[60vh]">
						{selectedSession ? (
							loading.report ? (
								<p className="p-4">Memuat laporan...</p>
							) : (
								<>
									<div className="border-b border-secondary flex overflow-auto">
										<TabButton
											tabName="all"
											label="Semua"
											count={report.length}
											activeCondition={activeTab === "all"}
										/>
										<TabButton
											tabName="attended"
											label="Sudah Absen"
											count={report.filter((m) => m.attendance_status).length}
											activeCondition={[
												"attended",
												"hadir",
												"sakit",
												"izin",
												"alpa",
											].includes(activeTab)}
										/>
										<TabButton
											tabName="absent"
											label="Belum Absen"
											count={report.filter((m) => !m.attendance_status).length}
											activeCondition={activeTab === "absent"}
										/>
									</div>

									{/* Sub-tabs Section */}
									{["attended", "hadir", "sakit", "izin", "alpa"].includes(
										activeTab,
									) && (
										<div className="border-b border-secondary flex items-center p-2 bg-gray-50 space-x-2 overflow-y-auto">
											<SubTabButton
												tabName="attended"
												label="Semua"
												count={report.filter((m) => m.attendance_status).length}
											/>
											<SubTabButton
												tabName="hadir"
												label="Hadir"
												count={statusCounts.hadir}
											/>
											<SubTabButton
												tabName="sakit"
												label="Sakit"
												count={statusCounts.sakit}
											/>
											<SubTabButton
												tabName="izin"
												label="Izin"
												count={statusCounts.izin}
											/>
											<SubTabButton
												tabName="alpa"
												label="Alpa"
												count={statusCounts.alpa}
											/>
										</div>
									)}

									<div className="space-y-2 p-4">
										{displayedMembers.map((member) => (
											<div
												key={member.id}
												className="p-3 border-b flex justify-between items-center"
											>
												<span className="font-semibold">
													{member.full_name}
												</span>
												<StatusBadge status={member.attendance_status} />
											</div>
										))}
									</div>
								</>
							)
						) : (
							<p className="text-center text-gray-500 pt-10">
								Pilih salah satu sesi latihan untuk melihat detail kehadiran.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AttendanceReportPage;
