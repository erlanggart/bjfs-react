// File: src/pages/branch-admin/AttendancePage.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FiCheck, FiSearch, FiUser, FiClock } from "react-icons/fi";
import { FaQrcode } from "react-icons/fa";
import { useDebounce } from "use-debounce";
import { Link } from "react-router-dom";

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

	// Fetch admin attendance status untuk schedule ini
	useEffect(() => {
		const fetchAdminAttendance = async () => {
			if (!schedule) return;
			try {
				const response = await axios.get(
					`/api/attendance/admin_status.php?schedule_id=${schedule.id}`
				);
				setAdminAttendance(response.data.status);
			} catch (error) {
				console.error("Failed to fetch admin attendance:", error);
			}
		};
		fetchAdminAttendance();
	}, [schedule]);

	const handleAdminAttendance = async (status) => {
		setIsLoading(true);
		try {
			await axios.post("/api/attendance/admin_record.php", {
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
		} catch (error) {
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
					<div className="bg-white bg-opacity-20 p-2 rounded-full flex-shrink-0">
						<FiUser className="w-5 h-5 sm:w-6 sm:h-6" />
					</div>
					<div className="min-w-0 flex-1">
						<h3 className="font-semibold text-sm sm:text-base">
							Absensi Pelatih
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

					<div className="flex gap-2 justify-center sm:justify-start">
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
			false // verbose
		);

		const handleSuccess = (decodedText, decodedResult) => {
			scanner
				.clear()
				.catch((err) => console.error("Gagal membersihkan scanner.", err));
			onScanSuccess(decodedText);
		};

		const handleError = (error) => {
			/* Abaikan error umum */
		};

		scanner.render(handleSuccess, handleError);

		return () => {
			if (scanner && scanner.getState() === 2) {
				scanner
					.clear()
					.catch((err) =>
						console.error("Gagal membersihkan scanner saat cleanup.", err)
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

	// Fungsi ini HANYA untuk saat jadwal pertama kali dipilih
	const handleSelectSchedule = useCallback(async (schedule) => {
		setSelectedSchedule(schedule);
		setSearchTerm(""); // Reset pencarian saat ganti jadwal
		try {
			const response = await axios.get(`/api/attendance/list_members.php`, {
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
		} catch (error) {
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
					member.id.toString().includes(debouncedSearchTerm)
			);
			setFilteredMembers(filtered);
		} else {
			// Tampilkan semua member jika tidak ada pencarian
			setFilteredMembers(allMembers);
		}
	}, [debouncedSearchTerm, allMembers]);

	const fetchSchedules = useCallback(async () => {
		try {
			const response = await axios.get("/api/schedules/today.php");
			setSchedules(Array.isArray(response.data) ? response.data : []);
		} catch (error) {
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
			([id, status]) => ({ id, status })
		);
		if (membersToSubmit.length === 0) {
			Swal.fire("Info", "Pilih status minimal untuk satu member.", "info");
			return;
		}
		try {
			await axios.post("/api/attendance/record.php", {
				schedule_id: selectedSchedule.id,
				members: membersToSubmit,
			});
			Swal.fire("Sukses!", "Absensi berhasil disimpan.", "success");
			handleSelectSchedule(selectedSchedule);
		} catch (error) {
			Swal.fire("Error", "Gagal menyimpan absensi.", "error");
		}
	};

	const processScanResult = async (memberId) => {
		try {
			await axios.post("/api/attendance/record.php", {
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
		} catch (err) {
			Swal.fire(
				"Gagal!",
				`Tidak dapat mengabsen member ID ${memberId}. Pastikan ID valid.`,
				"error"
			);
			setView("list");
		}
	};

	if (view === "schedule") {
		return (
			<div className="p-4 bg-gray-100 min-h-screen">
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
			<button
				onClick={() => setView("schedule")}
				className="text-sm text-secondary mb-2"
			>
				‹ Kembali pilih jadwal
			</button>
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
								m.avatar ||
								`https://placehold.co/48x48/E0E0E0/757575?text=${m.full_name.charAt(
									0
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
