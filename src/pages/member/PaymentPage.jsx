// File: src/pages/member/PaymentPage.jsx
import React, { useState, useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
	FiUpload,
	FiCheck,
	FiX,
	FiLoader,
	FiAlertCircle,
	FiDownload,
	FiSend,
} from "react-icons/fi";

import qrisPdf from "../../assets/QR_WAHANA ANAK BANSA_1756254395.pdf";
import qrisImage from "../../assets/QRIS_WAHANA_ANAK_BANSA.jpg";
import FeedbackForm from "../../components/FeedbackForm";

// Komponen untuk Modal Unggah Pembayaran
const UploadPaymentModal = ({ isOpen, onClose, onUploadSuccess }) => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);

	const currentDate = new Date();
	const currentMonthNumber = currentDate.getMonth() + 1;
	const currentMonthName = currentDate.toLocaleDateString("id-ID", {
		month: "long",
	});
	const currentYear = currentDate.getFullYear();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!file) {
			Swal.fire("Oops...", "Silakan pilih file bukti pembayaran.", "warning");
			return;
		}
		setLoading(true);
		const formData = new FormData();
		formData.append("proof", file);
		formData.append("month", currentMonthNumber);
		formData.append("year", currentYear);

		try {
			await axios.post("/api/members/upload_payment.php", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			Swal.fire("Berhasil!", "Bukti pembayaran berhasil diunggah.", "success");
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
				<h2 className="text-xl font-bold mb-4">Unggah Bukti Pembayaran</h2>
				<p className="text-sm text-gray-600 mb-4">
					Untuk iuran bulan {currentMonthName}, tahun {currentYear}.
				</p>
				<form onSubmit={handleSubmit}>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
						className="w-full p-2 border rounded-md"
					/>
					<div className="flex justify-end gap-4 pt-6">
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
							{loading ? "Mengunggah..." : "Unggah"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

// Komponen Halaman Utama Pembayaran
const PaymentPage = () => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [paymentStatus, setPaymentStatus] = useState({ show: false });
	
	const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

	// BARU: Fungsi untuk menangani pengiriman kritik dan saran

	useEffect(() => {
		const fetchPaymentData = async () => {
			setLoading(true);
			try {
				const response = await axios.get("/api/members/payment_status.php");
				const { member_info, payment_history } = response.data;

				if (Array.isArray(payment_history)) {
					setHistory(payment_history);
				}

				// Hitung status pembayaran
				setPaymentStatus(
					getPaymentStatus(member_info.registration_date, payment_history)
				);
			} catch (error) {
				console.error("Gagal memuat data pembayaran", error);
			} finally {
				setLoading(false);
			}
		};
		fetchPaymentData();
	}, [refreshKey]);

	const getPaymentStatus = (regDateStr, paymentHistory) => {
		if (!regDateStr) return { show: false };

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const currentMonth = today.getMonth() + 1;
		const currentYear = today.getFullYear();

		// Prioritas 1: Cek bukti pembayaran untuk bulan ini.
		const proofForThisMonth = paymentHistory?.find(
			(p) => p.payment_month == currentMonth && p.payment_year == currentYear
		);

		if (proofForThisMonth && proofForThisMonth.status === "pending") {
			return { show: true, status: "pending" };
		}

		if (proofForThisMonth && proofForThisMonth.status === "approved") {
			return { show: false }; // Tidak perlu menampilkan notif jika sudah approved
		}

		// --- LOGIKA BARU: Jatuh Tempo Bergulir ---
		// 1. Cari tanggal pembayaran terakhir yang disetujui dari riwayat.
		const latestApprovedPayment = paymentHistory
			?.filter((p) => p.status === "approved")
			.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))[0];

		// 2. Tentukan tanggal dasar.
		const baseDate = latestApprovedPayment
			? new Date(latestApprovedPayment.uploaded_at)
			: new Date(regDateStr);

		// 3. Hitung tanggal jatuh tempo berikutnya.
		const nextDueDate = new Date(
			baseDate.getFullYear(),
			baseDate.getMonth() + 1,
			baseDate.getDate()
		);

		// 4. Hitung sisa hari.
		const timeDiff = nextDueDate.getTime() - today.getTime();
		const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
		const isOverdue = daysRemaining < 0;

		if (daysRemaining <= 7) {
			return { show: true, status: "due", days: daysRemaining, isOverdue };
		}

		return { show: false };
	};

	const StatusBadge = ({ status }) => {
		const styles = {
			approved: { text: "Disetujui", color: "bg-green-100 text-green-800" },
			pending: { text: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
			rejected: { text: "Ditolak", color: "bg-red-100 text-red-800" },
		};
		const current = styles[status] || {};
		return (
			<span
				className={`text-xs px-2 py-0.5 rounded-full font-semibold ${current.color}`}
			>
				{current.text}
			</span>
		);
	};

	return (
		<div className="p-4 sm:p-6">
			<UploadPaymentModal
				isOpen={isUploadModalOpen}
				onClose={() => setIsUploadModalOpen(false)}
				onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
			/>
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Notifikasi Pembayaran Dinamis */}
				{console.log(paymentStatus)}
				{paymentStatus.show && (
					<div
						className={`border-l-4 p-4 rounded-md flex items-center gap-3 ${
							paymentStatus.status === "pending"
								? "bg-blue-100 border-blue-500 text-blue-800"
								: paymentStatus.isOverdue
								? "bg-red-100 border-red-500 text-red-800"
								: "bg-yellow-100 border-yellow-500 text-yellow-800"
						}`}
					>
						<FiAlertCircle size={24} className="flex-shrink-0" />
						<div>
							<p className="font-bold">
								{paymentStatus.status === "pending"
									? "Menunggu Verifikasi"
									: "Pemberitahuan Iuran"}
							</p>
							<p className="text-sm">
								{paymentStatus.status === "pending"
									? "Bukti pembayaran Anda sedang diverifikasi oleh admin."
									: paymentStatus.isOverdue
									? `Pembayaran iuran telah jatuh tempo.`
									: `Jatuh tempo pembayaran dalam ${paymentStatus.days} hari lagi.`}
							</p>
						</div>
					</div>
				)}

				<div className="bg-white rounded-xl shadow-lg p-6">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold text-gray-800">
								Pembayaran & Riwayat
							</h1>
							<p className="text-sm text-gray-500">
								Unggah bukti pembayaran iuran bulanan Anda di sini.
							</p>
						</div>
						<button
							onClick={() => setIsUploadModalOpen(true)}
							className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 bg-green-500 text-white font-semibold rounded-lg"
						>
							<FiUpload /> Ajukan Pembayaran
						</button>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-2">
						Informasi Pembayaran QRIS
					</h2>
					<p className="text-sm text-gray-500 mb-4">
						Pindai (scan) kode QR di bawah ini menggunakan aplikasi perbankan
						atau e-wallet Anda untuk melakukan pembayaran.
					</p>
					<div className="border border-slate-300 rounded-lg p-4 flex flex-col items-center text-center bg-gray-50">
						<img
							src={qrisImage}
							alt="QR Code Pembayaran WAHANA ANAK BANSA"
							className=""
						/>
						<div className="my-4">
							<p className="font-bold text-xl text-gray-800">
								WAHANA ANAK BANSA
							</p>
							<p className="text-sm text-gray-600 font-mono">
								NMID: ID2023259295780
							</p>
						</div>
						<a
							href={qrisPdf}
							download="QRIS_WAHANA_ANAK_BANSA.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-6 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
						>
							<FiDownload /> Unduh QRIS
						</a>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-lg p-6">
					<h2 className="text-xl font-bold text-gray-800 mb-4">
						Riwayat Pembayaran Saya
					</h2>
					<div className="space-y-3">
						{loading ? (
							<p>Memuat...</p>
						) : history.length > 0 ? (
							history.map((item) => (
								<div
									key={item.id}
									className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors gap-3"
								>
									<div className="flex-1">
										<p className="font-semibold">
											Iuran Bulan {item.payment_month}, {item.payment_year}
										</p>
										<p className="text-xs text-gray-500">
											Diunggah pada:{" "}
											{new Date(item.uploaded_at).toLocaleDateString("id-ID")}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<StatusBadge status={item.status} />
										{item.proof_url && (
											<a
												href={`${API_URL}${item.proof_url}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
												title="Lihat Bukti Pembayaran"
											>
												<FiDownload size={14} />
												<span>Lihat Bukti</span>
											</a>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-sm text-gray-500 text-center py-4">
								Anda belum memiliki riwayat pembayaran.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentPage;
