import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditBranchModal = ({ isOpen, onClose, refetch, branchData }) => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (branchData) {
			setName(branchData.name);
			setAddress(branchData.address || "");
		}
	}, [branchData]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name) {
			Swal.fire("Validasi Gagal", "Nama cabang tidak boleh kosong.", "warning");
			return;
		}
		setLoading(true);
		try {
			await axios.put(`/api/branches/${branchData.id}`, {
				id: branchData.id,
				name,
				address,
			});
			Swal.fire("Berhasil!", "Data cabang telah diperbarui.", "success");
			refetch();
			onClose();
		} catch (err) {
			Swal.fire(
				"Gagal!",
				err.response?.data?.message || "Gagal memperbarui cabang.",
				"error"
			);
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-8 w-full max-w-lg relative shadow-xl">
				<h2 className="text-2xl font-bold mb-6 text-gray-800">
					Edit Data Cabang
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
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
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
							rows="3"
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-secondary"
						></textarea>
					</div>
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
							className="px-4 py-2 bg-secondary text-white rounded-lg disabled:opacity-50"
						>
							{loading ? "Menyimpan..." : "Simpan Perubahan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditBranchModal;
