// File: src/pages/member/MyProfilePage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react"; // BARU: Tambah useRef
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image"; // BARU: Impor library untuk konversi ke gambar
import {
	FiCheck,
	FiX,
	FiAlertTriangle,
	FiMinus,
	FiPhone,
	FiImage, // BARU: Ikon untuk tombol unduh
} from "react-icons/fi";
import Swal from "sweetalert2";

// BARU: Impor komponen MemberCard yang akan diunduh
import MemberCard from "../../components/MemberCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusBadge = ({ status }) => {
	// ... (kode tidak berubah)
	const styles = {
		hadir: {
			icon: <FiCheck />,
			text: "Hadir",
			color: "bg-green-500 text-white",
		},
		sakit: {
			icon: <FiAlertTriangle />,
			text: "Sakit",
			color: "bg-yellow-500 text-white",
		},
		izin: {
			icon: <FiAlertTriangle />,
			text: "Izin",
			color: "bg-blue-500 text-white",
		},
		alpa: { icon: <FiX />, text: "Alpa", color: "bg-red-500 text-white" },
		default: {
			icon: <FiMinus />,
			text: "N/A",
			color: "bg-gray-200 text-gray-700",
		},
	};
	const current = styles[status] || styles.default;
	return (
		<span
			className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${current.color}`}
		>
			{current.icon} {current.text}
		</span>
	);
};

const MyProfilePage = () => {
	const [profile, setProfile] = useState(null);
	const [attendance, setAttendance] = useState([]);
	const [loading, setLoading] = useState({ profile: true, attendance: true });
	const [error, setError] = useState(null);

	const currentYear = new Date().getFullYear();
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(currentYear);

	// BARU: Ref untuk menunjuk ke komponen MemberCard yang tersembunyi
	const cardRef = useRef(null);

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

	const fetchProfileData = useCallback(async () => {
		setLoading((prev) => ({ ...prev, profile: true }));
		try {
			const response = await axios.get("/api/users/my-profile");
			// Backend returns { success: true, profile: {...} }
			setProfile(response.data.profile);
		} catch (err) {
			console.error("Gagal memuat data profil", err);
			setError("Tidak dapat memuat profil. Silakan coba lagi nanti.");
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Gagal memuat data profil!",
			});
		} finally {
			setLoading((prev) => ({ ...prev, profile: false }));
		}
	}, []);

	// BARU: Fungsi untuk menangani unduhan kartu sebagai gambar
	const handleDownloadCard = useCallback(() => {
		if (cardRef.current === null) {
			return;
		}
		toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 })
			.then((dataUrl) => {
				const link = document.createElement("a");
				link.download = `kartu-anggota-${profile.full_name}.png`;
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.error("Gagal membuat gambar kartu:", err);
				Swal.fire("Gagal!", "Tidak dapat mengunduh gambar kartu.", "error");
			});
	}, [cardRef, profile]);

	useEffect(() => {
		fetchProfileData();
	}, [fetchProfileData]);

	useEffect(() => {
		const fetchAttendance = async () => {
			setLoading((prev) => ({ ...prev, attendance: true }));
			try {
				const response = await axios.get(
					`/api/members/my-attendance?month=${month}&year=${year}`,
				);
				setAttendance(response.data);
			} catch (error) {
				console.error("Gagal memuat absensi", error);
				Swal.fire("Error", "Gagal memuat data absensi.", "error");
			} finally {
				setLoading((prev) => ({ ...prev, attendance: false }));
			}
		};
		if (profile) {
			// Hanya fetch jika profile sudah ada
			fetchAttendance();
		}
	}, [month, year, profile]);

	if (loading.profile)
		return <p className="text-center p-10">Memuat profil...</p>;
	if (error) return <p className="text-center p-10 text-red-500">{error}</p>;
	if (!profile) return <p className="text-center p-10">Gagal memuat profil.</p>;

	return (
		<div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
			{/* BARU: Render MemberCard di luar layar agar bisa di-capture */}
			<div style={{ position: "fixed", left: "-9999px", top: 0 }}>
				<MemberCard ref={cardRef} memberInfo={profile} />
			</div>

			<div className="max-w-4xl mx-auto space-y-6">
				{/* Profile Card & QR Code */}
				<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6">
					<img
						src={
							profile.avatar
								? `${API_BASE_URL}${profile.avatar}`
								: `https://placehold.co/128x128/E0E0E0/757575?text=${profile.full_name?.charAt(0) || "U"}`
						}
						alt="Avatar"
						className="w-32 h-32 rounded-full border-4 border-secondary object-cover"
					/>
					<div className="text-center sm:text-left flex-grow">
						<h1 className="text-2xl sm:text-3xl font-bold text-primary">
							{profile.full_name}
						</h1>
						<p className="text-md text-gray-600">{profile.branch_name}</p>
						{profile.phone_number && (
							<div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-sm text-gray-500">
								<FiPhone size={14} />
								<span>{profile.phone_number}</span>
							</div>
						)}
						<p className="font-mono text-xs text-gray-400 mt-2">
							ID Member: {profile.id}
						</p>

						{/* BARU: Tombol untuk mengunduh kartu */}
						<div className="mt-4 flex justify-center sm:justify-start">
							<button
								onClick={handleDownloadCard}
								className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors"
							>
								<FiImage /> Unduh Kartu Anggota
							</button>
						</div>
					</div>
					<div className="p-2 bg-white border-4 border-gray-200 rounded-lg">
						<QRCodeSVG value={String(profile.id)} size={128} level={"H"} />
					</div>
				</div>

				{/* Attendance Report Section */}
				<div className="bg-white rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Rekap Absensi Bulanan
					</h2>
					<div className="grid grid-cols-2 gap-4 mb-6">
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
					<div className="space-y-3">
						{loading.attendance ? (
							<p>Memuat data absensi...</p>
						) : attendance.length > 0 ? (
							attendance.map((record, index) => (
								<div
									key={index}
									className="p-3 border-b flex justify-between items-center"
								>
									<div>
										<p className="font-semibold text-gray-800">
											{new Date(
												record.attendance_date + "T00:00:00",
											).toLocaleDateString("id-ID", {
												weekday: "long",
												day: "numeric",
												month: "long",
											})}
										</p>
										<p className="text-sm text-gray-500">
											{record.age_group} ({record.start_time.slice(0, 5)})
										</p>
									</div>
									<StatusBadge status={record.status} />
								</div>
							))
						) : (
							<p className="text-center text-gray-500 py-8">
								Tidak ada catatan absensi di bulan ini.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyProfilePage;
