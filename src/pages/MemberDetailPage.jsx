// File: src/pages/MemberDetailPage.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print"; // Impor hook
import { toPng } from "html-to-image";
import {
	FiArrowLeft,
	FiEdit,
	FiSave,
	FiX,
	FiPhone,
	FiCalendar,
	FiMove,
	FiKey,
	FiAlertCircle,
	FiCheckCircle,
	FiUser,
	FiDollarSign,
	FiUserPlus,
	FiPrinter,
	FiImage,
	FiThumbsUp,
	FiThumbsDown,
	FiEye,
	FiFileText,
	FiPlus,
	FiShield,
	FiTrash2,
	FiAward,
	FiMapPin,
	FiUpload,
} from "react-icons/fi";
import MemberCard from "../components/MemberCard";
import { EvaluationModal } from "../components/EvaluationComponents";

// Ambil URL dasar dari environment variable Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const calculateMembershipDuration = (regDateStr) => {
	if (!regDateStr) {
		return "-";
	}

	const startDate = new Date(regDateStr);
	const today = new Date();

	// Mengatasi jika tanggal tidak valid
	if (isNaN(startDate.getTime())) {
		return "-";
	}

	// Hitung total selisih bulan
	let totalMonths =
		(today.getFullYear() - startDate.getFullYear()) * 12 +
		(today.getMonth() - startDate.getMonth());

	// Jika hari ini lebih kecil dari hari registrasi, berarti satu bulan penuh belum lewat
	if (today.getDate() < startDate.getDate()) {
		totalMonths--;
	}

	// Pastikan tidak negatif
	if (totalMonths < 0) totalMonths = 0;

	const years = Math.floor(totalMonths / 12);
	const months = totalMonths % 12;

	const yearText = years > 0 ? `${years} tahun` : "";
	const monthText = months > 0 ? `${months} bulan` : "";

	if (years > 0 && months > 0) {
		return `${yearText}, ${monthText}`;
	}
	if (years > 0) {
		return yearText;
	}
	if (months > 0) {
		return monthText;
	}

	// Jika kurang dari sebulan
	return "Baru bergabung";
};

// Komponen untuk Header Profil yang bisa diedit
const EditableMemberHeader = ({ memberInfo, refetch }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		full_name: memberInfo.full_name,
		phone_number: memberInfo.phone_number || "",
		date_of_birth: memberInfo.date_of_birth || "",
		registration_date: memberInfo.registration_date
			? memberInfo.registration_date.split(" ")[0]
			: "", // Ambil hanya bagian tanggal
		last_payment_date: memberInfo.last_payment_date || "",
	});
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		setLoading(true);
		try {
			const payload = { ...formData };
			if (payload.date_of_birth === "") payload.date_of_birth = null;
			if (payload.registration_date === "") payload.registration_date = null;
			if (payload.last_payment_date === "") payload.last_payment_date = null;

			await axios.post("/api/members/update.php", {
				id: memberInfo.id,
				...payload,
			});
			Swal.fire("Berhasil!", "Data member telah diperbarui.", "success");
			setIsEditing(false);
			refetch();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memperbarui data.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			full_name: memberInfo.full_name,
			phone_number: memberInfo.phone_number || "",
			date_of_birth: memberInfo.date_of_birth || "",
			position: memberInfo.position || "Pemain",
			registration_date: memberInfo.registration_date
				? memberInfo.registration_date.split(" ")[0]
				: "",
			last_payment_date: memberInfo.last_payment_date || "",
		});
		setIsEditing(false);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-6 items-center gap-6 relative">
			<img
				src={
					memberInfo.avatar
						? memberInfo.avatar
						: `https://placehold.co/80x80/E0E0E0/757575?text=${memberInfo.full_name.charAt(
								0
						  )}`
				}
				alt={memberInfo.full_name}
				className="w-28 h-28 rounded-full object-cover mx-auto"
			/>
			{isEditing ? (
				<div className="flex flex-col flex-grow space-y-2 mt-4">
					<div>
						<p className="text-sm text-gray-500 mb-1">Nama Lengkap</p>
						<input
							type="text"
							value={formData.full_name}
							onChange={(e) =>
								setFormData({ ...formData, full_name: e.target.value })
							}
							className="w-full p-2 bg-slate-100 rounded-md font-bold text-primary"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Informasi Kontak</p>
						<input
							type="text"
							value={formData.phone_number}
							onChange={(e) =>
								setFormData({ ...formData, phone_number: e.target.value })
							}
							placeholder="Nomor Telepon"
							className="w-full p-2 bg-slate-100 rounded-md text-gray-600"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Tanggal Lahir</p>
						<input
							type="date"
							value={formData.date_of_birth}
							onChange={(e) =>
								setFormData({ ...formData, date_of_birth: e.target.value })
							}
							className="w-full p-2 bg-slate-100 rounded-md text-gray-600"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Posisi Pemain</p>
						<select
							value={formData.position}
							onChange={(e) =>
								setFormData({ ...formData, position: e.target.value })
							}
							className="w-full p-2 bg-slate-100 rounded-md text-gray-600"
						>
							<option value="Pemain">Pemain</option>
							<option value="Kiper">Kiper</option>
						</select>
					</div>

					<h2 className="mt-4 text-xs text-slate-300 font-semibold">
						Membership
					</h2>
					<div>
						<p className="text-sm text-gray-500 mb-1">Tanggal Registrasi</p>
						<input
							type="date"
							value={formData.registration_date}
							onChange={(e) =>
								setFormData({ ...formData, registration_date: e.target.value })
							}
							className="w-full p-2 bg-slate-100 rounded-md text-gray-600"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-500 mb-1">Pembayaran Terakhir</p>
						<input
							type="date"
							value={formData.last_payment_date}
							onChange={(e) =>
								setFormData({ ...formData, last_payment_date: e.target.value })
							}
							className="w-full p-2 bg-slate-100 rounded-md text-gray-600"
						/>
					</div>
				</div>
			) : (
				<div className="flex-grow text-center mt-4">
					<h1 className="text-2xl font-bold text-primary">
						{memberInfo.full_name}
					</h1>
					<p className="text-xs text-gray-400 mb-1">
						Username: {memberInfo.username}
					</p>
					<div className="flex justify-center items-center gap-2 my-6">
						<p className="text-xs px-4 py-1 bg-secondary inline-block text-white rounded">
							ID: {memberInfo.id}
						</p>
						{memberInfo.position === "Pemain" ? (
							<p className="flex items-center gap-1 text-xs px-4 py-1 bg-green-100 text-green-800 font-semibold rounded">
								<FiUser size={12} /> {memberInfo.position}
							</p>
						) : (
							<p className="flex items-center gap-1 text-xs px-4 py-1 bg-blue-100 text-blue-800 font-semibold rounded">
								<FiShield size={12} /> {memberInfo.position}
							</p>
						)}
					</div>
					<p className="font-semibold mb-6">{memberInfo.branch_name}</p>

					<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500 justify-center">
						<div className="flex flex-col justify-end items-end gap-2">
							<div className="flex items-center gap-2">
								<span>Nomor Telepon</span>
								<FiPhone />
							</div>
							<div className="flex items-center gap-2">
								<span>Tanggal Lahir</span>
								<FiCalendar />
							</div>
							<div className="flex items-center gap-2">
								<span>Tanggal Awal Gabung</span>
								<FiUserPlus />
							</div>
							<div className="flex items-center gap-2">
								<span>Pembayaran Terakhir</span>
								<FiDollarSign />
							</div>
						</div>
						<div className="flex flex-col justify-start items-start gap-2 text-secondary">
							<div>
								<span className="font-semibold">
									{memberInfo.phone_number ? memberInfo.phone_number : "-"}
								</span>
							</div>
							<div>
								<span className="font-semibold">
									{memberInfo.date_of_birth
										? new Date(
												memberInfo.date_of_birth + "T00:00:00"
										  ).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "short",
												year: "numeric",
										  })
										: "-"}
								</span>
							</div>
							<div className="flex gap-2 items-center">
								<span className="font-semibold">
									{memberInfo.registration_date
										? new Date(memberInfo.registration_date).toLocaleDateString(
												"id-ID",
												{ day: "numeric", month: "short", year: "numeric" }
										  )
										: "-"}
								</span>
								<span className="text-xs text-gray-400">
									{calculateMembershipDuration(memberInfo.registration_date)}
								</span>
							</div>
							<div>
								<span className="font-semibold">
									{memberInfo.last_payment_date
										? new Date(memberInfo.last_payment_date).toLocaleDateString(
												"id-ID",
												{ day: "numeric", month: "short", year: "numeric" }
										  )
										: "Belum Pernah"}
								</span>
							</div>
						</div>
					</div>

					<div className="my-4 text-sm text-gray-500">
						<div className="flex items-center gap-2 mb-1 justify-center">
							<FiMapPin />

							<span className="font-semibold">Alamat </span>
						</div>
						<span>{memberInfo.address ? memberInfo.address : "-"}</span>
					</div>
				</div>
			)}
			<div className="absolute top-4 right-4 flex gap-2">
				{isEditing ? (
					<>
						<button
							onClick={handleCancel}
							className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
						>
							<FiX />
						</button>
						<button
							onClick={handleSave}
							disabled={loading}
							className="p-2 text-green-600 hover:bg-green-100 rounded-full"
						>
							<FiSave />
						</button>
					</>
				) : (
					<button
						onClick={() => setIsEditing(true)}
						className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"
					>
						<FiEdit />
					</button>
				)}
			</div>
		</div>
	);
};

const MoveBranchModal = ({ isOpen, onClose, refetch, memberData }) => {
	const [branches, setBranches] = useState([]);
	const [selectedBranch, setSelectedBranch] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isOpen) {
			const fetchBranches = async () => {
				try {
					const response = await axios.get("/api/branches/list.php");
					setBranches(response.data);
					// Set default value ke cabang saat ini jika ada
					if (response.data.length > 0) {
						setSelectedBranch(memberData.branch_id);
					}
				} catch (error) {
					console.error("Gagal memuat cabang", error);
				}
			};
			fetchBranches();
		}
	}, [isOpen, memberData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await axios.post("/api/members/move_branch.php", {
				member_id: memberData.id,
				new_branch_id: selectedBranch,
			});
			Swal.fire(
				"Berhasil!",
				`${memberData.full_name} telah dipindahkan.`,
				"success"
			);
			refetch();
			onClose();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memindahkan member.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-md relative shadow-xl">
				<h2 className="text-xl font-bold mb-4 text-gray-800">
					Pindahkan Member
				</h2>
				<p className="text-sm text-gray-600 mb-4">
					Pindahkan <strong>{memberData.full_name}</strong> ke cabang lain.
				</p>
				<form onSubmit={handleSubmit}>
					<select
						value={selectedBranch}
						onChange={(e) => setSelectedBranch(e.target.value)}
						className="w-full p-2 border rounded-md"
					>
						{branches.map((branch) => (
							<option key={branch.id} value={branch.id}>
								{branch.name}
							</option>
						))}
					</select>
					<div className="flex justify-end gap-4 pt-6">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50"
						>
							{loading ? "Memindahkan..." : "Pindahkan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const getPaymentStatus = (regDateStr, lastPaidDateStr, paymentHistory) => {
	if (!regDateStr) {
		return { show: false, status: "paid" };
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const currentMonth = today.getMonth() + 1;
	const currentYear = today.getFullYear();

	// Prioritas 1: Cek bukti pembayaran yang diunggah untuk bulan ini
	const proofForThisMonth = paymentHistory?.find(
		(p) => p.payment_month == currentMonth && p.payment_year == currentYear
	);

	if (proofForThisMonth?.status === "pending") {
		return { show: true, status: "pending", proof_id: proofForThisMonth.id };
	}
	if (proofForThisMonth?.status === "approved") {
		return { show: false, status: "paid" }; // Sudah lunas bulan ini
	}

	// --- LOGIKA BARU: Jatuh Tempo Bergulir ---
	// 1. Tentukan tanggal dasar dari tanggal pembayaran terakhir, atau tanggal registrasi.
	const baseDate = new Date(lastPaidDateStr || regDateStr);

	// 2. Hitung tanggal jatuh tempo berikutnya (satu bulan setelah tanggal dasar).
	const nextDueDate = new Date(
		baseDate.getFullYear(),
		baseDate.getMonth() + 1,
		baseDate.getDate()
	);

	// 3. Hitung sisa hari.
	const timeDiff = nextDueDate.getTime() - today.getTime();
	const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

	if (daysRemaining <= 7) {
		const isOverdue = daysRemaining < 0;
		return {
			show: true,
			status: "due",
			days: daysRemaining,
			isOverdue,
		};
	}

	return { show: false, status: "paid" };
};

const AdminUploadPaymentModal = ({
	isOpen,
	onClose,
	memberId,
	onUploadSuccess,
}) => {
	const [file, setFile] = useState(null);
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());
	// State BARU untuk tanggal pembayaran
	const [paymentDate, setPaymentDate] = useState(
		new Date().toISOString().slice(0, 10)
	);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file || !paymentDate) {
			Swal.fire(
				"Oops...",
				"Silakan pilih file bukti dan tanggal pembayaran.",
				"warning"
			);
			return;
		}
		setLoading(true);
		const formData = new FormData();
		formData.append("proof", file);
		formData.append("month", month);
		formData.append("year", year);
		formData.append("member_id", memberId);
		formData.append("payment_date", paymentDate); // Tambahkan tanggal ke data

		try {
			await axios.post("/api/admin/upload-payment-for-member", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			Swal.fire(
				"Berhasil!",
				"Bukti pembayaran berhasil diunggah dan disetujui.",
				"success"
			);
			onUploadSuccess();
			onClose();
		} catch (error) {
			Swal.fire(
				"Gagal",
				error.response?.data?.message || "Gagal mengunggah bukti.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-md">
				<h2 className="text-xl font-bold mb-4">Unggah Bukti Bayar (Admin)</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-sm">Bulan</label>
							<input
								type="number"
								value={month}
								onChange={(e) => setMonth(e.target.value)}
								min="1"
								max="12"
								className="w-full p-2 border rounded-md"
							/>
						</div>
						<div>
							<label className="text-sm">Tahun</label>
							<input
								type="number"
								value={year}
								onChange={(e) => setYear(e.target.value)}
								min="2020"
								max="2099"
								className="w-full p-2 border rounded-md"
							/>
						</div>
					</div>
					<div>
						<label className="text-sm">Tanggal Pembayaran</label>
						<input
							type="date"
							value={paymentDate}
							onChange={(e) => setPaymentDate(e.target.value)}
							required
							className="w-full p-2 border rounded-md"
						/>
					</div>
					<div>
						<label className="text-sm">File Bukti</label>
						<input
							type="file"
							required
							accept="image/*"
							onChange={(e) => setFile(e.target.files[0])}
							className="w-full p-2 border rounded-md text-sm"
						/>
					</div>
					<div className="flex justify-end gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 rounded-lg"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-secondary text-white rounded-lg"
						>
							{loading ? "Mengunggah..." : "Unggah & Setujui"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const PaymentHistory = ({ memberId, refetchParent }) => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visibleCount, setVisibleCount] = useState(3); // Tampilkan 3 item pertama
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await axios.get(
					`/api/members/payment_history.php?id=${memberId}`
				);
				setHistory(Array.isArray(response.data) ? response.data : []);
			} catch (error) {
				console.error(error);
				setHistory([]);
			} finally {
				setLoading(false);
			}
		};
		fetchHistory();
	}, [memberId, refetchParent]);

	const handleVerifyPayment = (proofId, newStatus) => {
		Swal.fire({
			title: `${newStatus === "approved" ? "Setujui" : "Tolak"} Pembayaran?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: newStatus === "approved" ? "#16a34a" : "#d33",
			confirmButtonText: `Ya, ${
				newStatus === "approved" ? "Setujui" : "Tolak"
			}!`,
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/admin/verify-payment", {
						proof_id: proofId,
						status: newStatus,
					});
					Swal.fire(
						"Berhasil!",
						"Status pembayaran telah diperbarui.",
						"success"
					);
					refetchParent(); // Panggil fungsi refetch dari parent
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal memverifikasi pembayaran.",
						"error"
					);
				}
			}
		});
	};

	const StatusBadge = ({ status }) => {
		const styles = {
			approved: { text: "Disetujui", color: "bg-green-100 text-green-800" },
			pending: {
				text: "Menunggu Verifikasi",
				color: "bg-blue-100 text-blue-800",
			},
			rejected: { text: "Ditolak", color: "bg-red-100 text-red-800" },
		};
		const current = styles[status] || {};
		return (
			<span
				className={`text-xs px-2 py-1 rounded-full font-semibold ${current.color}`}
			>
				{current.text}
			</span>
		);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<AdminUploadPaymentModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				memberId={memberId}
				onUploadSuccess={refetchParent}
			/>
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold text-primary">Riwayat Pembayaran</h2>
				<button
					onClick={() => setIsUploadModalOpen(true)}
					className="flex items-center gap-2 text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-md hover:bg-blue-200"
				>
					<FiUpload /> Unggah Bukti
				</button>
			</div>
			<div className="space-y-3">
				{loading ? (
					<p>Memuat riwayat...</p>
				) : history.length > 0 ? (
					history.slice(0, visibleCount).map((item) => (
						<div
							key={item.id}
							className="p-3 bg-gray-50 rounded-lg border border-slate-300"
						>
							<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
								<div>
									<p className="font-semibold">
										Iuran Bulan {item.payment_month}, {item.payment_year}
									</p>
									<p className="text-xs text-gray-500">
										Diunggah pada:{" "}
										{new Date(item.uploaded_at).toLocaleDateString("id-ID")}
									</p>
								</div>
								<StatusBadge status={item.status} />
							</div>
							<div className="mt-3 pt-3 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
								<a
									href={item.proof_url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
								>
									<FiEye /> Lihat Bukti Pembayaran
								</a>
								{item.status === "pending" && (
									<div className="flex-shrink-0 flex items-center justify-end gap-2 mt-6">
										<button
											onClick={() => handleVerifyPayment(item.id, "approved")}
											className="flex items-center gap-1 text-xs bg-green-500 text-white font-semibold px-2 py-1 rounded-md"
										>
											<FiThumbsUp size={14} /> Setujui
										</button>
										<button
											onClick={() => handleVerifyPayment(item.id, "rejected")}
											className="flex items-center gap-1 text-xs bg-red-500 text-white font-semibold px-2 py-1 rounded-md"
										>
											<FiThumbsDown size={14} /> Tolak
										</button>
									</div>
								)}
							</div>
						</div>
					))
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						Belum ada riwayat pembayaran.
					</p>
				)}
			</div>
			{history.length > visibleCount && (
				<div className="mt-4 text-center">
					<button
						onClick={() => setVisibleCount(history.length)}
						className="text-sm font-semibold text-secondary hover:underline"
					>
						Tampilkan Semua ({history.length}) Riwayat
					</button>
				</div>
			)}
		</div>
	);
};

export const AttendanceHistory = ({ memberId }) => {
	const [history, setHistory] = useState([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);

	const fetchHistory = useCallback(
		async (currentPage) => {
			setLoading(true);
			try {
				const response = await axios.get(
					"/api/members/get_attendance_history.php",
					{
						params: { id: memberId, page: currentPage },
					}
				);
				const data = response.data;
				// Jika halaman pertama, ganti. Jika tidak, tambahkan.
				setHistory((prev) =>
					currentPage === 1 ? data.history : [...prev, ...data.history]
				);
				setHasMore(currentPage < data.total_pages);
			} catch (error) {
				console.error("Gagal memuat riwayat absensi", error);
			} finally {
				setLoading(false);
			}
		},
		[memberId]
	);

	useEffect(() => {
		fetchHistory(1); // Muat halaman pertama saat komponen pertama kali dirender
	}, [fetchHistory]);

	const loadMore = () => {
		const nextPage = page + 1;
		setPage(nextPage);
		fetchHistory(nextPage);
	};

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

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-primary mb-4">Riwayat Absensi</h2>
			<div className="space-y-3">
				{loading && history.length === 0 ? (
					<p>Memuat riwayat...</p>
				) : history.length > 0 ? (
					history.map((item, index) => (
						<div
							key={index}
							className="flex justify-between items-center p-3 bg-gray-50 rounded"
						>
							<div>
								<p className="font-semibold">
									{new Date(
										item.attendance_date + "T00:00:00"
									).toLocaleDateString("id-ID", {
										weekday: "long",
										day: "numeric",
										month: "long",
										year: "numeric",
									})}
								</p>
								<p className="text-sm text-gray-500">
									{item.age_group} ({item.start_time.slice(0, 5)})
								</p>
							</div>
							<StatusBadge status={item.status} />
						</div>
					))
				) : (
					<p className="text-sm text-gray-500 text-center py-4">
						Belum ada riwayat absensi.
					</p>
				)}
			</div>
			{hasMore && !loading && (
				<div className="mt-4 text-center">
					<button
						onClick={loadMore}
						className="text-sm font-semibold text-secondary hover:underline"
					>
						Tampilkan lebih banyak...
					</button>
				</div>
			)}
			{loading && history.length > 0 && (
				<p className="text-center mt-4 text-sm text-gray-500">Memuat...</p>
			)}
		</div>
	);
};

const DocumentLinks = ({ memberInfo }) => {
	const hasDocuments =
		memberInfo.kk_url || memberInfo.akte_url || memberInfo.biodata_url;

	return (
		<div className="bg-white p-6 rounded-lg shadow-md">
			<h2 className="text-xl font-bold text-primary mb-4">Dokumen Pendukung</h2>
			{hasDocuments ? (
				<div className="space-y-2">
					{memberInfo.kk_url && (
						<a
							href={`${memberInfo.kk_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Kartu Keluarga (KK)
						</a>
					)}
					{memberInfo.akte_url && (
						<a
							href={`${memberInfo.akte_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Akte Lahir
						</a>
					)}
					{memberInfo.biodata_url && (
						<a
							href={`${memberInfo.biodata_url}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
						>
							<FiFileText /> Lihat Biodata
						</a>
					)}
				</div>
			) : (
				<p className="text-sm text-gray-500">
					Member ini belum mengunggah dokumen pendukung.
				</p>
			)}
		</div>
	);
};

const MemberDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [details, setDetails] = useState(null);
	const [achievements, setAchievements] = useState([]);
	const [paymentHistory, setPaymentHistory] = useState([]);
	const [loading, setLoading] = useState(true);

	const [refreshKey, setRefreshKey] = useState(0);

	const contentRef = useRef(null); // Ref untuk komponen kartu
	const reactToPrintFn = useReactToPrint({ contentRef });

	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
	const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
	const [editingEvaluationId, setEditingEvaluationId] = useState(null);
	const [reportTypeToCreate, setReportTypeToCreate] = useState("");

	const [paymentStatus, setPaymentStatus] = useState({ show: false });
	const [visibleReportsCount, setVisibleReportsCount] = useState(4);

	const fetchDetails = useCallback(async () => {
		try {
			const [detailsRes, historyRes] = await Promise.all([
				axios.get(`/api/members/detail.php?id=${id}`),
				axios.get(`/api/members/payment_history.php?id=${id}`),
			]);

			setDetails(detailsRes.data);
			// console.log(detailsRes.data);

			setAchievements(detailsRes.data.achievements || []);
			setPaymentHistory(historyRes.data);
		} catch (error) {
			console.error("Gagal memuat detail member", error);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		if (details?.member_info) {
			setPaymentStatus(
				getPaymentStatus(
					details.member_info.registration_date,
					details.member_info.last_payment_date,
					paymentHistory
				)
			);
		}
	}, [details, paymentHistory]);

	const triggerRefetch = () => {
		setRefreshKey((prev) => prev + 1);
	};

	useEffect(() => {
		setLoading(true);
		fetchDetails();
	}, [id, refreshKey]);

	const handleVerifyPayment = (proofId, newStatus) => {
		Swal.fire({
			title: `${newStatus === "approved" ? "Setujui" : "Tolak"} Pembayaran?`,
			text: `Anda akan ${
				newStatus === "approved" ? "menyetujui" : "menolak"
			} bukti pembayaran ini.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: newStatus === "approved" ? "#16a34a" : "#d33",
			confirmButtonText: `Ya, ${
				newStatus === "approved" ? "Setujui" : "Tolak"
			}!`,
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/admin/verify-payment", {
						proof_id: proofId,
						status: newStatus,
					});
					Swal.fire(
						"Berhasil!",
						"Status pembayaran telah diperbarui.",
						"success"
					);
					fetchDetails(); // Muat ulang data
				} catch (err) {
					console.log(err);
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal memverifikasi pembayaran.",
						"error"
					);
				}
			}
		});
	};

	const handleResetPassword = (member) => {
		Swal.fire({
			title: `Reset Password ${member.full_name}?`,
			text: "Password akan diubah ke 'bjfspassword'.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, reset!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/members/reset_password.php", {
						user_id: member.user_id,
					});
					Swal.fire("Berhasil!", "Password member telah direset.", "success");
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal mereset password.",
						"error"
					);
				}
			}
		});
	};

	const handleOpenAddReport = () => {
		const { report_template, position } = details.member_info;

		let finalReportType = "regular_player"; // Default
		if (report_template === "mastery") {
			finalReportType = position === "Kiper" ? "mastery_gk" : "mastery_player";
		} else {
			finalReportType = position === "Kiper" ? "regular_gk" : "regular_player";
		}

		setReportTypeToCreate(finalReportType);
		setEditingEvaluationId(null);
		setIsEvaluationModalOpen(true);
	};

	const handleOpenEditReport = (evaluationId) => {
		setEditingEvaluationId(evaluationId);
		setIsEvaluationModalOpen(true);
	};

	const handleDeleteReport = (evaluationId) => {
		Swal.fire({
			title: "Hapus Laporan Ini?",
			text: "Tindakan ini tidak dapat dibatalkan.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.post("/api/members/delete_evaluation.php", {
						id: evaluationId,
					});
					Swal.fire("Dihapus!", "Laporan evaluasi telah dihapus.", "success");
					triggerRefetch(); // Muat ulang data
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal menghapus laporan.",
						"error"
					);
				}
			}
		});
	};

	const handleToggleStatus = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		try {
			await axios.post("/api/members/toggle_status.php", {
				member_id: details.member_info.id,
			});
			Swal.fire({
				toast: true,
				position: "top-end",
				showConfirmButton: false,
				timer: 2000,
				icon: "success",
				title: `Status ${details.member_info.full_name} diubah`,
			});
			// PERBAIKAN: Panggil fungsi fetchDetails() untuk memuat ulang data
			fetchDetails();
		} catch (err) {
			console.log(err);
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal mengubah status.",
				"error"
			);
		}
	};

	const handleDownloadImage = useCallback(() => {
		if (contentRef.current === null) {
			return;
		}

		toPng(contentRef.current, { cacheBust: true, pixelRatio: 3 })
			.then((dataUrl) => {
				const link = document.createElement("a");
				link.download = `kartu-anggota-${details.member_info.full_name}.png`;
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.error("Gagal membuat gambar kartu:", err);
				Swal.fire("Gagal!", "Tidak dapat mengunduh gambar kartu.", "error");
			});
	}, [contentRef, details]);

	if (loading) return <p className="p-6">Memuat detail member...</p>;
	if (!details) return <p className="p-6">Gagal memuat data.</p>;

	const { member_info, evaluations } = details;

	return (
		<div className=" bg-gray-100 min-h-screen">
			<MoveBranchModal
				isOpen={isMoveModalOpen}
				onClose={() => setIsMoveModalOpen(false)}
				refetch={fetchDetails}
				memberData={member_info}
			/>
			<EvaluationModal
				isOpen={isEvaluationModalOpen}
				onClose={() => setIsEvaluationModalOpen(false)}
				refetch={triggerRefetch}
				memberInfo={member_info}
				evaluationId={editingEvaluationId}
				reportTypeToCreate={reportTypeToCreate}
			/>

			<div style={{ position: "fixed", left: "-9999px", top: 0 }}>
				<MemberCard ref={contentRef} memberInfo={member_info} />
			</div>

			<button
				onClick={() => navigate(-1)}
				className="flex items-center gap-2 text-sm text-secondary mb-4 font-semibold"
			>
				<FiArrowLeft /> Kembali
			</button>

			{paymentStatus.show && (
				<div
					className={`border-l-4 p-4 rounded-md mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
						paymentStatus.status === "pending"
							? "bg-blue-100 border-blue-500 text-blue-800"
							: paymentStatus.isOverdue
							? "bg-red-100 border-red-500 text-red-800"
							: "bg-yellow-100 border-yellow-500 text-yellow-800"
					}`}
				>
					<div className="flex items-center gap-3">
						<FiAlertCircle size={24} className="flex-shrink-0" />
						<div>
							<p className="font-bold">
								{paymentStatus.status === "pending"
									? "Menunggu Verifikasi Pembayaran"
									: "Pemberitahuan Iuran Bulanan"}
							</p>
							<p className="text-sm">
								{paymentStatus.status === "pending"
									? "Member telah mengunggah bukti pembayaran. Silakan verifikasi."
									: paymentStatus.isOverdue
									? `Pembayaran iuran telah jatuh tempo.`
									: `Jatuh tempo pembayaran dalam ${paymentStatus.days} hari lagi.`}
							</p>
						</div>
					</div>
					{/* Tombol Verifikasi BARU */}
					{paymentStatus.status === "pending" && (
						<div className="flex-shrink-0 flex items-center gap-2">
							<button
								onClick={() =>
									handleVerifyPayment(paymentStatus.proof_id, "approved")
								}
								className="flex items-center gap-2 text-sm bg-green-500 text-white font-semibold px-3 py-1 rounded-md"
							>
								<FiThumbsUp size={16} /> Setujui
							</button>
							<button
								onClick={() =>
									handleVerifyPayment(paymentStatus.proof_id, "rejected")
								}
								className="flex items-center gap-2 text-sm bg-red-500 text-white font-semibold px-3 py-1 rounded-md"
							>
								<FiThumbsDown size={16} /> Tolak
							</button>
						</div>
					)}
				</div>
			)}

			<EditableMemberHeader memberInfo={member_info} refetch={fetchDetails} />

			<div className="flex flex-col justify-end mb-4 gap-2 text-white">
				<button
					onClick={handleDownloadImage}
					className="flex items-center gap-2 text-sm bg-green-500 hover:bg-green-600 p-3 rounded-md"
				>
					<FiImage /> Unduh Kartu
				</button>
				<button
					onClick={reactToPrintFn}
					className="flex items-center gap-2 text-sm bg-blue-500 hover:bg-blue-600 p-3 rounded-md"
				>
					<FiPrinter /> Cetak Kartu
				</button>
				<button
					onClick={() => setIsMoveModalOpen(true)}
					className="flex items-center gap-2 text-sm bg-primary hover:bg-blue-900 p-3 rounded-md"
				>
					<FiMove /> Pindah Cabang
				</button>
				<button
					onClick={() => handleResetPassword(member_info)}
					className="flex items-center gap-2 text-sm bg-secondary hover:bg-rose-700 p-3 rounded-md"
				>
					<FiKey /> Reset Password
				</button>
				<button
					onClick={handleToggleStatus}
					className={`flex-shrink-0 flex items-center gap-2 text-sm  text-white font-semibold p-3 rounded-md ${
						member_info.status === "active" ? "bg-red-500" : "bg-green-500"
					}`}
				>
					<FiUser size={16} />{" "}
					{member_info.status === "active" ? "Nonaktifkan" : "Aktifkan"}
				</button>
			</div>

			<div className=" space-y-6">
				<AttendanceHistory memberId={id} />
				<div className="bg-white p-6 shadow-md rounded-md">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold text-primary">
							Riwayat Laporan Evaluasi
						</h2>
						<button
							onClick={handleOpenAddReport}
							className="flex items-center gap-2 text-sm bg-secondary text-white px-3 py-1 rounded-md"
						>
							<FiPlus /> Buat Laporan
						</button>
					</div>
					<div className="space-y-4">
						{evaluations.slice(0, visibleReportsCount).map(
							(
								ev // Menggunakan slice
							) => (
								<div
									key={ev.id}
									className="bg-gray-50 p-3 rounded-md border border-slate-300 flex justify-between items-center"
								>
									<div>
										<p className="font-semibold">
											{new Date(ev.evaluation_date).toLocaleDateString(
												"id-ID",
												{ day: "numeric", month: "long", year: "numeric" }
											)}
										</p>
										<p className="text-sm text-gray-500">
											Rapor {ev.report_type}
										</p>
									</div>
									<div className="flex gap-2">
										<Link
											to={`/member/${id}/report/${ev.id}`}
											state={{ evaluation: ev, memberInfo: member_info }}
											className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
										>
											<FiEye />
										</Link>
										<button
											onClick={() => handleOpenEditReport(ev.id)}
											className="p-2 text-green-600 hover:bg-green-100 rounded-full"
										>
											<FiEdit />
										</button>
										<button
											onClick={() => handleDeleteReport(ev.id)}
											className="p-2 text-red-600 hover:bg-red-100 rounded-full"
										>
											<FiTrash2 />
										</button>
									</div>
								</div>
							)
						)}
						{evaluations.length === 0 && <p>Belum ada laporan evaluasi.</p>}
					</div>
					{evaluations.length > visibleReportsCount && ( // Tombol "Tampilkan lebih banyak"
						<div className="mt-6 text-center">
							<button
								onClick={() => setVisibleReportsCount(evaluations.length)}
								className="text-sm font-semibold text-secondary hover:underline"
							>
								Tampilkan Semua ({evaluations.length}) Laporan
							</button>
						</div>
					)}
				</div>
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-bold text-primary mb-4">
						Prestasi yang Diraih
					</h2>
					<div className="space-y-3 max-h-96 overflow-y-auto pr-2">
						{achievements.length > 0 ? (
							achievements.map((ach) => (
								<div
									key={ach.id}
									className="p-3 bg-yellow-50 rounded-md border border-yellow-200 flex justify-between items-start"
								>
									<div>
										<p className="font-bold text-yellow-800 flex items-center gap-2">
											<FiAward /> {ach.achievement_name}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{new Date(ach.event_date).toLocaleDateString("id-ID", {
												year: "numeric",
												month: "long",
											})}
										</p>
										{ach.notes && (
											<p className="text-xs text-gray-600 italic mt-1">
												"{ach.notes}"
											</p>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500">
								Belum ada prestasi yang dicatat.
							</p>
						)}
					</div>
				</div>
				<DocumentLinks memberInfo={member_info} />
				<PaymentHistory memberId={id} refetchParent={triggerRefetch} />
			</div>
		</div>
	);
};

export default MemberDetailPage;
