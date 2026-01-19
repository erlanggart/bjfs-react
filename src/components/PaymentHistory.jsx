import React, { useState, useEffect } from "react";
import api from "../services/api";
import Swal from "sweetalert2";
import { FiUpload, FiEye, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import AdminUploadPaymentModal from "./AdminUploadPaymentModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentHistory = ({ memberId, refetchParent }) => {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [visibleCount, setVisibleCount] = useState(3); // Tampilkan 3 item pertama
	const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const response = await api.get(
					`/api/members/payment-history/${memberId}`,
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
					await api.put(`/api/members/payment-status/${proofId}`, {
						status: newStatus,
					});
					Swal.fire(
						"Berhasil!",
						"Status pembayaran telah diperbarui.",
						"success",
					);
					refetchParent(); // Panggil fungsi refetch dari parent
				} catch (err) {
					Swal.fire(
						"Gagal!",
						err.response?.data?.message || "Gagal memverifikasi pembayaran.",
						"error",
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
								<div className="flex-1">
									<p className="font-semibold">
										Iuran Bulan {item.payment_month}, {item.payment_year}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<p className="text-xs text-gray-500">
											Diunggah:{" "}
											{new Date(item.uploaded_at).toLocaleDateString("id-ID")}
										</p>
										{item.payment_type && (
											<span
												className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
													item.payment_type === "full"
														? "bg-green-100 text-green-700"
														: "bg-blue-100 text-blue-700"
												}`}
											>
												{item.payment_type === "full" ? "Full Payment" : "Cuti"}
											</span>
										)}
									</div>
								</div>
								<div className="flex-shrink-0">
									<StatusBadge status={item.status} />
								</div>
							</div>
							<div className="mt-3 pt-3 border-t border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
								<a
									href={`${API_BASE_URL}${item.proof_url}`}
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

export default PaymentHistory;
