import React, { useState } from "react";
import api from "../services/api";
import Swal from "sweetalert2";

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
			await api.post("/api/members/upload-payment", formData, {
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

export default AdminUploadPaymentModal;
