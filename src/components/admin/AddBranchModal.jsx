// --- File: src/components/admin/AddBranchModal.jsx ---
// Komponen Modal untuk menambah cabang baru
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FiPlus, FiMapPin } from "react-icons/fi";

const AddBranchModal = ({ isOpen, onClose, refetch }) => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name) {
			setError("Nama cabang tidak boleh kosong.");
			return;
		}
		setLoading(true);
		setError("");

		try {
			await axios.post("/api/branches/create", { name, address });
			alert("Cabang baru berhasil ditambahkan!");
			refetch();
			onClose();
			setName("");
			setAddress("");
		} catch (err) {
			setError(err.response?.data?.message || "Gagal menambahkan cabang.");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-lg relative shadow-xl">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					Tambah Cabang Baru
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nama Cabang
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Contoh: SSB Bogor Barat"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Alamat (Opsional)
						</label>
						<textarea
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder="Masukkan alamat lengkap cabang"
							rows="3"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D91E5B]"
						></textarea>
					</div>
					{error && <p className="text-sm text-center text-red-500">{error}</p>}
					<div className="flex justify-end gap-4 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
						>
							Batal
						</button>
						<button
							type="submit"
							disabled={loading}
							className="px-4 py-2 bg-[#D91E5B] text-white rounded-lg disabled:opacity-50"
						>
							{loading ? "Menyimpan..." : "Simpan Cabang"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddBranchModal;
