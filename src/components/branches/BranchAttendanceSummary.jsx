// File: src/components/branches/BranchAttendanceSummary.jsx
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
	FiClock,
	FiMapPin,
	FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BranchAttendanceSummary = ({ branchId, branchName }) => {
	const currentYear = new Date().getFullYear();
	const [sessions, setSessions] = useState([]);
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

	// Fungsi untuk mengambil data rangkuman sesi cabang
	const fetchSummary = useCallback(() => {
		if (!branchId) return;

		setLoading(true);
		setExpandedSessionKey(null);
		setDetailedList({ key: null, members: [], loading: false });

		axios
			.get("/api/branches/attendance_summary.php", {
				params: { branch_id: branchId, month, year },
			})
			.then((res) => {
				setSessions(res.data.sessions || []);
			})
			.catch((err) => {
				console.error("Gagal memuat rangkuman sesi cabang", err);
				setSessions([]);
			})
			.finally(() => setLoading(false));
	}, [branchId, month, year]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	// Fungsi untuk mengambil daftar member detail saat tombol status diklik
	const fetchDetailedList = async (session, status) => {
		const detailKey = `${session.session_key}_${status}`;

		if (detailedList.key === detailKey) {
			setDetailedList({ key: null, members: [], loading: false });
			return;
		}

		setDetailedList({ key: detailKey, members: [], loading: true });
		try {
			const response = await axios.get("/api/branches/session_attendees.php", {
				params: {
					schedule_id: session.schedule_id,
					date: session.attendance_date,
					status: status,
					branch_id: branchId,
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

	// Komponen untuk menampilkan admin yang absen
	const AdminAttendanceItem = ({ admin }) => {
		const getStatusColor = (status) => {
			switch (status) {
				case "hadir":
					return "bg-green-100 text-green-800 border-green-200";
				case "sakit":
					return "bg-yellow-100 text-yellow-800 border-yellow-200";
				case "izin":
					return "bg-blue-100 text-blue-800 border-blue-200";
				default:
					return "bg-gray-100 text-gray-800 border-gray-200";
			}
		};

		const getStatusIcon = (status) => {
			switch (status) {
				case "hadir":
					return <FiCheckCircle />;
				case "sakit":
					return <FiAlertTriangle />;
				case "izin":
					return <FiInfo />;
				default:
					return <FiUser />;
			}
		};

		const getStatusLabel = (status) => {
			switch (status) {
				case "hadir":
					return "HADIR";
				case "sakit":
					return "SAKIT";
				case "izin":
					return "IZIN";
				default:
					return status.toUpperCase();
			}
		};

		const formatTime = (dateString) => {
			return new Date(dateString).toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
			});
		};

		return (
			<div
				className={`flex items-center justify-between p-3 bg-white rounded-lg border-2 shadow-sm ${getStatusColor(
					admin.status,
				)}`}
			>
				<div className="flex items-center gap-3">
					<img
						src={
							admin.avatar
								? `${API_BASE_URL}${admin.avatar}`
								: `https://placehold.co/40x40/E0E0E0/757575?text=${admin.full_name.charAt(
										0,
									)}`
						}
						alt={admin.full_name}
						className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
					/>
					<div>
						<p className="text-sm font-bold text-gray-800">{admin.full_name}</p>
						<div className="flex items-center gap-2 text-xs text-gray-600">
							<span>Absen: {formatTime(admin.created_at)}</span>
						</div>
						{admin.notes && (
							<p className="text-xs text-gray-600 mt-1 italic">
								"{admin.notes}"
							</p>
						)}
					</div>
				</div>
				<div className="text-right">
					<span
						className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(
							admin.status,
						)}`}
					>
						{getStatusIcon(admin.status)} {getStatusLabel(admin.status)}
					</span>
				</div>
			</div>
		);
	};

	// Komponen kecil untuk setiap baris statistik member
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
					<FiCalendar /> Absensi {branchName}
				</h2>
				<div className="flex gap-2 w-full sm:w-auto">
					<select
						value={month}
						onChange={(e) => setMonth(e.target.value)}
						className="w-full p-2 border rounded-md text-slate-600"
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
						className="w-full p-2 border rounded-md text-slate-600"
					>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="space-y-4 max-h-[50rem] overflow-y-auto pr-2">
				{loading ? (
					<p className="text-center text-gray-500">Memuat data sesi...</p>
				) : sessions.length > 0 ? (
					sessions.map((session) => (
						<div key={session.session_key} className="border rounded-lg">
							<button
								onClick={() =>
									setExpandedSessionKey((prev) =>
										prev === session.session_key ? null : session.session_key,
									)
								}
								className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
							>
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-2">
										<p className="font-bold text-gray-800">
											{new Date(
												session.attendance_date + "T00:00:00",
											).toLocaleDateString("id-ID", {
												weekday: "long",
												day: "numeric",
												month: "long",
											})}
										</p>
										<span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
											{session.age_group}
										</span>
									</div>
									<div className="flex items-center gap-4 text-sm text-gray-600">
										<div className="flex items-center gap-1">
											<FiClock size={14} />
											{session.start_time.slice(0, 5)} -{" "}
											{session.end_time.slice(0, 5)}
										</div>
										{session.location && (
											<div className="flex items-center gap-1">
												<FiMapPin size={14} />
												{session.location}
											</div>
										)}
									</div>
								</div>
								<div className="flex items-center gap-4">
									{/* Admin attendance indicator */}
									{(session.admin_attendance?.length > 0 ||
										session.absent_admins?.length > 0) && (
										<div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
											<FiUser size={12} />
											{session.admin_attendance?.length || 0}/
											{(session.admin_attendance?.length || 0) +
												(session.absent_admins?.length || 0)}{" "}
											pelatih
										</div>
									)}
									<span className="text-sm font-semibold">
										{session.member_counts.hadir}/{session.total_active_members}
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
								<div className="p-4 border-t bg-gray-50 space-y-4">
									{/* Admin Attendance Section */}
									<div>
										<h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
											<FiUser /> Kehadiran Admin/Pelatih
										</h4>

										{/* Admin yang sudah absen */}
										{session.admin_attendance &&
										session.admin_attendance.length > 0 ? (
											<div className="space-y-2 mb-4">
												{session.admin_attendance.map((admin, index) => (
													<AdminAttendanceItem key={index} admin={admin} />
												))}
											</div>
										) : (
											<div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4">
												<p className="text-sm text-amber-700 flex items-center gap-2">
													<FiAlertTriangle className="text-amber-500" />
													Belum ada admin/pelatih yang melakukan absen pada sesi
													ini
												</p>
											</div>
										)}

										{/* Admin yang belum absen */}
										{session.absent_admins &&
											session.absent_admins.length > 0 && (
												<div className="mt-3">
													<h5 className="text-sm font-semibold text-gray-600 mb-2">
														Admin/Pelatih Belum Absen:
													</h5>
													<div className="flex flex-wrap gap-2">
														{session.absent_admins.map((admin, index) => (
															<div
																key={index}
																className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200"
															>
																<img
																	src={
																		admin.avatar
																			? `${API_BASE_URL}${admin.avatar}`
																			: `https://placehold.co/24x24/E0E0E0/757575?text=${admin.full_name.charAt(
																					0,
																				)}`
																	}
																	alt={admin.full_name}
																	className="w-6 h-6 rounded-full object-cover"
																/>
																<span className="text-xs font-medium text-gray-700">
																	{admin.full_name}
																</span>
																<FiMinusCircle
																	className="text-gray-400"
																	size={14}
																/>
															</div>
														))}
													</div>
												</div>
											)}
									</div>

									{/* Member Attendance Time Info */}
									{session.attendance_time_info &&
										(session.attendance_time_info.first_attendance ||
											session.attendance_time_info.last_attendance) && (
											<div className="mb-4">
												<h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
													<FiClock /> Waktu Absen Member
												</h4>
												<div className="bg-white p-3 rounded-md border space-y-2">
													{session.attendance_time_info.first_attendance && (
														<div className="flex items-center gap-2 text-sm">
															<span className="text-gray-600">
																Absen Pertama:
															</span>
															<span className="font-semibold text-green-600">
																{new Date(
																	session.attendance_time_info.first_attendance,
																).toLocaleTimeString("id-ID", {
																	hour: "2-digit",
																	minute: "2-digit",
																})}
															</span>
														</div>
													)}
													{session.attendance_time_info.last_attendance && (
														<div className="flex items-center gap-2 text-sm">
															<span className="text-gray-600">
																Absen Terakhir:
															</span>
															<span className="font-semibold text-blue-600">
																{new Date(
																	session.attendance_time_info.last_attendance,
																).toLocaleTimeString("id-ID", {
																	hour: "2-digit",
																	minute: "2-digit",
																})}
															</span>
														</div>
													)}
												</div>
											</div>
										)}

									{/* Member Attendance Statistics */}
									<div>
										<h4 className="font-semibold text-gray-700 mb-2">
											Statistik Member
										</h4>
										<div className="space-y-2">
											<StatItem
												session={session}
												status="hadir"
												icon={<FiCheckCircle />}
												label="Hadir"
												count={session.member_counts.hadir}
												color="bg-green-100 text-green-800"
											/>
											<StatItem
												session={session}
												status="sakit"
												icon={<FiAlertTriangle />}
												label="Sakit"
												count={session.member_counts.sakit}
												color="bg-yellow-100 text-yellow-800"
											/>
											<StatItem
												session={session}
												status="izin"
												icon={<FiInfo />}
												label="Izin"
												count={session.member_counts.izin}
												color="bg-blue-100 text-blue-800"
											/>
											<StatItem
												session={session}
												status="alpa"
												icon={<FiXCircle />}
												label="Alpa"
												count={session.member_counts.alpa}
												color="bg-red-100 text-red-800"
											/>
											<StatItem
												session={session}
												status="unrecorded"
												icon={<FiMinusCircle />}
												label="Belum Diabsen"
												count={session.member_counts.unrecorded}
												color="bg-gray-200 text-gray-600"
											/>
										</div>

										{/* Detailed Member List */}
										{detailedList.key?.startsWith(session.session_key) && (
											<div className="mt-4 p-3 bg-white rounded-md border">
												{detailedList.loading ? (
													<p className="text-center text-sm">
														Memuat daftar...
													</p>
												) : detailedList.members.length > 0 ? (
													<div>
														<p className="text-sm font-semibold mb-2">
															Daftar Member:
														</p>
														<ul className="space-y-2 max-h-40 overflow-y-auto">
															{detailedList.members.map((member) => (
																<li key={member.id}>
																	<Link
																		to={`/admin/member/${member.id}`}
																		className="flex items-center justify-between hover:bg-gray-100 p-2 rounded transition-colors"
																	>
																		<div className="flex items-center gap-2">
																			<img
																				src={
																					member.avatar
																						? `${API_BASE_URL}${member.avatar}`
																						: `https://placehold.co/32x32/E0E0E0/757575?text=${member.full_name.charAt(
																								0,
																							)}`
																				}
																				alt={member.full_name}
																				className="w-8 h-8 rounded-full object-cover"
																			/>
																			<div>
																				<span className="text-sm font-semibold block">
																					{member.full_name}
																				</span>
																				{member.recorded_at && (
																					<span className="text-xs text-gray-500 flex items-center gap-1">
																						<FiClock size={10} />
																						{new Date(
																							member.recorded_at,
																						).toLocaleTimeString("id-ID", {
																							hour: "2-digit",
																							minute: "2-digit",
																						})}
																					</span>
																				)}
																			</div>
																		</div>
																	</Link>
																</li>
															))}
														</ul>
													</div>
												) : (
													<p className="text-center text-sm text-gray-500 py-2">
														Tidak ada member dengan status ini.
													</p>
												)}
											</div>
										)}
									</div>
								</div>
							)}
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

export default BranchAttendanceSummary;
