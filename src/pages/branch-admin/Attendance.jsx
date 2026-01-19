// File: src/pages/branch-admin/AttendancePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
	FiCheck,
	FiSearch,
	FiUser,
	FiClock,
	FiArrowLeft,
	FiChevronLeft,
	FiCalendar,
} from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Komponen untuk Tombol Status
const StatusButton = ({ status, currentStatus, onClick }) => {
	const styles = {
		hadir: {
			text: "H",
			active: "bg-green-500 text-white",
			inactive: "bg-green-100 text-green-700 hover:bg-green-200",
		},
		sakit: {
			text: "S",
			active: "bg-yellow-500 text-white",
			inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
		},
		izin: {
			text: "I",
			active: "bg-blue-500 text-white",
			inactive: "bg-blue-100 text-blue-700 hover:bg-blue-200",
		},
		alpa: {
			text: "A",
			active: "bg-red-500 text-white",
			inactive: "bg-red-100 text-red-700 hover:bg-red-200",
		},
	};
	const style = styles[status];
	const isActive = currentStatus === status;
	return (
		<button
			onClick={onClick}
			className={`w-8 h-8 rounded-full font-bold text-sm transition-all duration-200 ease-in-out transform hover:scale-110 ${
				isActive ? style.active : style.inactive
			}`}
		>
			{style.text}
		</button>
	);
};

// Komponen untuk Self-Attendance Admin Cabang
const SelfAttendanceCard = ({ schedule, onAttendanceSubmit }) => {
	const [adminAttendance, setAdminAttendance] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [userProfile, setUserProfile] = useState({
		avatar: null,
		full_name: "",
	});

	// Fetch admin attendance status dan profile untuk schedule ini
	useEffect(() => {
		const fetchData = async () => {
			if (!schedule) return;
			try {
				// Fetch attendance status
				const attendanceResponse = await api.get(
					`/api/attendance/admin_status?schedule_id=${schedule.id}`,
				);
				setAdminAttendance(attendanceResponse.data.status);

				// Fetch user profile
				const profileResponse = await api.get("/api/users/my-profile");
				if (profileResponse.data.profile) {
					setUserProfile({
						avatar: profileResponse.data.profile.avatar,
						full_name: profileResponse.data.profile.full_name || "Admin",
					});
				}
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};
		fetchData();
	}, [schedule]);

	const handleAdminAttendance = async (status) => {
		setIsLoading(true);
		try {
			await api.post("/api/attendance/admin_record", {
				schedule_id: schedule.id,
				status: status,
			});

			setAdminAttendance(status);
			onAttendanceSubmit && onAttendanceSubmit();

			Swal.fire({
				icon: "success",
				title: "Absensi Berhasil!",
				text: `Status kehadiran Anda: ${
					status.charAt(0).toUpperCase() + status.slice(1)
				}`,
				timer: 2000,
				showConfirmButton: false,
			});
		} catch {
			Swal.fire("Error", "Gagal menyimpan absensi admin.", "error");
		} finally {
			setIsLoading(false);
		}
	};

	if (!schedule) return null;

	return (
		<div className="bg-gradient-to-r from-[var(--color-primary)] to-blue-700 p-3 sm:p-4 rounded-lg shadow-md mb-4 text-white">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
				<div className="flex items-center gap-3">
					{userProfile.avatar ? (
						<img
							src={userProfile.avatar}
							alt={userProfile.full_name}
							className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white/30 flex-shrink-0"
						/>
					) : (
						<div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
							<FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
						</div>
					)}
					<div className="min-w-0 flex-1">
						<h3 className="font-semibold text-sm sm:text-base">
							{userProfile.full_name}
						</h3>
						<p className="text-xs sm:text-sm opacity-90">
							<FiClock className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
							{schedule.start_time.substring(0, 5)} -{" "}
							{schedule.end_time.substring(0, 5)}
						</p>
					</div>
				</div>

				{/* Status and Buttons Section */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-2">
					{adminAttendance && (
						<span className="bg-white/20 px-2 py-1 rounded-full text-xs sm:text-sm font-medium text-center sm:mr-2">
							Status:{" "}
							{adminAttendance.charAt(0).toUpperCase() +
								adminAttendance.slice(1)}
						</span>
					)}

					<div className="flex gap-8 justify-center sm:justify-start">
						<StatusButton
							status="hadir"
							currentStatus={adminAttendance}
							onClick={() => handleAdminAttendance("hadir")}
						/>
						<StatusButton
							status="sakit"
							currentStatus={adminAttendance}
							onClick={() => handleAdminAttendance("sakit")}
						/>
						<StatusButton
							status="izin"
							currentStatus={adminAttendance}
							onClick={() => handleAdminAttendance("izin")}
						/>
						<StatusButton
							status="alpa"
							currentStatus={adminAttendance}
							onClick={() => handleAdminAttendance("alpa")}
						/>
					</div>
				</div>
			</div>

			{isLoading && (
				<div className="mt-3 text-center text-xs sm:text-sm opacity-90">
					Menyimpan absensi...
				</div>
			)}
		</div>
	);
};

// Komponen untuk Pemindai QR
const QrScanner = ({ onScanSuccess }) => {
	useEffect(() => {
		const scanner = new Html5QrcodeScanner(
			"qr-reader-container",
			{ fps: 10, qrbox: { width: 250, height: 250 } },
			false, // verbose
		);

		const handleSuccess = (decodedText) => {
			scanner
				.clear()
				.catch((err) => console.error("Gagal membersihkan scanner.", err));
			onScanSuccess(decodedText);
		};

		const handleError = (error) => {
			console.warn("QR Code scan error:", error);
		};

		scanner.render(handleSuccess, handleError);

		return () => {
			if (scanner && scanner.getState() === 2) {
				scanner
					.clear()
					.catch((err) =>
						console.error("Gagal membersihkan scanner saat cleanup.", err),
					);
			}
		};
	}, [onScanSuccess]);

	return <div id="qr-reader-container" className="w-full"></div>;
};

// Komponen Halaman Utama
const AttendancePage = () => {
	const [schedules, setSchedules] = useState([]);
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [allMembers, setAllMembers] = useState([]); // Semua member untuk jadwal terpilih
	const [filteredMembers, setFilteredMembers] = useState([]); // Member yang difilter untuk tampilan
	const [view, setView] = useState("schedule");
	const [attendanceStatus, setAttendanceStatus] = useState({});
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
	const [branchName, setBranchName] = useState("");
	const [userName, setUserName] = useState("");

	// Fungsi ini HANYA untuk saat jadwal pertama kali dipilih
	const handleSelectSchedule = useCallback(async (schedule) => {
		setSelectedSchedule(schedule);
		setSearchTerm(""); // Reset pencarian saat ganti jadwal
		if (schedule.branch_name) {
			setBranchName(schedule.branch_name);
		}
		try {
			const response = await api.get(`/api/attendance/list_members`, {
				params: { schedule_id: schedule.id, search: "" },
			});

			// Simpan semua member dan tampilkan semuanya
			setAllMembers(response.data);
			setFilteredMembers(response.data);

			// Inisialisasi status kehadiran
			const initialStatus = {};
			response.data.forEach((m) => {
				if (m.attendance_status) {
					initialStatus[m.id] = m.attendance_status;
				}
			});
			setAttendanceStatus(initialStatus);
			setView("list");
		} catch {
			Swal.fire("Error", "Gagal memuat daftar member.", "error");
		}
	}, []);

	// useEffect ini HANYA untuk memfilter data yang sudah ada
	useEffect(() => {
		if (debouncedSearchTerm && allMembers.length > 0) {
			// Filter berdasarkan nama atau ID member
			const filtered = allMembers.filter(
				(member) =>
					member.full_name
						.toLowerCase()
						.includes(debouncedSearchTerm.toLowerCase()) ||
					member.id.toString().includes(debouncedSearchTerm),
			);
			setFilteredMembers(filtered);
		} else {
			// Tampilkan semua member jika tidak ada pencarian
			setFilteredMembers(allMembers);
		}
	}, [debouncedSearchTerm, allMembers]);

	const fetchSchedules = useCallback(async () => {
		try {
			const response = await api.get("/api/schedules/today");
			const schedulesData = Array.isArray(response.data) ? response.data : [];
			setSchedules(schedulesData);

			// Fetch branch info dari profile user
			try {
				const profileResponse = await api.get("/api/users/my-profile");
				if (profileResponse.data.profile) {
					const profile = profileResponse.data.profile;

					// Set user name
					if (profile.full_name) {
						setUserName(profile.full_name);
					}

					// Set branch name
					if (profile.branch_id) {
						const branchResponse = await api.get(
							`/api/branches/${profile.branch_id}`,
						);
						if (branchResponse.data.success && branchResponse.data.data) {
							setBranchName(branchResponse.data.data.name);
						}
					}
				}
			} catch (error) {
				console.error("Failed to fetch branch info:", error);
				// Fallback to branch_name from schedule if available
				if (schedulesData.length > 0 && schedulesData[0].branch_name) {
					setBranchName(schedulesData[0].branch_name);
				}
			}
		} catch {
			Swal.fire("Error", "Gagal memuat jadwal hari ini.", "error");
		}
	}, []);

	useEffect(() => {
		fetchSchedules();
	}, [fetchSchedules]);

	const handleStatusChange = (memberId, status) => {
		setAttendanceStatus((prev) => ({ ...prev, [memberId]: status }));
	};

	const handleSubmitManual = async () => {
		const membersToSubmit = Object.entries(attendanceStatus).map(
			([id, status]) => ({ id, status }),
		);
		if (membersToSubmit.length === 0) {
			Swal.fire("Info", "Pilih status minimal untuk satu member.", "info");
			return;
		}
		try {
			await api.post("/api/attendance/record", {
				schedule_id: selectedSchedule.id,
				members: membersToSubmit,
			});
			Swal.fire("Sukses!", "Absensi berhasil disimpan.", "success");
			handleSelectSchedule(selectedSchedule);
		} catch {
			Swal.fire("Error", "Gagal menyimpan absensi.", "error");
		}
	};

	const processScanResult = async (memberId) => {
		try {
			await api.post("/api/attendance/record", {
				schedule_id: selectedSchedule.id,
				member_id: memberId,
			});
			Swal.fire({
				icon: "success",
				title: "Absen Berhasil!",
				text: `Member ID ${memberId} telah diabsen.`,
				timer: 2000,
				showConfirmButton: false,
			});
			handleSelectSchedule(selectedSchedule);
		} catch {
			Swal.fire(
				"Gagal!",
				`Tidak dapat mengabsen member ID ${memberId}. Pastikan ID valid.`,
				"error",
			);
			setView("list");
		}
	};

	if (view === "schedule") {
		return (
			<div>
				{branchName && (
					<div className="lg:mt-4 lg:rounded-t-lg bg-gradient-to-r from-[var(--color-primary)] to-blue-700 h-[30vh] rounded-b-lg p-6 mb-4 shadow-lg flex flex-col justify-center">
						<p className="text-white/90 text-sm font-medium mb-2">
							Selamat Datang,
						</p>
						<h2 className="text-white text-3xl font-bold mb-3">
							{userName || "Admin"}
						</h2>
						<div className="flex items-center gap-2">
							<div className="bg-white/20 rounded-full px-3 py-1">
								<p className="text-white text-xs font-medium">Cabang</p>
							</div>
							<p className="text-white text-xl font-semibold">{branchName}</p>
						</div>
					</div>
				)}
				<div className="px-4 md:px-0">
					<Link
						to="/jadwal"
						className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold shadow-sm hover:bg-primary-dark"
					>
						<FiCalendar /> Atur Jadwal
					</Link>
				</div>
				<div className="m-4 lg:m-0 p-4 bg-gray-100 ">
					<h1 className="text-2xl font-bold text-gray-800 mb-4">
						Pilih Jadwal Latihan Hari Ini
					</h1>
					{schedules.length > 0 ? (
						schedules.map((s) => (
							<div
								key={s.id}
								onClick={() => handleSelectSchedule(s)}
								className="bg-white p-4 rounded-lg shadow-md mb-3 cursor-pointer active:scale-95 transition-transform"
							>
								<p className="font-bold text-lg text-primary">{s.age_group}</p>
								<p className="text-sm text-gray-600">{s.location}</p>
								<p className="text-sm text-secondary font-semibold">
									{s.start_time.substring(0, 5)} - {s.end_time.substring(0, 5)}
								</p>
							</div>
						))
					) : (
						<p className="text-center text-gray-500 mt-8">
							Tidak ada jadwal latihan hari ini.
						</p>
					)}
				</div>
			</div>
		);
	}

	if (view === "qr") {
		return (
			<div className="w-full min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4">
				<div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-lg">
					<QrScanner onScanSuccess={processScanResult} />
				</div>
				<button
					onClick={() => setView("list")}
					className="mt-8 px-6 py-2 bg-white text-black rounded-lg font-semibold"
				>
					Kembali ke Daftar
				</button>
			</div>
		);
	}

	return (
		<div className="p-4 bg-gray-100 min-h-screen">
			{branchName && (
				<div className="flex space-x-3 bg-gradient-to-r from-[var(--color-primary)] to-blue-700 rounded-lg p-3 mb-3 shadow-lg">
					<button onClick={() => setView("schedule")} className="text-white">
						<FiChevronLeft size={25} />
					</button>
					<div>
						<p className="text-white text-xs font-medium mb-0.5">Cabang</p>
						<h2 className="text-white text-lg font-bold">{branchName}</h2>
					</div>
				</div>
			)}
			<h1 className="text-xl font-bold text-gray-800">
				{selectedSchedule.age_group}
			</h1>
			<p className="text-sm text-gray-600 mb-4">
				Pilih status kehadiran atau scan QR Code.
			</p>

			{/* Self Attendance untuk Admin Cabang */}
			<SelfAttendanceCard
				schedule={selectedSchedule}
				onAttendanceSubmit={() => {
					// Callback jika diperlukan refresh data
				}}
			/>

			<div className="relative mb-4">
				<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					name="search"
					placeholder="Cari nama member..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border rounded-lg"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4 mb-4 sticky top-4 bg-gray-100 py-2 z-10">
				<button
					onClick={handleSubmitManual}
					className="flex items-center justify-center gap-2 p-3 bg-secondary text-white rounded-lg font-bold shadow-md"
				>
					<FiCheck /> Simpan Absensi
				</button>
				<button
					onClick={() => setView("qr")}
					className="flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg font-bold shadow-md"
				>
					<FaQrcode /> Scan QR
				</button>
			</div>

			<div className="space-y-3">
				{filteredMembers.map((m) => (
					<div
						key={m.id}
						className="bg-white p-3 rounded-lg shadow-sm flex items-center gap-4"
					>
						<img
							src={
								m.avatar
									? `${API_BASE_URL}${m.avatar}`
									: `https://placehold.co/48x48/E0E0E0/757575?text=${m.full_name.charAt(
											0,
										)}`
							}
							alt={m.full_name}
							className="w-16 h-16 rounded-full object-cover flex-shrink-0"
						/>
						<div className="flex-grow">
							<p className="font-semibold text-gray-800">{m.full_name}</p>
							<p className="font-mono text-xs text-white bg-secondary px-2 py-1 rounded inline-block">
								{m.id}
							</p>
							<div className="flex justify-around gap-2 mt-2">
								<StatusButton
									status="hadir"
									currentStatus={attendanceStatus[m.id]}
									onClick={() => handleStatusChange(m.id, "hadir")}
								/>
								<StatusButton
									status="sakit"
									currentStatus={attendanceStatus[m.id]}
									onClick={() => handleStatusChange(m.id, "sakit")}
								/>
								<StatusButton
									status="izin"
									currentStatus={attendanceStatus[m.id]}
									onClick={() => handleStatusChange(m.id, "izin")}
								/>
								<StatusButton
									status="alpa"
									currentStatus={attendanceStatus[m.id]}
									onClick={() => handleStatusChange(m.id, "alpa")}
								/>
							</div>
						</div>
					</div>
				))}
				{filteredMembers.length === 0 && (
					<p className="text-center text-gray-500 py-4">
						{searchTerm
							? "Tidak ada member yang sesuai dengan pencarian"
							: "Tidak ada member dalam jadwal ini"}
					</p>
				)}
			</div>
		</div>
	);
};

export default AttendancePage;
